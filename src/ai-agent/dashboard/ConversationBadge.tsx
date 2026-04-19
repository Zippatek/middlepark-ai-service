'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ConversationBadge — Status pill for conversation status
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { Bot, UserCheck, Clock, CheckCircle2 } from 'lucide-react'

type ConversationStatus = 'ai_active' | 'waiting_for_human' | 'human_active' | 'resolved'

interface ConversationBadgeProps {
  status: ConversationStatus
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<ConversationStatus, {
  label: string
  icon: React.ReactNode
  bg: string
  text: string
  dot: string
}> = {
  ai_active: {
    label: 'AI Active',
    icon: <Bot size={11} strokeWidth={1.5} />,
    bg: '#F0F4F1',
    text: '#286B38',
    dot: '#286B38',
  },
  waiting_for_human: {
    label: 'Waiting',
    icon: <Clock size={11} strokeWidth={1.5} />,
    bg: '#FEF3C7',
    text: '#92400E',
    dot: '#F59E0B',
  },
  human_active: {
    label: 'Live Agent',
    icon: <UserCheck size={11} strokeWidth={1.5} />,
    bg: '#DCFCE7',
    text: '#166534',
    dot: '#16A34A',
  },
  resolved: {
    label: 'Resolved',
    icon: <CheckCircle2 size={11} strokeWidth={1.5} />,
    bg: '#F3F4F6',
    text: '#6B7280',
    dot: '#9CA3AF',
  },
}

export function ConversationBadge({ status, size = 'sm' }: ConversationBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        fontSize: size === 'sm' ? '10px' : '11px',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: config.dot,
          animation: status === 'waiting_for_human' || status === 'human_active' ? 'pulse 2s infinite' : 'none',
        }}
      />
      {config.icon}
      {config.label}
    </span>
  )
}
