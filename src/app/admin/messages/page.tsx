'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const AUDIENCE_OPTIONS = [
  { value: 'all',          label: 'כל המשתמשים',    desc: 'שליחה לכולם' },
  { value: 'subscription', label: 'מנויים פעילים',  desc: 'רק משתמשים עם מנוי' },
  { value: 'trial',        label: 'בניסיון',         desc: 'רק משתמשים בתקופת ניסיון' },
  { value: 'free',         label: 'חינמיים',         desc: 'משתמשים ללא מנוי' },
  { value: 'specific',     label: 'ספציפי',          desc: 'בחרי משתמשים ידנית' },
]

const CHANNEL_OPTIONS = [
  { value: 'both',  label: 'מייל + הודעה באתר' },
  { value: 'email', label: 'מייל בלבד' },
  { value: 'site',  label: 'הודעה באתר בלבד' },
]

interface UserRow { id: string; email: string; full_name: string | null }

export default function AdminMessagesPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [subject, setSubject]   = useState('')
  const [body, setBody]         = useState('')
  const [audience, setAudience] = useState('all')
  const [channel, setChannel]   = useState('both')
  const [sending, setSending]   = useState(false)
  const [sentLog, setSentLog]   = useState<{ time: string; subject: string; audience: string; count: number; channel: string }[]>([])

  // Specific users
  const [allUsers, setAllUsers]           = useState<UserRow[]>([])
  const [userSearch, setUserSearch]       = useState('')
  const [selectedUsers, setSelectedUsers] = useState<UserRow[]>([])

  useEffect(() => {
    if (profile && !profile.is_admin) router.push('/')
  }, [profile, router])

  const fetchAllUsers = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .order('full_name')
    setAllUsers(data || [])
  }, [supabase])

  useEffect(() => {
    if (audience === 'specific') fetchAllUsers()
  }, [audience, fetchAllUsers])

  const toggleUser = (u: UserRow) => {
    setSelectedUsers(prev =>
      prev.find(p => p.id === u.id)
        ? prev.filter(p => p.id !== u.id)
        : [...prev, u]
    )
  }

  const filteredUsers = allUsers.filter(u =>
    userSearch === '' ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase())
  )

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('נא למלא כותרת וגוף הודעה')
      return
    }
    if (audience === 'specific' && selectedUsers.length === 0) {
      toast.error('נא לבחור לפחות משתמש אחד')
      return
    }

    setSending(true)
    try {
      const payload: Record<string, unknown> = { subject, body, channel }
      if (audience === 'specific') {
        payload.userIds = selectedUsers.map(u => u.id)
      } else {
        payload.audience = audience
      }

      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'שגיאה')
      }

      const data = await res.json()
      const audienceLabel = audience === 'specific'
        ? `${selectedUsers.length} משתמשים נבחרים`
        : (AUDIENCE_OPTIONS.find(a => a.value === audience)?.label || audience)
      const channelLabel = CHANNEL_OPTIONS.find(c => c.value === channel)?.label || channel

      toast.success(`נשלח בהצלחה ל-${data.count} משתמשים`)
      setSentLog(prev => [{
        time: new Date().toLocaleString('he-IL'),
        subject,
        audience: audienceLabel,
        count: data.count,
        channel: channelLabel
      }, ...prev])
      setSubject('')
      setBody('')
      setSelectedUsers([])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'שגיאה בשליחה'
      toast.error(message)
    } finally {
      setSending(false)
    }
  }

  if (!profile?.is_admin) return null

  const isSpecific = audience === 'specific'
  const sendLabel = isSpecific
    ? `שלחי ל-${selectedUsers.length} משתמשים`
    : `שלחי ל${AUDIENCE_OPTIONS.find(a => a.value === audience)?.label}`

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-10 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[#A39888] hover:text-[#1A1410] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-light text-[#1A1410]">שליחת הודעה</h1>
            <p className="font-body text-sm text-[#A39888] mt-0.5">מייל, הודעת מערכת, או שניהם</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2 space-y-4">

            {/* Channel */}
            <div className="border border-[#EBE5DC] bg-white p-5">
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-3">ערוץ שליחה</p>
              <div className="flex gap-2 flex-wrap">
                {CHANNEL_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setChannel(opt.value)}
                    className={`font-body text-sm px-4 py-2 border transition-colors ${
                      channel === opt.value
                        ? 'border-[#C9A871] bg-[#FAF8F3] text-[#1A1410]'
                        : 'border-[#EBE5DC] text-[#A39888] hover:border-[#C9A871]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div className="border border-[#EBE5DC] bg-white p-5">
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-3">קהל יעד</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AUDIENCE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setAudience(opt.value); setSelectedUsers([]) }}
                    className={`text-right px-4 py-3 border transition-colors ${
                      audience === opt.value
                        ? 'border-[#C9A871] bg-[#FAF8F3]'
                        : 'border-[#EBE5DC] hover:border-[#C9A871]'
                    }`}
                  >
                    <div className="font-body text-sm text-[#1A1410]">{opt.label}</div>
                    <div className="font-body text-[11px] text-[#A39888]">{opt.desc}</div>
                  </button>
                ))}
              </div>

              {/* Specific user picker */}
              {isSpecific && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="חיפוש לפי שם או אימייל..."
                    className="w-full font-body text-sm border border-[#EBE5DC] px-4 py-2.5 focus:outline-none focus:border-[#C9A871] bg-[#FDFCFA] mb-2 placeholder:text-[#C4BAA8]"
                  />
                  <div className="max-h-48 overflow-y-auto border border-[#EBE5DC] divide-y divide-[#EBE5DC]">
                    {filteredUsers.length === 0 ? (
                      <p className="font-body text-xs text-[#C4BAA8] px-4 py-3">לא נמצאו משתמשים</p>
                    ) : filteredUsers.map(u => {
                      const isSelected = !!selectedUsers.find(s => s.id === u.id)
                      return (
                        <button
                          key={u.id}
                          onClick={() => toggleUser(u)}
                          className={`w-full text-right px-4 py-2.5 flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-[#FAF8F3]' : 'hover:bg-[#FAF8F3]'
                          }`}
                        >
                          <div>
                            <div className="font-body text-sm text-[#1A1410]">{u.full_name || '—'}</div>
                            <div className="font-body text-[11px] text-[#A39888]">{u.email}</div>
                          </div>
                          <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-[#C9A871] border-[#C9A871]' : 'border-[#EBE5DC]'
                          }`}>
                            {isSelected && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {selectedUsers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedUsers.map(u => (
                        <span key={u.id} className="inline-flex items-center gap-1 font-body text-[11px] bg-[#EBE5DC] text-[#5C4D3C] px-2.5 py-1">
                          {u.full_name || u.email}
                          <button onClick={() => toggleUser(u)} className="text-[#A39888] hover:text-[#B86B5A] ml-1">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="border border-[#EBE5DC] bg-white p-5">
              <label className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-2 block">כותרת</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="למשל: עדכון חשוב מהסטודיו"
                className="w-full font-body text-sm text-[#1A1410] border border-[#EBE5DC] px-4 py-3 focus:outline-none focus:border-[#C9A871] bg-[#FDFCFA] placeholder:text-[#C4BAA8]"
              />
            </div>

            {/* Body */}
            <div className="border border-[#EBE5DC] bg-white p-5">
              <label className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-2 block">תוכן ההודעה</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={7}
                placeholder="כתבי את ההודעה כאן..."
                className="w-full font-body text-sm text-[#1A1410] border border-[#EBE5DC] px-4 py-3 focus:outline-none focus:border-[#C9A871] bg-[#FDFCFA] placeholder:text-[#C4BAA8] resize-y"
              />
            </div>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !body.trim()}
              className="w-full flex items-center justify-center gap-2 font-body text-sm px-6 py-4 bg-[#1A1410] text-[#FDFCFA] hover:bg-[#C9A871] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              {sending ? 'שולח...' : sendLabel}
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="border border-[#EBE5DC] bg-white p-5">
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-4">הודעות שנשלחו</p>
              {sentLog.length === 0 ? (
                <p className="font-body text-xs text-[#C4BAA8]">אין היסטוריה בסשן זה</p>
              ) : (
                <div className="space-y-3">
                  {sentLog.map((log, i) => (
                    <div key={i} className="border-b border-[#EBE5DC] pb-3 last:border-0">
                      <p className="font-body text-xs text-[#1A1410] font-medium">{log.subject}</p>
                      <p className="font-body text-[11px] text-[#A39888] mt-0.5">{log.audience} · {log.count} נמענים</p>
                      <p className="font-body text-[11px] text-[#C9A871] mt-0.5">{log.channel}</p>
                      <p className="font-body text-[10px] text-[#C4BAA8] mt-0.5">{log.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-[#EBE5DC] bg-[#FAF8F3] p-5">
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-3">שים לב</p>
              <ul className="space-y-2">
                {['מייל נשלח דרך Resend', 'הודעת אתר מופיעה כ-bell icon', 'לא ניתן לבטל שליחה'].map((note, i) => (
                  <li key={i} className="font-body text-xs text-[#5C4D3C] flex gap-2">
                    <span className="text-[#C9A871] shrink-0">·</span>{note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
