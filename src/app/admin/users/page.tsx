'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { MagnifyingGlassIcon, ArrowRightIcon, ChevronDownIcon, ChevronUpIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  user_type: string | null
  subscription_id: string | null
  paypal_subscription_id: string | null
  paypal_status: string | null
  paypal_id: string | null
  subscription_start_date: string | null
  trial_start_date: string | null
  cancellation_date: string | null
  created_at: string
  is_admin: boolean | null
  has_seen_welcome_message: boolean | null
}

const TRIAL_DAYS = 3

function getTrialDaysLeft(trialStart: string | null): number | null {
  if (!trialStart) return null
  const start = new Date(trialStart)
  const now = new Date()
  const diff = TRIAL_DAYS - Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function UserTypeBadge({ user }: { user: UserProfile }) {
  const isAdmin = user.is_admin
  const type = user.user_type || 'free'

  if (isAdmin) return (
    <span className="inline-block font-body text-[11px] px-2 py-0.5 bg-[#1A1410] text-[#F5EFE6]">מנהל</span>
  )

  const map: Record<string, { label: string; cls: string }> = {
    subscription: { label: 'מנוי פעיל', cls: 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]' },
    trial:        { label: 'ניסיון',    cls: 'bg-[#E3F2FD] text-[#1565C0] border border-[#90CAF9]' },
    free:         { label: 'חינמי',     cls: 'bg-[#F5F5F5] text-[#616161] border border-[#BDBDBD]' },
  }
  const { label, cls } = map[type] || map['free']
  return <span className={`inline-block font-body text-[11px] px-2 py-0.5 ${cls}`}>{label}</span>
}

function PayPalStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="font-body text-xs text-[#A39888]">—</span>
  const map: Record<string, string> = {
    ACTIVE:    'text-[#2E7D32]',
    CANCELLED: 'text-[#B86B5A]',
    SUSPENDED: 'text-[#E65100]',
    EXPIRED:   'text-[#9E9E9E]',
  }
  return (
    <span className={`font-body text-xs font-medium ${map[status] || 'text-[#5C4D3C]'}`}>
      {status}
    </span>
  )
}

