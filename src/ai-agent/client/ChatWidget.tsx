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
  position = { bottom: 24, right: 24 },
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow-lg transition-all hover:shadow-xl bg-green"
        >
          <MessageCircle size={16} strokeWidth={1.5} />
          <span>Chat with us</span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#ED1B24] text-white text-[10px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ── Main FAB Button ─────────────────────────────────────── */}
      {!isMinimized && (
        <button
          onClick={isOpen ? handleClose : handleOpen}
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 bg-green"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          <div
            style={{
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isOpen ? 'rotate(90deg) scale(0.85)' : 'rotate(0deg) scale(1)',
            }}
          >
            {isOpen ? (
              <X size={22} strokeWidth={2} />
            ) : (
              <MessageCircle size={22} strokeWidth={1.5} />
            )}
          </div>

          {/* Unread badge */}
          {unreadCount > 0 && !isOpen && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
              style={{ backgroundColor: '#ED1B24' }}
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
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes chatPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(40, 107, 56, 0.5);
          }
          70% {
            box-shadow: 0 0 0 16px rgba(40, 107, 56, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(40, 107, 56, 0);
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
