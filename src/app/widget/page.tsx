'use client'

import { ChatWidget } from '../../ai-agent/client/ChatWidget'

export default function WidgetPage() {
  return (
    <div className="w-full h-full min-h-screen relative overflow-hidden bg-transparent">
      {/* 
        This page is designed to be embedded as an iframe.
        It renders the ChatWidget floating button which opens the ChatWindow.
      */}
      <ChatWidget autoOpenAfterSeconds={0} position={{ bottom: 20, right: 20 }} />
      
      <style jsx global>{`
        body {
          background: transparent !important;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
