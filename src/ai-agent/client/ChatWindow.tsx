'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ChatWindow — The expanded chat panel (messages + input)
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { Send, UserCheck, Bot, X, Minus } from 'lucide-react'
import { MessageBubble, TypingIndicator } from './MessageBubble'
import type { ClientMessage } from './useChat'

interface ChatWindowProps {
  messages: ClientMessage[]
  isLoading: boolean
  status: 'ai_active' | 'waiting_for_human' | 'human_active' | 'resolved'
  error: string | null
  onSendMessage: (message: string) => void
  onClose: () => void
  onMinimize: () => void
}

export function ChatWindow({
  messages,
  isLoading,
  status,
  error,
  onSendMessage,
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
        width: '360px',
        height: '560px',
        boxShadow: '0 24px 64px rgba(40, 107, 56, 0.18), 0 4px 16px rgba(0,0,0,0.08)',
        background: '#fff',
      }}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #286B38 0%, #1e5229 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <span className="text-white font-bold text-xs tracking-tight">MP</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">MiddlePark Properties</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span style={{ color: statusConfig.color === '#286B38' ? '#90E6A8' : '#FCD34D' }}>
                {statusConfig.icon}
              </span>
              <span className="text-white/70 text-[10px]">{statusConfig.label}</span>
              <span className="w-1.5 h-1.5 rounded-full ml-1 animate-pulse" style={{
                backgroundColor: status === 'waiting_for_human' ? '#FCD34D' : '#90E6A8'
              }} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
            aria-label="Minimize chat"
          >
            <Minus size={14} strokeWidth={2} className="text-white" />
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
            aria-label="Close chat"
          >
            <X size={14} strokeWidth={2} className="text-white" />
          </button>
        </div>
      </div>

      {/* ── Status banner (waiting/resolved) ─────────────────────── */}
      {status === 'waiting_for_human' && (
        <div className="px-4 py-2 text-xs text-center flex-shrink-0" style={{ background: '#FEF3C7', color: '#92400E' }}>
          ⏳ A member of our team will join shortly...
        </div>
      )}
      {status === 'resolved' && (
        <div className="px-4 py-2 text-xs text-center flex-shrink-0" style={{ background: '#F0F4F1', color: '#286B38' }}>
          ✓ This conversation has been resolved. Start a new chat anytime.
        </div>
      )}

      {/* ── Messages ──────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ background: '#FCFCFC' }}
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

      {/* ── Quick replies ─────────────────────────────────────────── */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 pb-2 flex gap-1.5 flex-wrap flex-shrink-0" style={{ background: '#FCFCFC' }}>
          {[
            '📍 Show me available properties',
            '💰 What\'s the price range?',
            '📞 Speak to an agent',
          ].map((quickReply) => (
            <button
              key={quickReply}
              onClick={() => onSendMessage(quickReply)}
              className="text-[11px] px-2.5 py-1.5 rounded-full border transition-all duration-150 hover:bg-[#F0F4F1]"
              style={{ borderColor: '#C8D9CC', color: '#286B38', backgroundColor: '#fff' }}
            >
              {quickReply}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ─────────────────────────────────────────────────── */}
      {!isResolved && (
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 border-t flex items-end gap-2 flex-shrink-0"
          style={{ borderColor: '#E8EDE9', background: '#fff' }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none text-sm leading-relaxed focus:outline-none bg-transparent text-charcoal"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-40 bg-green"
            aria-label="Send message"
          >
            <Send size={14} strokeWidth={2} className="text-white" style={{ transform: 'translateX(1px)' }} />
          </button>
        </form>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div
        className="px-4 py-2 text-center text-[10px] flex-shrink-0"
        style={{ color: '#BBBCBF', background: '#fff', borderTop: '1px solid #F0F0F0' }}
      >
        Powered by <span className="text-green">MiddlePark AI</span>
      </div>
    </div>
  )
}
