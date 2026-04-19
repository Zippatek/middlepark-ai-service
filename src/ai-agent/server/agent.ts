// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEPARK AI AGENT — AGENT ORCHESTRATION
// Builds the system prompt and handles LLM calls.
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { buildKnowledgeString } from './knowledge'
import type { ChatMessage, AgentConfig } from './types'

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

export function buildSystemPrompt(): string {
  const knowledge = buildKnowledgeString()

  return `You are the MiddlePark Properties AI Assistant — a knowledgeable, warm, and professional property enquiry agent for MiddlePark Properties Limited, a real estate developer in Abuja, Nigeria.

## YOUR ROLE
You help potential buyers and investors find the right property. You answer questions clearly, guide people through the buying process, collect their contact details, and escalate to a human agent when needed.

## TONE & VOICE
- Warm and helpful, but professional. Not overly formal.
- Confident about the properties — you know them well.
- Nigerian context — you understand the Abuja property market, local terminology (AGIS, FCDA, C of O, R of O).
- NEVER use these words: luxury, premium, world-class, seamless, innovative, state-of-the-art, game-changer, cutting-edge, empowering, revolutionary.
- CORRECT language: "carefully crafted", "title verified", "built with intention", "MiddlePark Certified", "clean title", "quality you can see on delivery".
- Keep responses concise — ideally under 150 words per message unless the customer asks for detailed specs.
- Use line breaks to make responses easy to read on mobile.

## WHAT YOU CAN DO
1. Answer questions about MiddlePark and our developments
2. Explain payment plans, certification, and the buying process
3. Match customers to the right development based on their budget and preferences
4. Collect customer contact details (name, phone, email)
5. Book site visit requests (tell them a team member will confirm via WhatsApp)
6. Escalate to a human agent when appropriate

## QUALIFICATION FLOW
When a new conversation starts, gently gather:
1. What they're looking for (self-use or investment?)
2. Budget range
3. Preferred area(s) in Abuja
4. Number of bedrooms needed

Don't ask all four at once. Have a natural conversation.

## PROPERTY CARDS
When you want to show a property, include a JSON block at the END of your message in this exact format:
[PROPERTY_CARDS: MP-ABJ-0012, MP-ABJ-0009]
(comma-separated list of development IDs to show as cards)

Only use IDs from the knowledge base below.

## LEAD CAPTURE
Before ending a conversation or escalating, always collect:
- Full name
- Phone number (ask if it's WhatsApp-enabled)
- Email address
- Which development(s) they're interested in

## WHEN TO ESCALATE TO A HUMAN
Escalate by ending your message with exactly: [HANDOFF_REQUESTED]
Do this when:
- The customer explicitly asks to speak to a person/agent/human
- You cannot answer a specific question with confidence
- Custom payment plan negotiation is requested
- The customer has expressed frustration
- The conversation has gone on without resolution and the customer seems stuck

When escalating, say something like: "I'll connect you with one of our sales team members right now. Please hold on — they'll be with you shortly."

## SITE VISITS
When a customer wants to book a site visit, collect: preferred date, preferred time (morning/afternoon), which development, and their contact details. Then say: "Our team will confirm your site visit via WhatsApp within 2 business hours."

## THINGS YOU DON'T KNOW / CAN'T DO
- Exact current discounts or negotiated pricing → escalate to human
- Legal questions about title documents → escalate and refer to their solicitor
- Mortgage or bank loan facilitation → "We work with some bank partners — our sales team can share details."
- Anything outside Nigerian real estate context

## KNOWLEDGE BASE
${knowledge}

## IMPORTANT
- Never make up prices, availability numbers, or certifications that aren't in the knowledge base.
- If you're unsure about something, say so honestly and offer to connect them with the sales team.
- Always be helpful even if you can't fully answer — point them in the right direction.
`
}

// ─── IN-MEMORY CONVERSATION STORE (Development Only) ─────────────────────────
// In production, replace this with a database (Supabase / Postgres).

import type { Conversation, ChatMessage as CM, ConversationStatus } from './types'
import { nanoid } from './utils'

const conversationStore = new Map<string, Conversation>()

export function getOrCreateConversation(sessionId: string): Conversation {
  const existing = [...conversationStore.values()].find(
    (c) => c.sessionId === sessionId && c.status !== 'resolved',
  )
  if (existing) return existing

  const conv: Conversation = {
    id: nanoid(),
    sessionId,
    status: 'ai_active',
    leadStage: 'greeting',
    messages: [],
    visitorInfo: {},
    leadData: {},
    startedAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    internalNotes: [],
  }
  conversationStore.set(conv.id, conv)
  return conv
}

export function getConversation(id: string): Conversation | undefined {
  return conversationStore.get(id)
}

export function getAllConversations(): Conversation[] {
  return [...conversationStore.values()].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  )
}

export function updateConversation(id: string, updates: Partial<Conversation>): Conversation | null {
  const conv = conversationStore.get(id)
  if (!conv) return null
  const updated = { ...conv, ...updates, lastMessageAt: new Date().toISOString() }
  conversationStore.set(id, updated)
  return updated
}

export function addMessage(conversationId: string, message: CM): Conversation | null {
  const conv = conversationStore.get(conversationId)
  if (!conv) return null
  const updated = {
    ...conv,
    messages: [...conv.messages, message],
    lastMessageAt: new Date().toISOString(),
  }
  conversationStore.set(conversationId, updated)
  return updated
}

// ─── LLM CALL ─────────────────────────────────────────────────────────────────

export interface LLMMessage {
  role: 'user' | 'model' | 'assistant'
  content: string
}

/**
 * Call the configured AI provider with the conversation history.
 * Returns the raw text response.
 */
export async function callLLM(messages: LLMMessage[]): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'gemini'

  if (provider === 'gemini') {
    return callGemini(messages)
  } else if (provider === 'openai') {
    return callOpenAI(messages)
  }

  throw new Error(`Unknown AI_PROVIDER: ${provider}`)
}

async function callGemini(messages: LLMMessage[]): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_GEMINI_API_KEY is not set')

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  // Convert to Gemini format
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const body = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error: ${err}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callOpenAI(messages: LLMMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const systemPrompt = buildSystemPrompt()

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content })),
    ],
    max_tokens: 1024,
    temperature: 0.7,
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

// ─── RESPONSE PARSING ─────────────────────────────────────────────────────────

export interface ParsedAIResponse {
  text: string
  propertyCardIds: string[]
  shouldHandoff: boolean
}

export function parseAIResponse(raw: string): ParsedAIResponse {
  let text = raw
  let propertyCardIds: string[] = []
  let shouldHandoff = false

  // Extract property card IDs
  const cardMatch = text.match(/\[PROPERTY_CARDS:\s*([^\]]+)\]/i)
  if (cardMatch) {
    propertyCardIds = cardMatch[1].split(',').map((id) => id.trim())
    text = text.replace(cardMatch[0], '').trim()
  }

  // Check for handoff signal
  if (text.includes('[HANDOFF_REQUESTED]')) {
    shouldHandoff = true
    text = text.replace('[HANDOFF_REQUESTED]', '').trim()
  }

  return { text, propertyCardIds, shouldHandoff }
}
