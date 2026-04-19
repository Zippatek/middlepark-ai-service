'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ConversationDetail — Right panel: full conversation thread + actions
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import {
  UserCheck, CheckCircle2, Bot, User, Phone, Mail, Building2, Calendar,
} from 'lucide-react'
import { ConversationBadge } from './ConversationBadge'
import { AgentInput } from './AgentInput'
import { PropertyCard } from '../client/PropertyCard'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'agent'
  content: string
  timestamp: string
  agentName?: string
  propertyCards?: any[]
}

interface Conversation {
  id: string
  status: 'ai_active' | 'waiting_for_human' | 'human_active' | 'resolved'
  visitorInfo: { name?: string; email?: string; phone?: string }
  leadData: {
    intent?: string
    budgetMin?: number
    budgetMax?: number
    areasOfInterest?: string[]
    developmentsInterested?: string[]
  }
  messages: Message[]
  startedAt: string
  assignedAgentName?: string
  internalNotes?: { id: string; agentName: string; content: string; createdAt: string }[]
}

interface ConversationDetailProps {
  conversation: Conversation | null
  agentId: string
  agentName: string
  onTakeOver: (conversationId: string) => Promise<void>
  onSendMessage: (conversationId: string, message: string) => Promise<void>
  onAddNote: (conversationId: string, note: string) => Promise<void>
  onResolve: (conversationId: string) => Promise<void>
  isLoading: boolean
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(0)}M`
  return `₦${amount.toLocaleString('en-NG')}`
}

export function ConversationDetail({
  conversation,
  agentId,
  agentName,
  onTakeOver,
  onSendMessage,
  onAddNote,
  onResolve,
  isLoading,
}: ConversationDetailProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#FAFAFA' }}>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#F0F4F1' }}
          >
            <Bot size={28} strokeWidth={1} style={{ color: '#C8D9CC' }} />
          </div>
          <p className="text-sm font-medium" className="text-charcoal-light">Select a conversation</p>
          <p className="text-xs mt-1" style={{ color: '#BBBCBF' }}>to view the full thread</p>
        </div>
      </div>
    )
  }

  const canTakeOver = conversation.status === 'waiting_for_human' || conversation.status === 'ai_active'
  const isHumanActive = conversation.status === 'human_active'
  const isResolved = conversation.status === 'resolved'

  return (
    <div className="flex h-full">
      {/* ── Main Thread ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid #E8EDE9', background: '#fff' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#F0F4F1' }}
            >
              <User size={16} strokeWidth={1.5} className="text-charcoal" />
            </div>
            <div>
              <p className="text-sm font-semibold" className="text-charcoal">
                {conversation.visitorInfo.name || 'Anonymous Visitor'}
              </p>
              <ConversationBadge status={conversation.status} size="sm" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Take Over button */}
            {canTakeOver && !isResolved && (
              <button
                onClick={() => onTakeOver(conversation.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                className="bg-green"
              >
                <UserCheck size={14} strokeWidth={1.5} />
                Take Over
              </button>
            )}

            {/* Resolve button */}
            {isHumanActive && (
              <button
                onClick={() => onResolve(conversation.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                style={{ backgroundColor: '#F0F4F1', color: '#5A5B5F' }}
              >
                <CheckCircle2 size={14} strokeWidth={1.5} />
                Resolve
              </button>
            )}

            {isResolved && (
              <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: '#F0F4F1', color: '#286B38' }}>
                ✓ Resolved
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ background: '#FAFAFA' }}>
          {conversation.messages.map((msg) => {
            const isUser = msg.role === 'user'
            const isAgentMsg = msg.role === 'agent' || (msg.role === 'assistant' && msg.agentName)
            const isAI = msg.role === 'assistant' && !msg.agentName

            return (
              <div key={msg.id} className={`flex gap-2.5 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: isUser ? '#F0F4F1' : isAgentMsg ? '#286B38' : '#E8EDE9',
                  }}
                >
                  {isUser ? (
                    <User size={13} strokeWidth={1.5} className="text-charcoal" />
                  ) : isAgentMsg ? (
                    <UserCheck size={13} strokeWidth={1.5} style={{ color: '#fff' }} />
                  ) : (
                    <Bot size={13} strokeWidth={1.5} className="text-green" />
                  )}
                </div>

                <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                  {/* Role label */}
                  {!isUser && (
                    <p className="text-[10px] mb-1 font-medium" style={{
                      color: isAgentMsg ? '#286B38' : '#9A9B9F'
                    }}>
                      {isAgentMsg ? (msg.agentName || agentName) : 'AI Assistant'}
                    </p>
                  )}

                  {/* Bubble */}
                  <div
                    className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      backgroundColor: isUser
                        ? '#286B38'
                        : isAgentMsg
                        ? '#EBF2ED'
                        : '#fff',
                      color: isUser ? '#fff' : '#5A5B5F',
                      border: isUser ? 'none' : '1px solid #E8EDE9',
                      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    }}
                  >
                    {msg.content}
                  </div>

                  {/* Property cards */}
                  {msg.propertyCards && msg.propertyCards.length > 0 && (
                    <div className="mt-2 grid grid-cols-1 gap-2 w-full max-w-xs">
                      {msg.propertyCards.map((card: any) => (
                        <PropertyCard key={card.id} card={card} />
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] mt-1" style={{ color: '#BBBCBF' }}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Agent Input */}
        {isHumanActive && (
          <AgentInput
            onSendMessage={(msg) => onSendMessage(conversation.id, msg)}
            onAddNote={(note) => onAddNote(conversation.id, note)}
            isLoading={isLoading}
            agentName={agentName}
          />
        )}

        {!isHumanActive && !isResolved && canTakeOver && (
          <div
            className="px-5 py-4 text-center text-xs flex-shrink-0"
            style={{ borderTop: '1px solid #E8EDE9', background: '#F8F7F3', color: '#9A9B9F' }}
          >
            Click <strong className="text-green">Take Over</strong> to start chatting with this customer.
          </div>
        )}
      </div>

      {/* ── Sidebar: Visitor Info ──────────────────────────────────── */}
      <div
        className="w-64 flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ borderLeft: '1px solid #E8EDE9', background: '#fff' }}
      >
        {/* Visitor Info */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid #F0F0F0' }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" className="text-charcoal-light">
            Visitor
          </p>

          <div className="space-y-2">
            {conversation.visitorInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={13} strokeWidth={1.5} className="text-green" />
                <span className="text-xs" className="text-charcoal">{conversation.visitorInfo.phone}</span>
              </div>
            )}
            {conversation.visitorInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={13} strokeWidth={1.5} className="text-green" />
                <span className="text-xs truncate" className="text-charcoal">{conversation.visitorInfo.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={13} strokeWidth={1.5} className="text-green" />
              <span className="text-xs" className="text-charcoal">
                {new Date(conversation.startedAt).toLocaleDateString('en-NG', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Qualifications */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid #F0F0F0' }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" className="text-charcoal-light">
            Qualifications
          </p>

          <div className="space-y-2">
            {conversation.leadData.intent && (
              <div>
                <p className="text-[10px]" className="text-charcoal-light">Intent</p>
                <p className="text-xs capitalize font-medium" className="text-charcoal">
                  {conversation.leadData.intent}
                </p>
              </div>
            )}
            {(conversation.leadData.budgetMin || conversation.leadData.budgetMax) && (
              <div>
                <p className="text-[10px]" className="text-charcoal-light">Budget</p>
                <p className="text-xs font-medium" className="text-charcoal">
                  {conversation.leadData.budgetMin ? formatNaira(conversation.leadData.budgetMin) : '—'}
                  {' – '}
                  {conversation.leadData.budgetMax ? formatNaira(conversation.leadData.budgetMax) : '—'}
                </p>
              </div>
            )}
            {conversation.leadData.areasOfInterest && conversation.leadData.areasOfInterest.length > 0 && (
              <div>
                <p className="text-[10px]" className="text-charcoal-light">Areas</p>
                <p className="text-xs" className="text-charcoal">
                  {conversation.leadData.areasOfInterest.join(', ')}
                </p>
              </div>
            )}
            {conversation.leadData.developmentsInterested && conversation.leadData.developmentsInterested.length > 0 && (
              <div>
                <p className="text-[10px]" className="text-charcoal-light">Interested In</p>
                {conversation.leadData.developmentsInterested.map((d) => (
                  <div key={d} className="flex items-center gap-1 mt-0.5">
                    <Building2 size={11} strokeWidth={1.5} className="text-green" />
                    <span className="text-xs" className="text-charcoal">{d}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Internal Notes */}
        {conversation.internalNotes && conversation.internalNotes.length > 0 && (
          <div className="px-4 py-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" className="text-charcoal-light">
              Internal Notes
            </p>
            <div className="space-y-2">
              {conversation.internalNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-2.5 rounded-lg text-xs"
                  style={{ background: '#FFFBEB', border: '1px solid #FCD34D', color: '#92400E' }}
                >
                  <p className="font-semibold text-[10px] mb-1" style={{ color: '#B45309' }}>{note.agentName}</p>
                  <p className="leading-snug">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
