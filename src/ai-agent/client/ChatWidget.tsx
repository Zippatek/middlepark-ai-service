'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ChatWidget — The floating chat button + panel (embed this on public pages)
//
// USAGE: Add <ChatWidget /> to your public layout or any page.
// It renders a floating button (bottom-right) that opens the chat window.
//
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { ChatWindow } from './ChatWindow'
import { useChat } from './useChat'

interface ChatWidgetProps {
  /** Auto-open after N seconds. 0 = don't auto-open. Default: 0 */
  autoOpenAfterSeconds?: number
  /** Position offset from bottom-right corner */
  position?: { bottom: number; right: number }
}

export function ChatWidget({
  autoOpenAfterSeconds = 0,
  position = { bottom: 64, right: 32 },
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showPulse, setShowPulse] = useState(false)

  const chat = useChat()

  useEffect(() => {
    console.log('ChatWidget mounted on', window.location.href)
  }, [])

  // Auto-open
  useEffect(() => {
    if (autoOpenAfterSeconds > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setShowPulse(true)
      }, autoOpenAfterSeconds * 1000)
      return () => clearTimeout(timer)
    }
  }, [autoOpenAfterSeconds])

  // Show pulse animation on button after 8 seconds to attract attention
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  // Track new messages for badge
  useEffect(() => {
    if (!isOpen && chat.messages.length > 0) {
      const lastMsg = chat.messages[chat.messages.length - 1]
      if (lastMsg.role !== 'user') {
        setHasNewMessage(true)
        setUnreadCount((c) => c + 1)
      }
    } else {
      setHasNewMessage(false)
      setUnreadCount(0)
    }
  }, [chat.messages, isOpen])

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setHasNewMessage(false)
    setUnreadCount(0)
    setShowPulse(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    setIsOpen(false)
  }

  return (
    <div
      className="fixed z-[9999]"
      style={{ bottom: position.bottom, right: position.right }}
    >
      {/* ── Chat Panel ──────────────────────────────────────────── */}
      {isOpen && !isMinimized && (
        <div
          className="absolute bottom-16 right-0"
          style={{
            animation: 'chatSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <ChatWindow
            messages={chat.messages}
            isLoading={chat.isLoading}
            status={chat.status}
            error={chat.error}
            onSendMessage={chat.sendMessage}
            onNewChat={chat.startNewChat}
            onClose={handleClose}
            onMinimize={handleMinimize}
          />
        </div>
      )}

      {/* ── Minimized Bar ─────────────────────────────────────── */}
      {isMinimized && (
        <button
          onClick={handleOpen}
          className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all hover:shadow-xl bg-charcoal-dark hover:bg-black"
        >
          <MessageCircle size={18} strokeWidth={2} />
          <span>Chat with us</span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-charcoal-dark text-[10px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ── Main FAB Button ─────────────────────────────────────── */}
      {!isMinimized && (
        <button
          onClick={isOpen ? handleClose : handleOpen}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 bg-charcoal-dark hover:bg-black"
          style={{
            borderRadius: isOpen ? '16px 16px 4px 16px' : '20px',
          }}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          <div
            style={{
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isOpen ? 'rotate(90deg) scale(0.85)' : 'rotate(0deg) scale(1)',
            }}
          >
            {isOpen ? (
              <X size={24} strokeWidth={2.5} />
            ) : (
              <MessageCircle size={24} strokeWidth={2} />
            )}
          </div>

          {/* Unread badge */}
          {unreadCount > 0 && !isOpen && (
            <span
              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-white text-[11px] flex items-center justify-center font-bold border-2 border-white shadow-sm"
              style={{ backgroundColor: '#10B981' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ── CSS Animations ──────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes chatSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes chatPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(0, 0, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}
