// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai-agent/chat
// Receives a visitor message, calls the LLM, returns the AI reply.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import {
  getOrCreateConversation,
  addMessage,
  updateConversation,
  callLLM,
  parseAIResponse,
  buildSystemPrompt,
  type LLMMessage,
} from '../../../server/agent'
import { DEVELOPMENTS, toPropertyCard } from '../../../server/knowledge'
import { nanoid } from '../../../server/utils'
import type { ChatMessage } from '../../../server/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const conv = getOrCreateConversation(sessionId)
  return NextResponse.json({
    conversationId: conv.id,
    status: conv.status,
    messages: conv.messages,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, message, visitorName } = body

    if (!sessionId || !message) {
      return NextResponse.json({ error: 'sessionId and message are required' }, { status: 400 })
    }

    // Get or create conversation
    const conv = getOrCreateConversation(sessionId)

    // Update visitor name if provided
    if (visitorName && !conv.visitorInfo.name) {
      updateConversation(conv.id, {
        visitorInfo: { ...conv.visitorInfo, name: visitorName },
      })
    }

    // Add visitor message
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }
    addMessage(conv.id, userMessage)

    // If conversation is being handled by a human, don't respond with AI
    if (conv.status === 'human_active') {
      return NextResponse.json({
        reply: null,
        conversationId: conv.id,
        status: conv.status,
        message: 'Conversation is being handled by a human agent',
      })
    }

    // Build LLM message history
    // For Gemini: use 'user' and 'model' roles
    // For OpenAI: the system prompt is injected in the callLLM function
    const provider = process.env.AI_PROVIDER || 'gemini'

    const llmMessages: LLMMessage[] = []

    // For Gemini, we need to embed system prompt as first user message (Gemini doesn't have system role)
    if (provider === 'gemini') {
      llmMessages.push({
        role: 'user',
        content: `[SYSTEM INSTRUCTIONS - READ CAREFULLY]\n${buildSystemPrompt()}\n\n[END SYSTEM INSTRUCTIONS]\n\nNow begin the conversation. User's first message: ${message}`,
      })

      // Add prior conversation history (skip the first user message since we embedded it above)
      const priorMessages = conv.messages.slice(0, -1) // exclude the just-added message
      for (const msg of priorMessages) {
        if (msg.role === 'user') {
          llmMessages.push({ role: 'user', content: msg.content })
        } else if (msg.role === 'assistant') {
          llmMessages.push({ role: 'model', content: msg.content })
        }
        // Skip agent messages in AI context
      }

      // Add the current user message
      if (conv.messages.length > 1) {
        llmMessages.push({ role: 'user', content: message })
      }
    } else {
      // OpenAI — system prompt is handled in callLLM, just build history
      for (const msg of conv.messages) {
        if (msg.role === 'user') {
          llmMessages.push({ role: 'user', content: msg.content })
        } else if (msg.role === 'assistant') {
          llmMessages.push({ role: 'assistant', content: msg.content })
        }
      }
    }

    // Call LLM
    const rawResponse = await callLLM(llmMessages)
    console.log('[AI Agent] Raw Response:', rawResponse)

    // Parse response
    const parsed = parseAIResponse(rawResponse)
    console.log('[AI Agent] Parsed Response:', parsed)

    // Build property cards if requested
    let propertyCardIds = parsed.propertyCardIds

    // If the AI says "all", expand it
    if (propertyCardIds.length === 1 && propertyCardIds[0].toLowerCase() === 'all') {
      propertyCardIds = DEVELOPMENTS.map((d) => d.id)
    }

    const propertyCards = propertyCardIds
      .map((idOrName) => {
        // Try exact ID match
        let dev = DEVELOPMENTS.find((d) => d.id === idOrName)
        if (dev) return dev

        // Try slug match
        dev = DEVELOPMENTS.find((d) => d.slug === idOrName.toLowerCase())
        if (dev) return dev

        // Try fuzzy name match
        dev = DEVELOPMENTS.find((d) =>
          d.name.toLowerCase().includes(idOrName.toLowerCase()),
        )
        return dev
      })
      .filter(Boolean)
      .map((d) => toPropertyCard(d!))

    // Build assistant message
    let content = parsed.text
    if (!content && propertyCards.length > 0) {
      content = 'Here are the properties I found for you:'
    }

    const assistantMessage: ChatMessage = {
      id: nanoid(),
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      propertyCards: propertyCards.length > 0 ? propertyCards : undefined,
    }
    addMessage(conv.id, assistantMessage)

    // Handle handoff
    if (parsed.shouldHandoff) {
      updateConversation(conv.id, { status: 'waiting_for_human' })
    }

    return NextResponse.json({
      reply: assistantMessage,
      conversationId: conv.id,
      status: parsed.shouldHandoff ? 'waiting_for_human' : conv.status,
      shouldHandoff: parsed.shouldHandoff,
    })
  } catch (error) {
    console.error('[AI Agent Chat] Error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
