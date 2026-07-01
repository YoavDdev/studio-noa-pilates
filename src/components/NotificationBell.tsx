'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  subject: string
  body: string
  is_read: boolean
  created_at: string
}

export default function NotificationBell() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(data.messages || [])
      setUnread(data.unread || 0)
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    if (!user) return
    fetchMessages()
    const interval = setInterval(fetchMessages, 60000)
    return () => clearInterval(interval)
  }, [user, fetchMessages])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleOpen = async () => {
    setOpen(prev => !prev)
    if (!open && unread > 0) {
      try {
        await fetch('/api/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markAllRead: true })
        })
        setUnread(0)
        setMessages(prev => prev.map(m => ({ ...m, is_read: true })))
      } catch {
        // silently fail
      }
    }
  }

  if (!user) return null

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-8 h-8 text-[#5C4D3C] hover:text-[#1A1410] transition-colors"
        aria-label="הודעות"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[16px] h-4 bg-[#C9A871] text-white text-[10px] font-body flex items-center justify-center px-1 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-3 w-80 bg-[#FDFCFA] border border-[#EBE5DC] shadow-[0_4px_24px_rgba(0,0,0,0.08)] z-50" dir="rtl">
          <div className="px-5 py-4 border-b border-[#EBE5DC] flex items-center justify-between">
            <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888]">הודעות</p>
            {messages.length > 0 && (
              <span className="font-body text-[11px] text-[#C4BAA8]">{messages.length}</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="font-body text-sm text-[#C4BAA8]">אין הודעות</p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`px-5 py-4 border-b border-[#EBE5DC] last:border-0 ${!msg.is_read ? 'bg-[#FAF8F3]' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!msg.is_read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A871] shrink-0 mt-1.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-[#1A1410] font-medium leading-snug">{msg.subject}</p>
                      <p className="font-body text-xs text-[#5C4D3C] mt-1 leading-relaxed line-clamp-3 whitespace-pre-line">{msg.body}</p>
                      <p className="font-body text-[10px] text-[#C4BAA8] mt-1.5">
                        {new Date(msg.created_at).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
