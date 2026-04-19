'use client'

// ─────────────────────────────────────────────────────────────────────────────
// AgentInput — Reply box for CS agents to respond to customers
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'
import { Send, StickyNote } from 'lucide-react'

interface AgentInputProps {
  onSendMessage: (message: string) => Promise<void>
  onAddNote?: (note: string) => Promise<void>
  isLoading: boolean
  agentName: string
}

export function AgentInput({ onSendMessage, onAddNote, isLoading, agentName }: AgentInputProps) {
  const [mode, setMode] = useState<'reply' | 'note'>('reply')
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isLoading) return

    if (mode === 'reply') {
      await onSendMessage(trimmed)
    } else if (onAddNote) {
      await onAddNote(trimmed)
    }
    setValue('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className="flex-shrink-0"
      style={{ borderTop: '1px solid #E8EDE9', background: '#fff' }}
    >
      {/* Mode Tabs */}
      <div className="flex items-center gap-0 px-4 pt-3 pb-0">
        <button
          onClick={() => setMode('reply')}
          className="px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all"
          style={{
            backgroundColor: mode === 'reply' ? '#F0F4F1' : 'transparent',
            color: mode === 'reply' ? '#286B38' : '#9A9B9F',
            borderBottom: mode === 'reply' ? '2px solid #286B38' : '2px solid transparent',
          }}
        >
          Reply to Customer
        </button>
        {onAddNote && (
          <button
            onClick={() => setMode('note')}
            className="px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all flex items-center gap-1.5"
            style={{
              backgroundColor: mode === 'note' ? '#FEF3C7' : 'transparent',
              color: mode === 'note' ? '#92400E' : '#9A9B9F',
              borderBottom: mode === 'note' ? '2px solid #F59E0B' : '2px solid transparent',
            }}
          >
            <StickyNote size={11} strokeWidth={1.5} />
            Internal Note
          </button>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="px-4 py-3">
        <div
          className="flex items-end gap-3 rounded-xl p-3"
          style={{
            background: mode === 'note' ? '#FFFBEB' : '#F8F7F3',
            border: `1px solid ${mode === 'note' ? '#FCD34D' : '#E8EDE9'}`,
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'reply'
                ? `Reply as ${agentName}...`
                : 'Add an internal note (customer cannot see this)...'
            }
            rows={2}
            className="flex-1 resize-none text-sm leading-relaxed focus:outline-none bg-transparent"
            className="text-charcoal"
          />
          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
            style={{
              backgroundColor: mode === 'note' ? '#F59E0B' : '#286B38',
            }}
            aria-label="Send"
          >
            <Send size={14} strokeWidth={2} className="text-white" style={{ transform: 'translateX(1px)' }} />
          </button>
        </div>

        {mode === 'note' && (
          <p className="text-[10px] mt-1.5 pl-1" className="text-charcoal-light">
            🔒 Internal notes are only visible to the MiddlePark team.
          </p>
        )}
      </form>
    </div>
  )
}
