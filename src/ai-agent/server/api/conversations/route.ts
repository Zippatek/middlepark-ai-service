// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/ai-agent/conversations     → List all conversations (admin)
// GET  /api/ai-agent/conversations?id= → Get a single conversation
// POST /api/ai-agent/conversations/takeover  → Agent takes over conversation
// POST /api/ai-agent/conversations/reply     → Agent sends a message
// POST /api/ai-agent/conversations/resolve   → Mark conversation as resolved
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import {
  getAllConversations,
  getConversation,
  updateConversation,
  addMessage,
} from '../../../server/agent'
import { nanoid } from '../../../server/utils'
import type { ChatMessage } from '../../../server/types'

// ─── GET — List or fetch single conversation ──────────────────────────────────

export async function GET(req: NextRequest) {
  // Basic dashboard auth check
  const authHeader = req.headers.get('x-dashboard-token')
  if (!isValidDashboardToken(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const statusFilter = searchParams.get('status')

  if (id) {
    const conv = getConversation(id)
    if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    return NextResponse.json({ conversation: conv })
  }

  let conversations = getAllConversations()

  if (statusFilter && statusFilter !== 'all') {
    conversations = conversations.filter((c) => c.status === statusFilter)
  }

  // Return summaries (not full message history) for the list view
  const summaries = conversations.map((c) => ({
    id: c.id,
    sessionId: c.sessionId,
    status: c.status,
    visitorName: c.visitorInfo.name || 'Anonymous Visitor',
    lastMessage: c.messages[c.messages.length - 1]?.content?.slice(0, 80) + '...' || '',
    lastMessageAt: c.lastMessageAt,
    startedAt: c.startedAt,
    unreadCount: 0, // TODO: implement unread tracking
    developmentInterest: c.leadData.developmentsInterested?.join(', '),
  }))

  // Dashboard stats
  const all = getAllConversations()
  const today = new Date().toDateString()
  const stats = {
    totalToday: all.filter((c) => new Date(c.startedAt).toDateString() === today).length,
    aiActive: all.filter((c) => c.status === 'ai_active').length,
    waitingForHuman: all.filter((c) => c.status === 'waiting_for_human').length,
    humanActive: all.filter((c) => c.status === 'human_active').length,
    resolvedToday: all.filter(
      (c) => c.status === 'resolved' && c.resolvedAt && new Date(c.resolvedAt).toDateString() === today,
    ).length,
  }

  return NextResponse.json({ conversations: summaries, stats })
}

// ─── POST — Admin actions ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-dashboard-token')
  if (!isValidDashboardToken(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { action } = body

  if (action === 'takeover') {
    const { conversationId, agentId, agentName } = body
    const conv = getConversation(conversationId)
    if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })

    const updated = updateConversation(conversationId, {
      status: 'human_active',
      assignedAgentId: agentId,
      assignedAgentName: agentName,
    })

    // Add a system message in the thread
    const systemMsg: ChatMessage = {
      id: nanoid(),
      role: 'assistant',
      content: `You're now chatting with ${agentName} from the MiddlePark team. How can I help you?`,
      timestamp: new Date().toISOString(),
      agentName,
    }
    addMessage(conversationId, systemMsg)

    return NextResponse.json({ conversation: updated, systemMessage: systemMsg })
  }

  if (action === 'agent_reply') {
    const { conversationId, agentId, agentName, message } = body
    const conv = getConversation(conversationId)
    if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    if (conv.status !== 'human_active') {
      return NextResponse.json({ error: 'Conversation is not in human_active state' }, { status: 400 })
    }

    const agentMessage: ChatMessage = {
      id: nanoid(),
      role: 'agent',
      content: message,
      timestamp: new Date().toISOString(),
      agentName,
    }
    addMessage(conversationId, agentMessage)

    return NextResponse.json({ message: agentMessage })
  }

  if (action === 'resolve') {
    const { conversationId } = body
    const updated = updateConversation(conversationId, {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    })
    return NextResponse.json({ conversation: updated })
  }

  if (action === 'add_note') {
    const { conversationId, agentId, agentName, content } = body
    const conv = getConversation(conversationId)
    if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })

    const note = {
      id: nanoid(),
      agentId,
      agentName,
      content,
      createdAt: new Date().toISOString(),
    }
    const updated = updateConversation(conversationId, {
      internalNotes: [...(conv.internalNotes || []), note],
    })
    return NextResponse.json({ note, conversation: updated })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

// ─── AUTH HELPER ──────────────────────────────────────────────────────────────

function isValidDashboardToken(token: string | null): boolean {
  if (!token) return false
  const expected = process.env.AGENT_DASHBOARD_TOKEN || 'middlepark-cs-2026'
  return token === expected
}
