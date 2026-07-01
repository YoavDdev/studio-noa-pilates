'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'כל המשתמשים', desc: 'שליחה לכולם' },
  { value: 'subscription', label: 'מנויים פעילים', desc: 'רק משתמשים עם מנוי' },
  { value: 'trial', label: 'בניסיון', desc: 'רק משתמשים בתקופת ניסיון' },
  { value: 'free', label: 'חינמיים', desc: 'משתמשים ללא מנוי' },
]

export default function AdminMessagesPage() {
  const { profile } = useAuth()
  const router = useRouter()

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all')
  const [sending, setSending] = useState(false)
  const [sentLog, setSentLog] = useState<{ time: string; subject: string; audience: string; count: number }[]>([])

  useEffect(() => {
    if (profile && !profile.is_admin) router.push('/')
  }, [profile, router])

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('נא למלא כותרת וגוף הודעה')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, audience })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'שגיאה')
      }

      const data = await res.json()
      toast.success(`נשלח בהצלחה ל-${data.count} משתמשים`)
      setSentLog(prev => [{
        time: new Date().toLocaleString('he-IL'),
        subject,
        audience: AUDIENCE_OPTIONS.find(a => a.value === audience)?.label || audience,
        count: data.count
      }, ...prev])
      setSubject('')
      setBody('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'שגיאה בשליחה'
      toast.error(message)
    } finally {
      setSending(false)
    }
  }

  if (!profile?.is_admin) return null

  const selectedAudience = AUDIENCE_OPTIONS.find(a => a.value === audience)

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-10 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[#A39888] hover:text-[#1A1410] transition-colors">
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-light text-[#1A1410]">שליחת הודעה</h1>
            <p className="font-body text-sm text-[#A39888] mt-0.5">מייל + הודעה באתר לכל קהל יעד</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2 space-y-4">

            {/* Audience */}
            <div className="border border-[#EBE5DC] bg-white p-5">
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-3">קהל יעד</p>
              <div className="grid grid-cols-2 gap-2">
                {AUDIENCE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAudience(opt.value)}
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
            </div>

            {/* Subject */}
            <div className="border border-[#EBE5DC] bg-white p-5">
              <label className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-2 block">
                כותרת המייל
              </label>
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
              <label className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-2 block">
                תוכן ההודעה
              </label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={8}
                placeholder="כתבי את ההודעה כאן..."
                className="w-full font-body text-sm text-[#1A1410] border border-[#EBE5DC] px-4 py-3 focus:outline-none focus:border-[#C9A871] bg-[#FDFCFA] placeholder:text-[#C4BAA8] resize-y"
              />
              <p className="font-body text-[11px] text-[#A39888] mt-2">
                ההודעה תישלח גם כמייל וגם תופיע כהתראה באתר למשתמשים המחוברים.
              </p>
            </div>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !body.trim()}
              className="w-full flex items-center justify-center gap-2 font-body text-sm px-6 py-4 bg-[#1A1410] text-[#FDFCFA] hover:bg-[#C9A871] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              {sending ? 'שולח...' : `שלחי ל${selectedAudience?.label}`}
            </button>
          </div>

          {/* Sidebar: sent log */}
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
                      <p className="font-body text-[11px] text-[#A39888] mt-0.5">
                        {log.audience} · {log.count} נמענים
                      </p>
                      <p className="font-body text-[10px] text-[#C4BAA8] mt-0.5">{log.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-[#EBE5DC] bg-[#FAF8F3] p-5">
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-3">שים לב</p>
              <ul className="space-y-2">
                {[
                  'המייל נשלח דרך Resend',
                  'ההודעה מופיעה גם כ-bell icon לכל משתמש',
                  'לא ניתן לבטל שליחה',
                  'Resend חייב להיות מוגדר ב-.env'
                ].map((note, i) => (
                  <li key={i} className="font-body text-xs text-[#5C4D3C] flex gap-2">
                    <span className="text-[#C9A871] shrink-0">·</span>
                    {note}
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
