'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  user_type: string
  subscription_id: string | null
  paypal_subscription_id: string | null
  paypal_status: string | null
  subscription_start_date: string | null
  created_at: string
  is_admin: boolean
}

const USER_TYPE_LABELS: Record<string, string> = {
  free: 'חינמי',
  subscription: 'מנוי פעיל',
  trial: 'ניסיון',
  admin: 'מנהל'
}

const USER_TYPE_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  subscription: 'bg-green-100 text-green-800',
  trial: 'bg-blue-100 text-blue-800',
  admin: 'bg-purple-100 text-purple-800'
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

  useEffect(() => {
    if (profile && !profile.is_admin) {
      router.push('/')
    }
  }, [profile, router])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('שגיאה בטעינת משתמשים')
      console.error(error)
    } else {
      setUsers(data || [])
      setFiltered(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    let result = users
    if (search) {
      result = result.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filterType !== 'all') {
      result = result.filter(u => {
        if (filterType === 'admin') return u.is_admin
        return u.user_type === filterType
      })
    }
    setFiltered(result)
  }, [search, filterType, users])

  const handleSaveUserType = async (userId: string) => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ user_type: editType })
      .eq('id', userId)

    if (error) {
      toast.error('שגיאה בשמירה')
    } else {
      toast.success('עודכן בהצלחה')
      setEditingUser(null)
      fetchUsers()
    }
    setSaving(false)
  }

  const stats = {
    total: users.length,
    subscription: users.filter(u => u.user_type === 'subscription').length,
    trial: users.filter(u => u.user_type === 'trial').length,
    free: users.filter(u => u.user_type === 'free').length,
    admin: users.filter(u => u.is_admin).length
  }

  if (!profile?.is_admin) return null

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-light text-[var(--color-text-primary)]">ניהול משתמשים</h1>
            <p className="font-body text-sm text-[var(--color-text-muted)] mt-1">צפייה ועריכה של כל המשתמשים במערכת</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'סה"כ', value: stats.total, color: 'border-[var(--color-border)]' },
            { label: 'מנויים', value: stats.subscription, color: 'border-green-300' },
            { label: 'ניסיון', value: stats.trial, color: 'border-blue-300' },
            { label: 'חינמיים', value: stats.free, color: 'border-gray-300' },
            { label: 'מנהלים', value: stats.admin, color: 'border-purple-300' }
          ].map(s => (
            <div key={s.label} className={`bg-white border ${s.color} p-4 text-center`}>
              <div className="font-heading text-3xl font-light text-[var(--color-text-primary)]">{s.value}</div>
              <div className="font-body text-xs text-[var(--color-text-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-[var(--color-border)] p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="חיפוש לפי שם או אימייל..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="font-body w-full pr-10 pl-4 py-2 border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-background)]"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="font-body px-4 py-2 border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-background)]"
          >
            <option value="all">כל הסוגים</option>
            <option value="subscription">מנויים</option>
            <option value="trial">ניסיון</option>
            <option value="free">חינמיים</option>
            <option value="admin">מנהלים</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-[var(--color-border)] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center font-body text-[var(--color-text-muted)]">טוען...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center font-body text-[var(--color-text-muted)]">לא נמצאו משתמשים</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
                    <th className="font-body text-xs text-right font-medium text-[var(--color-text-muted)] px-4 py-3">משתמש</th>
                    <th className="font-body text-xs text-right font-medium text-[var(--color-text-muted)] px-4 py-3">סוג</th>
                    <th className="font-body text-xs text-right font-medium text-[var(--color-text-muted)] px-4 py-3 hidden md:table-cell">PayPal ID</th>
                    <th className="font-body text-xs text-right font-medium text-[var(--color-text-muted)] px-4 py-3 hidden lg:table-cell">הצטרף</th>
                    <th className="font-body text-xs text-right font-medium text-[var(--color-text-muted)] px-4 py-3">פעולה</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-background)] transition-colors ${idx % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-body text-sm font-medium text-[var(--color-text-primary)]">
                          {user.full_name || '—'}
                        </div>
                        <div className="font-body text-xs text-[var(--color-text-muted)]">{user.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {editingUser === user.id ? (
                          <select
                            value={editType}
                            onChange={e => setEditType(e.target.value)}
                            className="font-body text-xs border border-[var(--color-border)] px-2 py-1 focus:outline-none focus:border-[var(--color-primary)]"
                          >
                            <option value="free">חינמי</option>
                            <option value="trial">ניסיון</option>
                            <option value="subscription">מנוי פעיל</option>
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`font-body text-xs px-2 py-1 ${USER_TYPE_COLORS[user.is_admin ? 'admin' : user.user_type] || 'bg-gray-100 text-gray-700'}`}>
                              {user.is_admin ? 'מנהל' : (USER_TYPE_LABELS[user.user_type] || user.user_type)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-body text-xs text-[var(--color-text-muted)] font-mono">
                          {user.paypal_subscription_id
                            ? user.paypal_subscription_id.substring(0, 12) + '...'
                            : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="font-body text-xs text-[var(--color-text-muted)]">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {editingUser === user.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveUserType(user.id)}
                              disabled={saving}
                              className="font-body text-xs px-3 py-1 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50 transition-colors"
                            >
                              שמור
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="font-body text-xs px-3 py-1 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] transition-colors"
                            >
                              ביטול
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingUser(user.id)
                              setEditType(user.user_type)
                            }}
                            disabled={user.is_admin}
                            className="font-body text-xs px-3 py-1 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            ערוך
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="font-body text-xs text-[var(--color-text-muted)] mt-3 text-left">
          מציג {filtered.length} מתוך {users.length} משתמשים
        </div>
      </div>
    </div>
  )
}
