'use client'

// ─────────────────────────────────────────────────────────────────────────────
// MiddlePark AI Agent Dashboard
// Route: /ai-agent/dashboard
// 
// Customer service and admin interface for monitoring and managing
// AI conversations. CS agents can take over from the AI at any point.
//
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from 'react'
import {
  Bot,
  MessageCircle,
  Users,
  Clock,
  CheckCircle2,
  LogOut,
  User,
  AlertCircle,
} from 'lucide-react'
import { ConversationList } from './ConversationList'
import { ConversationDetail } from './ConversationDetail'

// ─── TYPES ────────────────────────────────────────────────────────────────────

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

interface DashboardStats {
  totalToday: number
  aiActive: number
  waitingForHuman: number
  humanActive: number
  resolvedToday: number
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

const DASHBOARD_TOKEN = process.env.NEXT_PUBLIC_AGENT_DASHBOARD_TOKEN || 'middlepark-cs-2026'

// Mock agent (replace with real auth later)
const CURRENT_AGENT = {
  id: 'agent_001',
  name: 'CS Agent',
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === DASHBOARD_TOKEN) {
      onLogin(password)
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream font-sans">
      <div className="w-full max-w-sm rounded-2xl p-8 bg-white shadow-card">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-green">
            <Bot size={28} strokeWidth={1.5} className="text-white" />
          </div>
          <h1 className="text-xl font-bold font-cormorant">
            <span className="text-charcoal">MIDDLE</span>
            <span className="text-green">PARK</span>
            <span className="text-base font-normal ml-2 text-charcoal-light font-sans tracking-wide">AI</span>
          </h1>
          <p className="text-sm mt-1 text-charcoal-light">Customer Service Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-charcoal">
              Agent Name
            </label>
            <input
              type="text"
              defaultValue="CS Agent"
              className="w-full px-4 py-3 rounded-lg text-sm border border-cream-border bg-cream text-charcoal focus:outline-none focus:ring-2 focus:ring-green"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-charcoal">
              Dashboard Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm border border-cream-border bg-cream text-charcoal focus:outline-none focus:ring-2 focus:ring-green"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red">
              <AlertCircle size={13} strokeWidth={1.5} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-green transition-all hover:opacity-90 mt-2"
          >
            Sign In to Dashboard
          </button>
        </form>

        <p className="text-center text-[10px] mt-6 text-charcoal-light">
          MiddlePark Properties Limited · CS Portal
        </p>
      </div>
    </div>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  colorClass,
  bgClass,
  urgent,
}: {
  icon: React.ReactNode
  label: string
  value: number
  colorClass: string
  bgClass: string
  urgent?: boolean
}) {
  return (
    <div
      className={`rounded-xl px-5 py-4 flex items-center gap-4 bg-white border ${
        urgent && value > 0 ? 'border-amber-400 ring-2 ring-amber-400/20 animate-pulse' : 'border-cream-border'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bgClass}`}>
        <span className={colorClass}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-charcoal">{value}</p>
        <p className="text-xs text-charcoal-light">{label}</p>
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function AgentDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | ConversationStatus>('all')
  const [stats, setStats] = useState<DashboardStats>({
    totalToday: 0,
    aiActive: 0,
    waitingForHuman: 0,
    humanActive: 0,
    resolvedToday: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // ── Data Fetching ──────────────────────────────────────────────────────────

  const fetchConversations = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const params = filterStatus !== 'all' ? `?status=${filterStatus}` : ''
      const res = await fetch(`/api/ai-agent/conversations${params}`, {
        headers: { 'x-dashboard-token': DASHBOARD_TOKEN },
      })
      if (!res.ok) return
      const data = await res.json()
      setConversations(data.conversations || [])
      setStats(data.stats || stats)
    } catch {
      // Silently handle
    } finally {
      setIsRefreshing(false)
    }
  }, [filterStatus])

  const fetchConversationDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/ai-agent/conversations?id=${id}`, {
        headers: { 'x-dashboard-token': DASHBOARD_TOKEN },
      })
      if (!res.ok) return
      const data = await res.json()
      setSelectedConversation(data.conversation)
    } catch {
      // Silently handle
    }
  }, [])

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!isAuthenticated) return
    fetchConversations()
    const interval = setInterval(fetchConversations, 5000)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchConversations])

  // Refresh detail when selected
  useEffect(() => {
    if (!selectedId || !isAuthenticated) return
    fetchConversationDetail(selectedId)
    const interval = setInterval(() => fetchConversationDetail(selectedId), 3000)
    return () => clearInterval(interval)
  }, [selectedId, isAuthenticated, fetchConversationDetail])

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)
    fetchConversationDetail(id)
  }

  const handleTakeOver = async (conversationId: string) => {
    setIsLoading(true)
    try {
      await fetch('/api/ai-agent/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-token': DASHBOARD_TOKEN,
        },
        body: JSON.stringify({
          action: 'takeover',
          conversationId,
          agentId: CURRENT_AGENT.id,
          agentName: CURRENT_AGENT.name,
        }),
      })
      await fetchConversationDetail(conversationId)
      await fetchConversations()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (conversationId: string, message: string) => {
    setIsLoading(true)
    try {
      await fetch('/api/ai-agent/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-token': DASHBOARD_TOKEN,
        },
        body: JSON.stringify({
          action: 'agent_reply',
          conversationId,
          agentId: CURRENT_AGENT.id,
          agentName: CURRENT_AGENT.name,
          message,
        }),
      })
      await fetchConversationDetail(conversationId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNote = async (conversationId: string, note: string) => {
    setIsLoading(true)
    try {
      await fetch('/api/ai-agent/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-token': DASHBOARD_TOKEN,
        },
        body: JSON.stringify({
          action: 'add_note',
          conversationId,
          agentId: CURRENT_AGENT.id,
          agentName: CURRENT_AGENT.name,
          content: note,
        }),
      })
      await fetchConversationDetail(conversationId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolve = async (conversationId: string) => {
    setIsLoading(true)
    try {
      await fetch('/api/ai-agent/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-token': DASHBOARD_TOKEN,
        },
        body: JSON.stringify({ action: 'resolve', conversationId }),
      })
      await fetchConversationDetail(conversationId)
      await fetchConversations()
    } finally {
      setIsLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex flex-col h-screen bg-cream font-sans">
      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 h-16 flex-shrink-0 bg-white border-b border-cream-border shadow-sm">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green">
              <Bot size={16} strokeWidth={1.5} className="text-white" />
            </div>
            <span className="text-lg font-bold font-cormorant">
              <span className="text-charcoal">MIDDLE</span>
              <span className="text-green">PARK</span>
              <span className="text-xs font-normal ml-2 text-charcoal-light font-sans tracking-widest uppercase">AI Dashboard</span>
            </span>
          </div>

          {/* Waiting alert */}
          {stats.waitingForHuman > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {stats.waitingForHuman} waiting for agent
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-mint">
              <User size={14} strokeWidth={1.5} className="text-green" />
            </div>
            <span className="text-sm font-medium text-charcoal">{CURRENT_AGENT.name}</span>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-mint"
            title="Sign out"
          >
            <LogOut size={16} strokeWidth={1.5} className="text-charcoal-light" />
          </button>
        </div>
      </header>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-4 flex-shrink-0">
        <StatCard 
          icon={<MessageCircle size={20} strokeWidth={1.5} />} 
          label="Total Today" 
          value={stats.totalToday} 
          colorClass="text-charcoal" 
          bgClass="bg-cream-dark" 
        />
        <StatCard 
          icon={<Bot size={20} strokeWidth={1.5} />} 
          label="AI Active" 
          value={stats.aiActive} 
          colorClass="text-green" 
          bgClass="bg-mint" 
        />
        <StatCard 
          icon={<Clock size={20} strokeWidth={1.5} />} 
          label="Waiting for Human" 
          value={stats.waitingForHuman} 
          colorClass="text-amber-600" 
          bgClass="bg-amber-100" 
          urgent 
        />
        <StatCard 
          icon={<Users size={20} strokeWidth={1.5} />} 
          label="Live Agent Active" 
          value={stats.humanActive} 
          colorClass="text-green" 
          bgClass="bg-mint" 
        />
        <StatCard 
          icon={<CheckCircle2 size={20} strokeWidth={1.5} />} 
          label="Resolved Today" 
          value={stats.resolvedToday} 
          colorClass="text-charcoal" 
          bgClass="bg-cream-dark" 
        />
      </div>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden mx-6 mb-6 rounded-2xl bg-white border border-cream-border shadow-sm">
        {/* Left: Conversation List */}
        <div className="w-80 flex-shrink-0 overflow-hidden border-r border-cream-border">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            filterStatus={filterStatus}
            onSelect={handleSelectConversation}
            onFilterChange={setFilterStatus}
            onRefresh={fetchConversations}
            isRefreshing={isRefreshing}
          />
        </div>

        {/* Right: Conversation Detail */}
        <div className="flex-1 overflow-hidden bg-cream">
          <ConversationDetail
            conversation={selectedConversation}
            agentId={CURRENT_AGENT.id}
            agentName={CURRENT_AGENT.name}
            onTakeOver={handleTakeOver}
            onSendMessage={handleSendMessage}
            onAddNote={handleAddNote}
            onResolve={handleResolve}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