export default function AdminUsersPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [users, setUsers] = useState<UserProfile[]>([])
  const [filtered, setFiltered] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editType, setEditType] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)

  useEffect(() => {
    if (profile && !profile.is_admin) router.push('/')
  }, [profile, router])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('שגיאה בטעינת משתמשים')
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    let result = users
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q)
      )
    }
    if (filterType !== 'all') {
      result = result.filter(u => {
        if (filterType === 'admin') return u.is_admin
        if (filterType === 'trial_expired') {
          const days = getTrialDaysLeft(u.trial_start_date)
          return u.user_type === 'trial' && days !== null && days <= 0
        }
        return u.user_type === filterType
      })
    }
    setFiltered(result)
  }, [search, filterType, users])

  const handleSaveUserType = async (userId: string) => {
    setSaving(true)
    const updates: Partial<UserProfile> = { user_type: editType }
    if (editType === 'trial' && !users.find(u => u.id === userId)?.trial_start_date) {
      updates.trial_start_date = new Date().toISOString()
    }
    if (editType === 'subscription' && !users.find(u => u.id === userId)?.subscription_start_date) {
      updates.subscription_start_date = new Date().toISOString()
    }
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
    if (error) {
      toast.error('שגיאה בשמירה')
    } else {
      toast.success('עודכן בהצלחה')
      setEditingUser(null)
      fetchUsers()
    }
    setSaving(false)
  }

  const handleSendEmail = async (user: UserProfile, type: 'welcome' | 'trial_reminder') => {
    setSendingEmail(user.id + type)
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email, name: user.full_name, type })
      })
      if (!res.ok) throw new Error()
      toast.success('המייל נשלח בהצלחה')
    } catch {
      toast.error('שגיאה בשליחת מייל')
    } finally {
      setSendingEmail(null)
    }
  }

  const stats = {
    total: users.length,
    subscription: users.filter(u => u.user_type === 'subscription').length,
    trial: users.filter(u => u.user_type === 'trial').length,
    trialExpired: users.filter(u => {
      const days = getTrialDaysLeft(u.trial_start_date)
      return u.user_type === 'trial' && days !== null && days <= 0
    }).length,
    free: users.filter(u => u.user_type === 'free').length,
    admin: users.filter(u => u.is_admin).length
  }

  if (!profile?.is_admin) return null

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-10 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[#A39888] hover:text-[#1A1410] transition-colors">
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-light text-[#1A1410]">ניהול משתמשים</h1>
            <p className="font-body text-sm text-[#A39888] mt-0.5">כל הפרטים, המנויים, וסטטוסי התשלום</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-[#EBE5DC] border border-[#EBE5DC] mb-8">
          {[
            { label: 'סה"כ',        value: stats.total,        filter: 'all',          bg: '' },
            { label: 'מנויים',       value: stats.subscription, filter: 'subscription', bg: '' },
            { label: 'ניסיון',       value: stats.trial,        filter: 'trial',        bg: '' },
            { label: 'פג ניסיון',    value: stats.trialExpired, filter: 'trial_expired',bg: '' },
            { label: 'חינמיים',      value: stats.free,         filter: 'free',         bg: '' },
            { label: 'מנהלים',       value: stats.admin,        filter: 'admin',        bg: '' },
          ].map(s => (
            <button
              key={s.filter}
              onClick={() => setFilterType(f => f === s.filter ? 'all' : s.filter)}
              className={`bg-white p-4 text-center hover:bg-[#F5EFE6] transition-colors ${filterType === s.filter ? 'bg-[#F5EFE6]' : ''}`}
            >
              <div className="font-heading text-2xl font-light text-[#1A1410]">{s.value}</div>
              <div className="font-body text-[11px] text-[#A39888] mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A39888]" />
            <input
              type="text"
              placeholder="חיפוש לפי שם או אימייל..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="font-body w-full pr-10 pl-4 py-2.5 border border-[#EBE5DC] bg-white text-sm text-[#1A1410] focus:outline-none focus:border-[#C9A871] placeholder:text-[#C4BAA8]"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="font-body px-4 py-2.5 border border-[#EBE5DC] bg-white text-sm text-[#1A1410] focus:outline-none focus:border-[#C9A871]"
          >
            <option value="all">כל הסוגים</option>
            <option value="subscription">מנויים</option>
            <option value="trial">בניסיון</option>
            <option value="trial_expired">פג ניסיון</option>
            <option value="free">חינמיים</option>
            <option value="admin">מנהלים</option>
          </select>
        </div>

        {/* Table */}
        <div className="border border-[#EBE5DC] bg-white overflow-hidden">
          {loading ? (
            <div className="p-12 text-center font-body text-[#A39888]">טוען...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center font-body text-[#A39888]">לא נמצאו משתמשים</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EBE5DC] bg-[#FDFCFA]">
                    <th className="font-body text-[11px] tracking-[0.1em] uppercase text-right text-[#A39888] px-4 py-3">משתמש</th>
                    <th className="font-body text-[11px] tracking-[0.1em] uppercase text-right text-[#A39888] px-4 py-3">סטטוס</th>
                    <th className="font-body text-[11px] tracking-[0.1em] uppercase text-right text-[#A39888] px-4 py-3 hidden md:table-cell">ניסיון / מנוי</th>
                    <th className="font-body text-[11px] tracking-[0.1em] uppercase text-right text-[#A39888] px-4 py-3 hidden lg:table-cell">PayPal</th>
                    <th className="font-body text-[11px] tracking-[0.1em] uppercase text-right text-[#A39888] px-4 py-3 hidden lg:table-cell">הצטרף</th>
                    <th className="font-body text-[11px] tracking-[0.1em] uppercase text-right text-[#A39888] px-4 py-3">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const trialDays = getTrialDaysLeft(user.trial_start_date)
                    const isExpanded = expandedUser === user.id
                    const isEditing = editingUser === user.id
                    const trialExpired = user.user_type === 'trial' && trialDays !== null && trialDays <= 0

                    return (
                      <>
                        <tr
                          key={user.id}
                          className={`border-b border-[#EBE5DC] last:border-0 hover:bg-[#FDFCFA] transition-colors cursor-pointer ${trialExpired ? 'bg-[#FFF8F5]' : ''}`}
                          onClick={() => setExpandedUser(prev => prev === user.id ? null : user.id)}
                        >
                          {/* שם + מייל */}
                          <td className="px-4 py-3">
                            <div className="font-body text-sm text-[#1A1410]">{user.full_name || '—'}</div>
                            <div className="font-body text-xs text-[#A39888]">{user.email}</div>
                          </td>

                          {/* סטטוס */}
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <select
                                value={editType}
                                onChange={e => setEditType(e.target.value)}
                                onClick={e => e.stopPropagation()}
                                className="font-body text-xs border border-[#EBE5DC] px-2 py-1 focus:outline-none focus:border-[#C9A871] bg-white"
                              >
                                <option value="free">חינמי</option>
                                <option value="trial">ניסיון</option>
                                <option value="subscription">מנוי פעיל</option>
                              </select>
                            ) : (
                              <UserTypeBadge user={user} />
                            )}
                          </td>

                          {/* ניסיון / מנוי */}
                          <td className="px-4 py-3 hidden md:table-cell">
                            {user.user_type === 'trial' && trialDays !== null ? (
                              <div>
                                <span className={`font-body text-xs ${trialExpired ? 'text-[#B86B5A] font-medium' : 'text-[#1565C0]'}`}>
                                  {trialExpired ? 'פג תוקף' : `${trialDays} ימים נותרו`}
                                </span>
                                <div className="font-body text-[11px] text-[#A39888]">
                                  התחיל: {formatDate(user.trial_start_date)}
                                </div>
                              </div>
                            ) : user.user_type === 'subscription' ? (
                              <div>
                                <span className="font-body text-xs text-[#2E7D32]">פעיל</span>
                                <div className="font-body text-[11px] text-[#A39888]">
                                  מאז: {formatDate(user.subscription_start_date)}
                                </div>
                              </div>
                            ) : (
                              <span className="font-body text-xs text-[#A39888]">—</span>
                            )}
                          </td>

                          {/* PayPal */}
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <PayPalStatusBadge status={user.paypal_status} />
                            {user.paypal_subscription_id && (
                              <div className="font-body text-[11px] text-[#A39888] font-mono mt-0.5">
                                {user.paypal_subscription_id.substring(0, 14)}...
                              </div>
                            )}
                          </td>

                          {/* הצטרף */}
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="font-body text-xs text-[#5C4D3C]">
                              {formatDate(user.created_at)}
                            </span>
                          </td>

                          {/* פעולות */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveUserType(user.id)}
                                    disabled={saving}
                                    className="font-body text-xs px-3 py-1 bg-[#1A1410] text-[#F5EFE6] hover:bg-[#C9A871] disabled:opacity-50 transition-colors"
                                  >
                                    {saving ? '...' : 'שמור'}
                                  </button>
                                  <button
                                    onClick={() => setEditingUser(null)}
                                    className="font-body text-xs px-3 py-1 border border-[#EBE5DC] text-[#5C4D3C] hover:border-[#C9A871] transition-colors"
                                  >
                                    ביטול
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => { setEditingUser(user.id); setEditType(user.user_type || 'free') }}
                                    disabled={!!user.is_admin}
                                    className="font-body text-xs px-3 py-1 border border-[#EBE5DC] text-[#5C4D3C] hover:border-[#C9A871] hover:text-[#1A1410] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    ערוך
                                  </button>
                                  <button
                                    onClick={() => setExpandedUser(prev => prev === user.id ? null : user.id)}
                                    className="text-[#A39888] hover:text-[#1A1410] transition-colors"
                                    title="פרטים נוספים"
                                  >
                                    {isExpanded
                                      ? <ChevronUpIcon className="w-4 h-4" />
                                      : <ChevronDownIcon className="w-4 h-4" />
                                    }
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded row */}
                        {isExpanded && (
                          <tr key={user.id + '-expanded'} className="border-b border-[#EBE5DC] bg-[#FAF8F3]">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-right">

                                <div>
                                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] mb-1">מזהה משתמש</p>
                                  <p className="font-body text-xs text-[#5C4D3C] font-mono break-all">{user.id}</p>
                                </div>

                                <div>
                                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] mb-1">PayPal Subscription ID</p>
                                  <p className="font-body text-xs text-[#5C4D3C] font-mono break-all">
                                    {user.paypal_subscription_id || '—'}
                                  </p>
                                </div>

                                <div>
                                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] mb-1">PayPal Status</p>
                                  <PayPalStatusBadge status={user.paypal_status} />
                                </div>

                                <div>
                                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] mb-1">תאריך התחלת ניסיון</p>
                                  <p className="font-body text-xs text-[#5C4D3C]">{formatDate(user.trial_start_date)}</p>
                                </div>

                                <div>
                                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] mb-1">תאריך התחלת מנוי</p>
                                  <p className="font-body text-xs text-[#5C4D3C]">{formatDate(user.subscription_start_date)}</p>
                                </div>

                                <div>
                                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] mb-1">תאריך ביטול</p>
                                  <p className="font-body text-xs text-[#B86B5A]">{formatDate(user.cancellation_date)}</p>
                                </div>

                                <div>
                                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] mb-1">ראה הודעת ברוכה הבאה</p>
                                  <p className="font-body text-xs text-[#5C4D3C]">
                                    {user.has_seen_welcome_message ? 'כן' : 'לא'}
                                  </p>
                                </div>

                                <div>
                                  <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] mb-1">תאריך הצטרפות</p>
                                  <p className="font-body text-xs text-[#5C4D3C]">{formatDate(user.created_at)}</p>
                                </div>
                              </div>

                              {/* Email actions */}
                              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#EBE5DC]">
                                <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#A39888] w-full mb-1">שליחת מייל ידנית</p>
                                <button
                                  onClick={() => handleSendEmail(user, 'welcome')}
                                  disabled={sendingEmail === user.id + 'welcome'}
                                  className="flex items-center gap-1.5 font-body text-xs px-3 py-1.5 border border-[#EBE5DC] text-[#5C4D3C] hover:border-[#C9A871] hover:text-[#1A1410] disabled:opacity-50 transition-colors"
                                >
                                  <EnvelopeIcon className="w-3.5 h-3.5" />
                                  {sendingEmail === user.id + 'welcome' ? 'שולח...' : 'ברוכה הבאה'}
                                </button>
                                <button
                                  onClick={() => handleSendEmail(user, 'trial_reminder')}
                                  disabled={sendingEmail === user.id + 'trial_reminder'}
                                  className="flex items-center gap-1.5 font-body text-xs px-3 py-1.5 border border-[#EBE5DC] text-[#5C4D3C] hover:border-[#C9A871] hover:text-[#1A1410] disabled:opacity-50 transition-colors"
                                >
                                  <EnvelopeIcon className="w-3.5 h-3.5" />
                                  {sendingEmail === user.id + 'trial_reminder' ? 'שולח...' : 'תזכורת ניסיון'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="font-body text-xs text-[#A39888] mt-3">
          מציג {filtered.length} מתוך {users.length} משתמשים
        </div>
      </div>
    </div>
  )
}
