'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { UserCircleIcon, EnvelopeIcon, CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user, profile, updateProfile, loading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [profileTimeout, setProfileTimeout] = useState(false)

  useEffect(() => {
    console.log('Profile page - loading:', loading, 'user:', !!user, 'profile:', !!profile)
    
    // Only redirect if we're done loading and there's no user
    if (!loading && !user) {
      console.log('No user found, redirecting to login')
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name)
    }
  }, [profile])

  // Timeout: stop showing spinner after 3 seconds even if profile hasn't loaded
  useEffect(() => {
    if (user && !profile) {
      const timer = setTimeout(() => setProfileTimeout(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [user, profile])

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error('השם לא יכול להיות ריק')
      return
    }

    setSaving(true)
    try {
      await updateProfile({ full_name: fullName })
      toast.success('הפרטים עודכנו בהצלחה! 🎉')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('שגיאה בעדכון הפרטים')
    } finally {
      setSaving(false)
    }
  }

  const getUserTypeText = () => {
    if (profile?.subscription_id === 'Admin' || profile?.user_type === 'admin') {
      return { text: 'מנהל מערכת', color: 'text-[#C9A871]', bg: 'bg-[#F5EFE6]' }
    }
    if (profile?.subscription_id?.startsWith('I-')) {
      return { text: 'מנוי פעיל', color: 'text-green-700', bg: 'bg-green-50' }
    }
    if (profile?.subscription_id === 'Trial' || profile?.user_type === 'trial') {
      return { text: 'תקופת ניסיון', color: 'text-blue-700', bg: 'bg-blue-50' }
    }
    return { text: 'משתמש חינמי', color: 'text-[#A39888]', bg: 'bg-[#F5EFE6]' }
  }

  const userType = getUserTypeText()

  // Show loading only if we're still loading AND don't have a user yet
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A871] mx-auto"></div>
          <p className="mt-4 text-[#A39888]">טוען...</p>
        </div>
      </div>
    )
  }

  // If we're done loading and still no user, return null (will redirect)
  if (!user) {
    return null
  }

  // If we have user but no profile yet
  if (!profile) {
    if (!profileTimeout) {
      return (
        <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A871] mx-auto"></div>
            <p className="mt-4 text-[#A39888]">טוען פרופיל...</p>
          </div>
        </div>
      )
    }
    // Timeout reached - show basic profile with user info
    return (
      <div className="min-h-screen bg-[#FDFCFA] py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-[#2A2520] mb-2">הפרופיל שלי</h1>
          <div className="bg-white border border-[#EBE5DC] p-8 mt-6">
            <p className="text-[#5C4D3C] mb-2">אימייל: {user.email}</p>
            <p className="text-[#5C4D3C] mb-4">שם: {user.user_metadata?.full_name || user.user_metadata?.name || 'לא הוגדר'}</p>
            <p className="text-sm text-[#A39888]">הפרופיל שלך עדיין בטעינה. נסה לרענן את הדף.</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-[#C9A871] text-white hover:bg-[#B8935A] transition-colors">
              רענן דף
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-8 sm:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#2A2520] mb-2">הפרופיל שלי</h1>
          <p className="text-[#A39888]">נהל את הפרטים האישיים והמנוי שלך</p>
        </div>

        <div className="grid gap-6">
          {/* Personal Info Card */}
          <div className="bg-white border border-[#EBE5DC] p-5 sm:p-8">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2A2520] flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6 text-[#C9A871]" />
                פרטים אישיים
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-[#C9A871] hover:text-[#8B6B38] transition-colors"
                >
                  ערוך
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[#5C4D3C] mb-2">
                  שם מלא
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#EBE5DC] text-[#2A2520] focus:outline-none focus:border-[#C9A871] transition-colors"
                    placeholder="הזן שם מלא"
                  />
                ) : (
                  <p className="text-[#2A2520] text-lg">{profile.full_name || 'לא הוגדר'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#5C4D3C] mb-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  אימייל
                </label>
                <p className="text-[#2A2520] text-lg">{user.email}</p>
                <p className="text-xs text-[#A39888] mt-1">לא ניתן לשנות את כתובת האימייל</p>
              </div>

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#1A1410] text-[#FDFCFA] hover:bg-[#C9A871] transition-colors disabled:opacity-50"
                  >
                    {saving ? 'שומר...' : 'שמור שינויים'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setFullName(profile.full_name || '')
                    }}
                    className="px-6 py-2.5 border border-[#EBE5DC] text-[#5C4D3C] hover:bg-[#F5EFE6] transition-colors"
                  >
                    ביטול
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white border border-[#EBE5DC] p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2A2520] flex items-center gap-2 mb-5 sm:mb-6">
              <SparklesIcon className="w-6 h-6 text-[#C9A871]" />
              סטטוס מנוי
            </h2>

            <div className="space-y-4">
              {/* Subscription Type Badge */}
              <div>
                <label className="block text-sm font-medium text-[#5C4D3C] mb-2">
                  סוג מנוי
                </label>
                <span className={`inline-block px-4 py-2 ${userType.bg} ${userType.color} font-medium`}>
                  {userType.text}
                </span>
              </div>

              {/* Created Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#5C4D3C] mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  תאריך הצטרפות
                </label>
                <p className="text-[#2A2520]">
                  {new Date(profile.created_at).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Subscription ID (for admins/premium) */}
              {profile.subscription_id && profile.subscription_id !== 'Free' && (
                <div>
                  <label className="block text-sm font-medium text-[#5C4D3C] mb-2">
                    מזהה מנוי
                  </label>
                  <p className="text-[#2A2520] font-mono text-sm">{profile.subscription_id}</p>
                </div>
              )}

              {/* Trial Info */}
              {profile.trial_start_date && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-900">
                    תקופת הניסיון שלך החלה ב-{new Date(profile.trial_start_date).toLocaleDateString('he-IL')}
                  </p>
                </div>
              )}

              {/* Upgrade CTA for free users */}
              {(!profile.subscription_id || profile.subscription_id === 'Free') && (
                <div className="mt-6 p-6 bg-gradient-to-br from-[#F5EFE6] to-[#FDFCFA] border border-[#C9A871]">
                  <h3 className="text-lg font-semibold text-[#2A2520] mb-2">
                    שדרגי למנוי פרימיום
                  </h3>
                  <p className="text-[#5C4D3C] mb-4">
                    קבלי גישה מלאה לכל השיעורים והתכנים הבלעדיים
                  </p>
                  <button
                    onClick={() => router.push('/packages')}
                    className="px-6 py-3 bg-[#1A1410] text-[#FDFCFA] hover:bg-[#C9A871] transition-colors"
                  >
                    צפי בחבילות
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Actions Card */}
          <div className="bg-white border border-[#EBE5DC] p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2A2520] mb-5 sm:mb-6">
              פעולות חשבון
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/forgot-password')}
                className="w-full text-right px-4 py-3 border border-[#EBE5DC] text-[#5C4D3C] hover:bg-[#F5EFE6] transition-colors"
              >
                שינוי סיסמה
              </button>

              {(profile as { is_admin?: boolean })?.is_admin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full text-right px-4 py-3 border border-[#C9A871] text-[#C9A871] hover:bg-[#F5EFE6] transition-colors"
                >
                  ניהול מערכת
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
