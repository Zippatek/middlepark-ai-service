// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEPARK AI AGENT — TYPE DEFINITIONS
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'agent'

export type ConversationStatus =
  | 'ai_active'
  | 'waiting_for_human'
  | 'human_active'
  | 'resolved'

export type LeadStage =
  | 'greeting'
  | 'qualifying'
  | 'matching'
  | 'deep_questions'
  | 'lead_capture'
  | 'resolved'
  | 'escalated'

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string        // ISO 8601
  agentName?: string       // For 'agent' role messages — CS agent display name
  propertyCards?: PropertyCardData[]  // Optional inline property cards
}

export interface PropertyCardData {
  id: string               // e.g. "MP-ABJ-0012"
  name: string
  slug: string
  location: string
  status: string
  priceFrom: number
  bedrooms: number[]
  image?: string
}

// ─── CONVERSATION ─────────────────────────────────────────────────────────────

export interface Conversation {
  id: string
  sessionId: string        // Browser-side UUID
  status: ConversationStatus
  leadStage: LeadStage
  messages: ChatMessage[]
  visitorInfo: VisitorInfo
  leadData: LeadData
  assignedAgentId?: string
  assignedAgentName?: string
  startedAt: string
  lastMessageAt: string
  resolvedAt?: string
  internalNotes?: InternalNote[]
}

export interface VisitorInfo {
  name?: string
  email?: string
  phone?: string
  userAgent?: string
  referrer?: string
}

export interface LeadData {
  intent?: 'buy' | 'invest' | 'unknown'
  budgetMin?: number
  budgetMax?: number
  bedroomsNeeded?: number
  areasOfInterest?: string[]
  developmentsInterested?: string[]  // Development IDs
}

export interface InternalNote {
  id: string
  agentId: string
  agentName: string
  content: string
  createdAt: string
}

// ─── API REQUEST / RESPONSE ───────────────────────────────────────────────────

export interface SendMessageRequest {
  sessionId: string
  message: string
  visitorName?: string
}

export interface SendMessageResponse {
  reply: ChatMessage
  conversationId: string
  status: ConversationStatus
  shouldHandoff?: boolean   // True if AI decided to escalate
}

export interface HandoffRequest {
  conversationId: string
  reason?: string
}

export interface TakeOverRequest {
  conversationId: string
  agentId: string
  agentName: string
}

export interface AgentReplyRequest {
  conversationId: string
  agentId: string
  agentName: string
  message: string
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export interface ConversationSummary {
  id: string
  sessionId: string
  status: ConversationStatus
  visitorName: string
  lastMessage: string
  lastMessageAt: string
  startedAt: string
  unreadCount: number
  developmentInterest?: string
}

export interface DashboardStats {
  totalToday: number
  aiActive: number
  waitingForHuman: number
  humanActive: number
  resolvedToday: number
}

// ─── AGENT CONFIG ─────────────────────────────────────────────────────────────

export interface AgentConfig {
  provider: 'gemini' | 'openai'
  model: string
  maxTokens: number
  temperature: number
  systemPrompt: string
}
