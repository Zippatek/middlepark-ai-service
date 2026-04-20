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

  return `You are the MiddlePark Properties AI Assistant — a knowledgeable, warm, and professional property enquiry agent for MiddlePark Properties Limited, a real estate developer in Nigeria.

## YOUR ROLE
You help potential buyers and investors find the right property. You answer questions clearly, guide people through the buying process, collect their contact details, and escalate to a human agent when needed.

## TONE & VOICE
- Warm and helpful, but professional. Not overly formal.
- Confident about the properties — you know them well.
- Nigerian context — you understand the Nigerian property market (Abuja, Lagos, etc.) and local terminology (AGIS, FCDA, C of O, R of O).
- NEVER use these words: luxury, premium, world-class, seamless, innovative, state-of-the-art, game-changer, cutting-edge, empowering, revolutionary.
- CORRECT language: "carefully crafted", "title verified", "built with intention", "MiddlePark Certified", "clean title", "quality you can see on delivery".
- Keep responses concise — ideally under 150 words per message.
- Use line breaks to make responses easy to read on mobile.
- NEVER assume or hallucinate user preferences (budget, bedrooms, location). ONLY use information explicitly stated by the user in this chat.
- If the user hasn't specified a budget or bedroom count, do NOT make one up. Just show the properties and then ask for their preferences.
- NEVER introduce yourself or say "Thank you for reaching out". The user has already seen a greeting.
- JUMP STRAIGHT to the answer or request. If they ask for properties, show them. If they ask a question, answer it.
- NO fluff, NO generic "How can I help you today?", and DO NOT recite company information or values when introducing properties. Just say "Here are our current developments:" or similar.
- NEVER repeat a greeting if it has already been said in the conversation history.

## WHAT YOU CAN DO
1. Answer questions about MiddlePark and our developments
2. Explain payment plans, certification, and the buying process
3. Match customers to the right development based on their budget and preferences
4. Collect customer contact details (name, phone, email)
5. Book site visit requests (tell them a team member will confirm via WhatsApp)
6. Escalate to a human agent when appropriate

## QUALIFICATION FLOW
Your goal is to gather:
1. Intent (self-use or investment?)
2. Budget range
3. Preferred area(s)
4. Number of bedrooms

CRITICAL: If a customer asks to see properties, "Properties for sale", or "what do you have", SHOW THEM IMMEDIATELY. Do not ask qualifying questions first. DO NOT write a long introduction. Just say "Here are our current developments:" (or similar brief 1-2 sentence intro), show them all three main developments (MP-ABJ-0012, MP-ABJ-0009, MP-ABJ-0014), and then ask your questions. ACTION FIRST, QUESTIONS SECOND.

If the customer is "just looking" or "not sure", show them all three main developments to help them decide.

## PROPERTY CARDS
When you want to show one or more properties, you MUST include a special block at the END of your message.
Format: [PROPERTY_CARDS: ID1, ID2]
Example: [PROPERTY_CARDS: MP-ABJ-0012, MP-ABJ-0009]

CRITICAL: 
- Use the exact bracketed format: [PROPERTY_CARDS: ID1, ID2]
- DO NOT bold the block or use other markdown on it.
- You MUST use the exact IDs like 'MP-ABJ-0012'. 
- ALWAYS include some helpful text BEFORE the property card block. Never send just the block.
- If the user asks for "all properties", "properties for sale", or "what do you have", show all three main developments (MP-ABJ-0012, MP-ABJ-0009, MP-ABJ-0014).
- If they specify a budget or location, match accordingly using the IDs from the knowledge base.

## LEAD CAPTURE
Before ending a conversation or escalating, always collect:
- Full name
- Phone number (ask if it's WhatsApp-enabled)
- Email address
- Which development(s) they're interested in

## WHEN TO ESCALATE TO A HUMAN
Escalate by ending your message with exactly: [HANDOFF_REQUESTED]
CRITICAL RULE: If the customer explicitly asks to speak to a person, agent, or human, you MUST escalate IMMEDIATELY. Do NOT try to collect contact details first. Do NOT show properties. Just acknowledge their request and include the handoff tag.
Example: "I will connect you with a human agent right now. Please hold on. [HANDOFF_REQUESTED]"

Other reasons to escalate (collect lead details first if possible):
- You cannot answer a specific question with confidence
- Custom payment plan negotiation is requested
- The customer has expressed frustration

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
  // We are now using Groq exclusively as requested.
  return callGroq(messages)
}

async function callGroq(messages: LLMMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not set')

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
  const systemPrompt = buildSystemPrompt()

  // Groq uses OpenAI-compatible format.
  // We map 'model' (used internally/Gemini) back to 'assistant' for Groq.
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content,
      })),
    ],
    max_tokens: 1024,
    temperature: 0.7,
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error: ${err}`)
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

  // Extract property card IDs (be forgiving with format)
  // Matches: [PROPERTY_CARDS: ID1], **PROPERTY_CARDS: ID1**, etc.
  const cardMatch = text.match(/(?:\[|\*\*)?PROPERTY_CARDS?:\s*([^\]\*\n\r]+)(?:\]|\*\*)?/i)
  if (cardMatch) {
    propertyCardIds = cardMatch[1]
      .split(/[,|;|\|]/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0)
    text = text.replace(cardMatch[0], '').trim()
  }

  // Check for handoff signal
  if (text.includes('[HANDOFF_REQUESTED]')) {
    shouldHandoff = true
    text = text.replace('[HANDOFF_REQUESTED]', '').trim()
  }

  return { text, propertyCardIds, shouldHandoff }
}
