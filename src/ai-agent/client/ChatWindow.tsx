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
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0,0,0,0.05)',
        background: '#fff',
        border: '1px solid #ECECEC',
      }}
    >
      {/* -- Header -------------------------------------------------- */}
      <div
        className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b"
        style={{
          background: '#fff',
          borderColor: '#F5F5F5',
        }}
      >
        <div className="flex flex-col">
          <p className="text-charcoal-dark text-[13px] font-bold tracking-tight">MiddlePark Properties</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status === 'waiting_for_human' ? '#F59E0B' : '#ED1B24' }} />
            <span className="text-charcoal-light text-[9px] font-bold uppercase tracking-wider">{statusConfig.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5"
            aria-label="Minimize chat"
          >
            <Minus size={14} className="text-charcoal-light" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5"
            aria-label="Close chat"
          >
            <X size={14} className="text-charcoal-light" />
          </button>
        </div>
      </div>

      {/* -- Status banner (waiting/resolved) ----------------------- */}
      {status === 'waiting_for_human' && (
        <div className="px-4 py-2 text-[10px] text-center flex-shrink-0 font-medium" style={{ background: '#FFF9F0', color: '#B45309' }}>
          Searching for an available agent...
        </div>
      )}
      {status === 'resolved' && (
        <div className="px-4 py-5 text-xs text-center flex-shrink-0 flex flex-col items-center gap-2" style={{ background: '#F9FAFB', color: '#374151' }}>
          <p className="font-semibold tracking-tight uppercase text-[10px] text-charcoal-light">Conversation Ended</p>
        </div>
      )}

      {/* -- Messages ------------------------------------------------ */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ background: '#FFF' }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} status={status} />
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
        <div className="px-4 pb-4 flex gap-1.5 flex-wrap flex-shrink-0" style={{ background: '#FFF' }}>
          {[
            'Properties for sale',
            'Rental options',
          ].map((quickReply) => (
            <button
              key={quickReply}
              onClick={() => onSendMessage(quickReply)}
              className="text-[10px] px-3 py-1.5 rounded-lg border font-medium transition-all duration-150 hover:bg-black/5"
              style={{ borderColor: '#F0F0F0', color: '#6B7280', backgroundColor: '#fff' }}
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
          style={{ borderColor: '#F5F5F5', background: '#fff' }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write message..."
            rows={1}
            className="flex-1 resize-none text-[13px] leading-relaxed focus:outline-none bg-transparent text-charcoal-dark placeholder:text-charcoal-light/50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-20 bg-red hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Send message"
          >
            <Send size={15} strokeWidth={2.5} className="text-white" />
          </button>
        </form>
      )}

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
