'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface Profile {
  user_type: string | null
  is_admin: boolean | null
  trial_start_date: string | null
  subscription_start_date: string | null
  created_at: string
}

interface MonthlyCount {
  month: string
  count: number
}

const TRIAL_DAYS = 3

function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function AdminAnalyticsPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile && !profile.is_admin) router.push('/')
  }, [profile, router])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('user_type, is_admin, trial_start_date, subscription_start_date, created_at')
      .order('created_at', { ascending: true })
    setUsers(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const stats = {
    total: users.length,
    subscription: users.filter(u => u.user_type === 'subscription').length,
    trial: users.filter(u => {
      if (u.user_type !== 'trial') return false
      if (!u.trial_start_date) return true
      const days = TRIAL_DAYS - Math.floor((Date.now() - new Date(u.trial_start_date).getTime()) / 86400000)
      return days > 0
    }).length,
    trialExpired: users.filter(u => {
      if (u.user_type !== 'trial' || !u.trial_start_date) return false
      const days = TRIAL_DAYS - Math.floor((Date.now() - new Date(u.trial_start_date).getTime()) / 86400000)
      return days <= 0
    }).length,
    free: users.filter(u => u.user_type === 'free').length,
    admin: users.filter(u => u.is_admin).length,
  }

  const registrationsByMonth: MonthlyCount[] = []
  const monthMap: Record<string, number> = {}
  users.forEach(u => {
    const m = getMonthLabel(u.created_at)
    monthMap[m] = (monthMap[m] || 0) + 1
  })
  Object.entries(monthMap).slice(-6).forEach(([month, count]) => {
    registrationsByMonth.push({ month, count })
  })

  const maxCount = Math.max(...registrationsByMonth.map(m => m.count), 1)

  if (!profile?.is_admin) return null

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-10 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[#A39888] hover:text-[#1A1410] transition-colors">
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-light text-[#1A1410]">סטטיסטיקות</h1>
            <p className="font-body text-sm text-[#A39888] mt-0.5">סקירה כללית של הסטודיו</p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center font-body text-[#A39888]">טוען...</div>
        ) : (
          <>
            {/* Main stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#EBE5DC] border border-[#EBE5DC] mb-8">
              {[
                { label: 'סה"כ משתמשים', value: stats.total, note: '' },
                { label: 'מנויים פעילים', value: stats.subscription, note: '₪ הכנסה' },
                { label: 'בניסיון פעיל', value: stats.trial, note: `מתוך ${TRIAL_DAYS} ימים` },
                { label: 'פג ניסיון', value: stats.trialExpired, note: 'פוטנציאל המרה' },
                { label: 'חינמיים', value: stats.free, note: '' },
                { label: 'מנהלים', value: stats.admin, note: '' },
              ].map(s => (
                <div key={s.label} className="bg-white p-5 text-center">
                  <div className="font-heading text-3xl font-light text-[#1A1410]">{s.value}</div>
                  <div className="font-body text-[11px] text-[#A39888] mt-1">{s.label}</div>
                  {s.note && <div className="font-body text-[10px] text-[#C9A871] mt-0.5">{s.note}</div>}
                </div>
              ))}
            </div>

            {/* Conversion rate */}
            {stats.total > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#EBE5DC] border border-[#EBE5DC] mb-8">
                <div className="bg-white p-5">
                  <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-2">אחוז המרה לניסיון</p>
                  <p className="font-heading text-3xl font-light text-[#1A1410]">
                    {stats.total > 0
                      ? Math.round(((stats.trial + stats.trialExpired + stats.subscription) / stats.total) * 100)
                      : 0}%
                  </p>
                  <p className="font-body text-xs text-[#A39888] mt-1">מנרשמים שהתחילו ניסיון</p>
                </div>
                <div className="bg-white p-5">
                  <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-2">אחוז המרה למנוי</p>
                  <p className="font-heading text-3xl font-light text-[#1A1410]">
                    {(stats.trial + stats.trialExpired + stats.subscription) > 0
                      ? Math.round((stats.subscription / (stats.trial + stats.trialExpired + stats.subscription)) * 100)
                      : 0}%
                  </p>
                  <p className="font-body text-xs text-[#A39888] mt-1">מניסיון למנוי בתשלום</p>
                </div>
                <div className="bg-white p-5">
                  <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-2">הכנסה חודשית מוערכת</p>
                  <p className="font-heading text-3xl font-light text-[#1A1410]">
                    ₪{(stats.subscription * 99).toLocaleString()}
                  </p>
                  <p className="font-body text-xs text-[#A39888] mt-1">בהנחה של ₪99 לחודש</p>
                </div>
              </div>
            )}

            {/* Monthly registrations bar chart */}
            {registrationsByMonth.length > 0 && (
              <div className="border border-[#EBE5DC] bg-white p-6 mb-8">
                <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-6">
                  הצטרפויות לפי חודש (6 חודשים אחרונים)
                </p>
                <div className="flex items-end gap-3 h-32">
                  {registrationsByMonth.map(m => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="font-body text-xs text-[#1A1410]">{m.count}</span>
                      <div
                        className="w-full bg-[#C9A871] transition-all"
                        style={{ height: `${Math.round((m.count / maxCount) * 100)}%`, minHeight: 4 }}
                      />
                      <span className="font-body text-[10px] text-[#A39888] whitespace-nowrap">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="border border-[#EBE5DC] bg-[#FAF8F3] p-5">
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#A39888] mb-3">פעולות מהירות</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/users?filter=trial_expired"
                  className="font-body text-xs px-4 py-2 border border-[#EBE5DC] bg-white text-[#5C4D3C] hover:border-[#C9A871] transition-colors"
                >
                  צפי במשתמשים שפג ניסיון ({stats.trialExpired})
                </Link>
                <Link
                  href="/admin/messages"
                  className="font-body text-xs px-4 py-2 border border-[#EBE5DC] bg-white text-[#5C4D3C] hover:border-[#C9A871] transition-colors"
                >
                  שלחי הודעה למנויים
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
