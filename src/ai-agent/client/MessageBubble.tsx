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
      <div className="flex justify-end gap-2 mb-4">
        <div className="max-w-[80%]">
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed bg-charcoal-dark text-white shadow-sm"
          >
            {message.content}
          </div>
          <p className="text-[10px] text-right mt-1.5 text-charcoal-light font-medium uppercase tracking-wider">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 mb-5">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          backgroundColor: isHumanAgent ? '#18181b' : '#F9FAFB',
          border: '1px solid #EDEDED',
        }}
      >
        {isHumanAgent ? (
          <UserCheck size={16} strokeWidth={2} style={{ color: '#fff' }} />
        ) : (
          <Bot size={16} strokeWidth={2} className="text-charcoal-dark" />
        )}
      </div>

      <div className="max-w-[85%]">
        {/* Agent name label */}
        {isHumanAgent && (
          <p className="text-[10px] font-bold mb-1.5 text-charcoal-dark uppercase tracking-widest">
            {message.agentName || 'Support'}
          </p>
        )}

        {/* Message bubble */}
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed whitespace-pre-wrap shadow-sm"
          style={{
            backgroundColor: isHumanAgent ? '#F8F9FA' : '#FFFFFF',
            color: '#1F2937',
            border: '1px solid #E5E7EB',
          }}
        >
          {message.content}
        </div>

        {/* Inline property cards */}
        {message.propertyCards && message.propertyCards.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-2.5">
            {message.propertyCards.map((card) => (
              <PropertyCard key={card.id} card={card} />
            ))}
          </div>
        )}

        <p className="text-[10px] mt-2 text-charcoal-light font-medium uppercase tracking-wider">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

// ─── LOADING BUBBLE (typing indicator) ───────────────────────────────────────

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#F9FAFB', border: '1px solid #EDEDED' }}
      >
        <Bot size={16} strokeWidth={2} className="text-charcoal-dark" />
      </div>
      <div
        className="px-5 py-4 rounded-2xl rounded-tl-sm"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
      >
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-charcoal-light"
              style={{
                opacity: 0.4,
                animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

