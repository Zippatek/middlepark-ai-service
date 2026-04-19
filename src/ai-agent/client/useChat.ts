'use client'

// ─────────────────────────────────────────────────────────────────────────────
// useChat — Client-side chat state and API communication hook
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, useEffect } from 'react'

export interface ClientMessage {
  id: string
  role: 'user' | 'assistant' | 'agent'
  content: string
  timestamp: string
  agentName?: string
  propertyCards?: PropertyCardInfo[]
}

export interface PropertyCardInfo {
  id: string
  name: string
  slug: string
  location: string
  status: string
  priceFrom: number
  bedrooms: number[]
  image?: string
}

function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 15)
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId()
  const stored = sessionStorage.getItem('mp_chat_session')
  if (stored) return stored
  const newId = generateSessionId()
  sessionStorage.setItem('mp_chat_session', newId)
  return newId
}

export function useChat() {
  const [messages, setMessages] = useState<ClientMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [status, setStatus] = useState<'ai_active' | 'waiting_for_human' | 'human_active' | 'resolved'>('ai_active')
  const [error, setError] = useState<string | null>(null)
  const sessionId = useRef(getOrCreateSessionId())
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Add initial greeting on mount
  useEffect(() => {
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content:
          "Hello! Welcome to MiddlePark Properties. I'm here to help you find the right home in Abuja.\n\nAre you looking to buy for yourself or as an investment? And what's your approximate budget?",
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  // Poll for new messages when a human has taken over (every 3 seconds)
  useEffect(() => {
    if (status === 'human_active' && conversationId) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/ai-agent/conversations?id=${conversationId}`, {
            headers: { 'x-dashboard-token': '' }, // Public polling — the route should support session-based auth
          })
          // Note: in production, use a proper auth token or WebSocket
          // For now this is a placeholder for the polling mechanism
        } catch {
          // Silently ignore poll errors
        }
      }, 3000)
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [status, conversationId])

  const sendMessage = useCallback(
    async (content: string, visitorName?: string) => {
      if (!content.trim() || isLoading) return

      // Add user message optimistically
      const userMsg: ClientMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/ai-agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId.current,
            message: content.trim(),
            visitorName,
          }),
        })

        if (!res.ok) throw new Error('Failed to send message')

        const data = await res.json()

        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }

        if (data.status) {
          setStatus(data.status)
        }

        if (data.reply) {
          setMessages((prev) => [...prev, data.reply as ClientMessage])
        }

        // If handoff requested, add a visual indicator message
        if (data.shouldHandoff) {
          setMessages((prev) => [
            ...prev,
            {
              id: `handoff_${Date.now()}`,
              role: 'assistant',
              content: '⏳ Connecting you with a member of our team...',
              timestamp: new Date().toISOString(),
            },
          ])
        }
      } catch (err) {
        setError('Failed to send message. Please try again.')
        // Remove the optimistic user message on failure
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, conversationId],
  )

  const clearError = useCallback(() => setError(null), [])

  return {
    messages,
    isLoading,
    status,
    conversationId,
    error,
    sendMessage,
    clearError,
    sessionId: sessionId.current,
  }
}
