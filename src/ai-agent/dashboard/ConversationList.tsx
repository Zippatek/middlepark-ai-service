'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ConversationList — Left panel: all conversations with filter tabs
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { Search, RefreshCw, MessageCircle } from 'lucide-react'
import { ConversationBadge } from './ConversationBadge'

type ConversationStatus = 'ai_active' | 'waiting_for_human' | 'human_active' | 'resolved'

interface ConversationSummary {
  id: string
  status: ConversationStatus
  visitorName: string
  lastMessage: string
  lastMessageAt: string
  startedAt: string
  unreadCount: number
  developmentInterest?: string
}

interface ConversationListProps {
  conversations: ConversationSummary[]
  selectedId: string | null
  filterStatus: 'all' | ConversationStatus
  onSelect: (id: string) => void
  onFilterChange: (status: 'all' | ConversationStatus) => void
  onRefresh: () => void
  isRefreshing: boolean
}

const FILTER_TABS: Array<{ key: 'all' | ConversationStatus; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'waiting_for_human', label: 'Waiting' },
  { key: 'human_active', label: 'Live' },
  { key: 'ai_active', label: 'AI' },
  { key: 'resolved', label: 'Done' },
]

function timeAgo(isoString: string): string {
  const now = new Date()
  const date = new Date(isoString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function ConversationList({
  conversations,
  selectedId,
  filterStatus,
  onSelect,
  onFilterChange,
  onRefresh,
  isRefreshing,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full" style={{ borderRight: '1px solid #E8EDE9' }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm" className="text-charcoal">
            Conversations
          </h2>
          <button
            onClick={onRefresh}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[#F0F4F1]"
            aria-label="Refresh"
          >
            <RefreshCw
              size={14}
              strokeWidth={1.5}
              className="text-green"
            />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            className="text-charcoal-light"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg focus:outline-none"
            className="bg-cream"
          />
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────── */}
      <div className="px-4 pb-3 flex gap-1.5 flex-shrink-0 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all duration-150"
            style={{
              backgroundColor: filterStatus === tab.key ? '#286B38' : '#F0F4F1',
              color: filterStatus === tab.key ? '#fff' : '#5A5B5F',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Conversation Items ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <MessageCircle size={32} strokeWidth={1} style={{ color: '#C8D9CC' }} />
            <p className="text-xs mt-3" className="text-charcoal-light">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = conv.id === selectedId
            const isUrgent = conv.status === 'waiting_for_human'

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className="w-full text-left px-4 py-3.5 transition-all duration-150 relative"
                style={{
                  backgroundColor: isSelected ? '#F0F4F1' : 'transparent',
                  borderLeft: isSelected ? '3px solid #286B38' : '3px solid transparent',
                  borderBottom: '1px solid #F0F0F0',
                }}
              >
                {/* Urgent indicator */}
                {isUrgent && (
                  <span
                    className="absolute top-3 right-3 w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#F59E0B', animation: 'pulse 2s infinite' }}
                  />
                )}

                <div className="flex items-start justify-between mb-1">
                  <p className="text-xs font-semibold" className="text-charcoal">
                    {conv.visitorName}
                  </p>
                  <span className="text-[10px]" style={{ color: '#BBBCBF' }}>
                    {timeAgo(conv.lastMessageAt)}
                  </span>
                </div>

                <p
                  className="text-[11px] leading-snug mb-1.5 line-clamp-2"
                  style={{ color: '#8A8B8F' }}
                >
                  {conv.lastMessage}
                </p>

                <div className="flex items-center gap-2">
                  <ConversationBadge status={conv.status} size="sm" />
                  {conv.developmentInterest && (
                    <span className="text-[10px]" className="text-charcoal-light">
                      · {conv.developmentInterest}
                    </span>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
