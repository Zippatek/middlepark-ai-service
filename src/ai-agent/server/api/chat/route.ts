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
    const llmMessages: LLMMessage[] = []

    // If this is the very first user message, the user has likely already seen 
    // the frontend's hardcoded greeting. We inject it into the history (without saving)
    // so the AI doesn't repeat it.
    if (conv.messages.length === 1 && conv.messages[0].role === 'user') {
      llmMessages.push({
        role: 'assistant',
        content: "Hello! Welcome to MiddlePark Properties. I'm here to help you find the right home.\n\nAre you looking to buy for yourself or as an investment? And what's your approximate budget?",
      })
    }

    for (const msg of conv.messages) {
      if (msg.role === 'user') {
        llmMessages.push({ role: 'user', content: msg.content })
      } else if (msg.role === 'assistant') {
        llmMessages.push({ role: 'assistant', content: msg.content })
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

    // Intent detection (even if AI returned text)
    const lowerMsg = message.toLowerCase()
    const wantsProperties = 
      lowerMsg.includes('show') || 
      lowerMsg.includes('property') || 
      lowerMsg.includes('properties') || 
      lowerMsg.includes('available') ||
      lowerMsg.includes('all') ||
      lowerMsg.includes('what') && lowerMsg.includes('have')

    // Build assistant message
    let content = parsed.text

    // If the user wants properties but AI didn't provide any cards, force them
    if (wantsProperties && propertyCards.length === 0) {
      // AI was too talkative or missed the cards — let's help it
      propertyCardIds = DEVELOPMENTS.map(d => d.id)
      const forcedCards = propertyCardIds.map(id => toPropertyCard(DEVELOPMENTS.find(d => d.id === id)!))
      propertyCards.push(...forcedCards)
      
      if (!content) {
        content = "Certainly! Here are our current developments:"
      }
    }

    // Generic fallback if still no content
    if (!content) {
      content = "I'm sorry, I didn't quite catch that. Could you please tell me more about what you're looking for? I'd love to help you find the right property."
    }

    // Handle proactive handoff detection
    const wantsAgent = 
      lowerMsg.includes('agent') || 
      lowerMsg.includes('human') || 
      lowerMsg.includes('person') || 
      lowerMsg.includes('speak to') || 
      lowerMsg.includes('talk to') ||
      lowerMsg.includes('support')

    if (wantsAgent) {
      parsed.shouldHandoff = true
      // Clear out any property cards the AI might have tried to force
      propertyCards.length = 0
      content = "Absolutely. I'm transferring you to one of our dedicated property consultants now. They will be right with you."
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
