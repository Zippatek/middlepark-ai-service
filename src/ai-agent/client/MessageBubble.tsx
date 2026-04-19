'use client'

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble — Individual message component in the chat thread
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { Bot, User, UserCheck } from 'lucide-react'
import { PropertyCard } from './PropertyCard'
import type { ClientMessage } from './useChat'

interface MessageBubbleProps {
  message: ClientMessage
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isAgent = message.role === 'agent'
  const isAI = message.role === 'assistant' && !message.agentName
  const isHumanAgent = message.role === 'agent' || (message.role === 'assistant' && message.agentName)

  if (isUser) {
    return (
      <div className="flex justify-end gap-2 mb-3">
        <div className="max-w-[80%]">
          <div
            className="px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed"
            className="bg-green"
          >
            {message.content}
          </div>
          <p className="text-[10px] text-right mt-1" className="text-charcoal-light">
            {formatTime(message.timestamp)}
          </p>
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: '#F0F4F1' }}
        >
          <User size={14} strokeWidth={1.5} className="text-charcoal" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mb-3">
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          backgroundColor: isHumanAgent ? '#286B38' : '#F0F4F1',
          border: isHumanAgent ? 'none' : '1px solid #E0E8E2',
        }}
      >
        {isHumanAgent ? (
          <UserCheck size={14} strokeWidth={1.5} style={{ color: '#fff' }} />
        ) : (
          <Bot size={14} strokeWidth={1.5} className="text-green" />
        )}
      </div>

      <div className="max-w-[85%]">
        {/* Agent name label */}
        {isHumanAgent && (
          <p className="text-[10px] font-semibold mb-1" className="text-green">
            {message.agentName || 'MiddlePark Team'}
          </p>
        )}

        {/* Message bubble */}
        <div
          className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            backgroundColor: isHumanAgent ? '#EBF2ED' : '#F8F7F3',
            color: '#5A5B5F',
            border: '1px solid #E8EDE9',
          }}
        >
          {message.content}
        </div>

        {/* Inline property cards */}
        {message.propertyCards && message.propertyCards.length > 0 && (
          <div className="mt-2 grid grid-cols-1 gap-2">
            {message.propertyCards.map((card) => (
              <PropertyCard key={card.id} card={card} />
            ))}
          </div>
        )}

        <p className="text-[10px] mt-1" className="text-charcoal-light">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

// ─── LOADING BUBBLE (typing indicator) ───────────────────────────────────────

export function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-3">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#F0F4F1', border: '1px solid #E0E8E2' }}
      >
        <Bot size={14} strokeWidth={1.5} className="text-green" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ backgroundColor: '#F8F7F3', border: '1px solid #E8EDE9' }}
      >
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: '#286B38',
                opacity: 0.6,
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
