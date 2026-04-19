'use client'

// -----------------------------------------------------------------------------
// ChatWindow - The expanded chat panel (messages + input)
// Version 1.0 | Zippatek Digital Ltd | April 2026
// -----------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react'
import { Send, UserCheck, Bot, X, Minus, RotateCcw } from 'lucide-react'
import { MessageBubble, TypingIndicator } from './MessageBubble'
import type { ClientMessage } from './useChat'

interface ChatWindowProps {
  messages: ClientMessage[]
  isLoading: boolean
  status: 'ai_active' | 'waiting_for_human' | 'human_active' | 'resolved'
  error: string | null
  onSendMessage: (message: string) => void
  onNewChat: () => void
  onClose: () => void
  onMinimize: () => void
}

export function ChatWindow({
  messages,
  isLoading,
  status,
  error,
  onSendMessage,
  onNewChat,
  onClose,
  onMinimize,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return
    onSendMessage(trimmed)
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const statusConfig = {
    ai_active: { label: 'AI Assistant', icon: <Bot size={12} strokeWidth={1.5} />, color: '#286B38' },
    waiting_for_human: { label: 'Connecting...', icon: <Bot size={12} strokeWidth={1.5} />, color: '#D97706' },
    human_active: { label: 'Live Agent', icon: <UserCheck size={12} strokeWidth={1.5} />, color: '#286B38' },
    resolved: { label: 'Resolved', icon: <Bot size={12} strokeWidth={1.5} />, color: '#8A8B8F' },
  }[status]

  const isResolved = status === 'resolved'

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        width: 'min(380px, 92vw)',
        height: 'min(620px, 80vh)',
        maxHeight: 'calc(100vh - 120px)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0,0,0,0.06)',
        background: '#fff',
        border: '1px solid #ECECEC',
      }}
    >
      {/* -- Header -------------------------------------------------- */}
      <div
        className="flex items-center justify-between px-4 py-4 flex-shrink-0 border-b"
        style={{
          background: '#fff',
          borderColor: '#F0F0F0',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#F8F8F8', border: '1px solid #EDEDED' }}
          >
            <span className="text-charcoal-dark font-bold text-xs tracking-tight">MP</span>
          </div>
          <div>
            <p className="text-charcoal-dark text-sm font-semibold leading-tight">MiddlePark Properties</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span style={{ color: statusConfig.color === '#286B38' ? '#10B981' : '#F59E0B' }}>
                <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: 'currentColor' }} />
              </span>
              <span className="text-charcoal-light text-[10px] font-medium tracking-wide uppercase">{statusConfig.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onNewChat}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5"
            title="Start new chat"
            aria-label="Start new chat"
          >
            <RotateCcw size={15} strokeWidth={2} className="text-charcoal" />
          </button>
          <button
            onClick={onMinimize}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5"
            aria-label="Minimize chat"
          >
            <Minus size={15} strokeWidth={2} className="text-charcoal" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5"
            aria-label="Close chat"
          >
            <X size={15} strokeWidth={2} className="text-charcoal" />
          </button>
        </div>
      </div>

      {/* -- Status banner (waiting/resolved) ----------------------- */}
      {status === 'waiting_for_human' && (
        <div className="px-4 py-2.5 text-[11px] text-center flex-shrink-0" style={{ background: '#F9FAFB', color: '#6B7280', borderBottom: '1px solid #F3F4F6' }}>
          Our team typically responds in a few minutes.
        </div>
      )}
      {status === 'resolved' && (
        <div className="px-4 py-4 text-xs text-center flex-shrink-0 flex flex-col items-center gap-2" style={{ background: '#F8F8F8', color: '#5A5B5F' }}>
          <p className="font-medium">This conversation has been resolved.</p>
          <button 
            onClick={onNewChat}
            className="mt-1 px-5 py-2 rounded-lg bg-charcoal-dark text-white text-[11px] font-semibold transition-all hover:opacity-90 shadow-sm"
          >
            Start New Conversation
          </button>
        </div>
      )}

      {/* -- Messages ------------------------------------------------ */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ background: '#FFF' }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="text-center py-2">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* -- Quick replies ------------------------------------------- */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 pb-3 flex gap-1.5 flex-wrap flex-shrink-0" style={{ background: '#FFF' }}>
          {[
            'Properties for sale',
            'Rental availability',
            'Speak to an agent',
          ].map((quickReply) => (
            <button
              key={quickReply}
              onClick={() => onSendMessage(quickReply)}
              className="text-[11px] px-3 py-2 rounded-lg border transition-all duration-150 hover:bg-black/5"
              style={{ borderColor: '#E5E5E5', color: '#5A5B5F', backgroundColor: '#fff' }}
            >
              {quickReply}
            </button>
          ))}
        </div>
      )}

      {/* -- Input --------------------------------------------------- */}
      {!isResolved && (
        <form
          onSubmit={handleSubmit}
          className="px-4 py-4 border-t flex items-center gap-3 flex-shrink-0"
          style={{ borderColor: '#F0F0F0', background: '#fff' }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            rows={1}
            className="flex-1 resize-none text-sm leading-relaxed focus:outline-none bg-transparent text-charcoal-dark placeholder:text-charcoal-light/60"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-30 bg-charcoal-dark hover:bg-black"
            aria-label="Send message"
          >
            <Send size={16} strokeWidth={2} className="text-white" />
          </button>
        </form>
      </div>
    </div>

      {/* -- Footer -------------------------------------------------- */}
      <div
        className="px-4 py-2 text-center text-[10px] flex-shrink-0"
        style={{ color: '#BBBCBF', background: '#fff', borderTop: '1px solid #F0F0F0' }}
      >
        Powered by <span className="text-green">MiddlePark AI</span>
      </div>
    </div>
  )
}
