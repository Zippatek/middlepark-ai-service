'use client'

// -----------------------------------------------------------------------------
// MessageBubble - Individual message component in the chat thread
// Version 1.0 | Zippatek Digital Ltd | April 2026
// -----------------------------------------------------------------------------

import { Bot, User, UserCheck } from 'lucide-react'
import { PropertyCard } from './PropertyCard'
import type { ClientMessage } from './useChat'

interface MessageBubbleProps {
  message: ClientMessage
  status?: 'ai_active' | 'waiting_for_human' | 'human_active' | 'resolved'
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function MessageBubble({ message, status }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isAgent = message.role === 'agent'
  const isAI = message.role === 'assistant' && !message.agentName
  const isHumanAgent = message.role === 'agent' || (message.role === 'assistant' && message.agentName)

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%]">
          <div
            className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-[13px] leading-relaxed bg-red text-white shadow-sm"
          >
            {message.content}
          </div>
          <p className="text-[9px] text-right mt-1.5 text-charcoal-light font-bold uppercase tracking-widest">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[85%]">
        {/* Message bubble */}
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed whitespace-pre-wrap shadow-sm"
          style={{
            backgroundColor: '#F9FAFB',
            color: '#1F2937',
            border: '1px solid #EDEDED',
          }}
        >
          {message.content}
        </div>

        {/* Inline property cards */}
        {message.propertyCards && message.propertyCards.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3">
            {message.propertyCards.map((card) => (
              <PropertyCard key={card.id} card={card} />
            ))}
          </div>
        )}

        <p className="text-[9px] mt-2 text-charcoal-light font-bold uppercase tracking-widest">
          {isHumanAgent ? (message.agentName || 'Agent') : 'Assistant'} • {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

// -- LOADING BUBBLE (typing indicator) ---------------------------------------

export function TypingIndicator({ agentType = 'bot' }: { agentType?: 'bot' | 'human' }) {
  return (
    <div className="flex gap-3 mb-5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#F9FAFB', border: '1px solid #EDEDED' }}
      >
        {agentType === 'bot' ? (
          <Bot size={16} strokeWidth={2} className="text-charcoal-dark" />
        ) : (
          <User size={16} strokeWidth={2} className="text-charcoal-dark" />
        )}
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

