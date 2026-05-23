'use client'

import { useState, useEffect } from 'react'
import { createClientSupabase } from '@/lib/supabase'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabase()

  useEffect(() => {
    if (!supabase) {
      toast.error('Supabase לא מוגדר')
      router.push('/login')
    }
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('הסיסמאות לא תואמות')
      return
    }

    if (password.length < 6) {
      toast.error('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }

    if (!supabase) {
      toast.error('Supabase לא מוגדר')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      toast.success('הסיסמה שונתה בהצלחה! 🎉')
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: unknown) {
      toast.error((error as Error).message || 'שגיאה בשינוי הסיסמה')
    } finally {
      setLoading(false)
    }
  }

  if (!supabase) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center section-padding">
      <div className="card max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-deep-sage)]">
            <span className="text-white font-semibold text-xl">נ</span>
          </div>
          <h2 className="mt-6 text-center heading-lg text-[var(--color-charcoal)]">
            {success ? 'הסיסמה שונתה!' : 'איפוס סיסמה'}
          </h2>
          <p className="mt-2 text-center body-sm text-[var(--color-soft-charcoal)]">
            {success 
              ? 'הסיסמה שלך שונתה בהצלחה. מעביר אותך להתחברות...'
              : 'בחרי סיסמה חדשה לחשבון שלך'
            }
          </p>
        </div>

        {!success ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-charcoal)]">
                  סיסמה חדשה
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border rounded-lg sm:text-sm placeholder-[var(--color-soft-charcoal)] text-[var(--color-charcoal)] border-[var(--color-warm-gray)] focus:outline-none focus:border-[var(--color-sage)]"
                    placeholder="••••••••"
                    dir="ltr"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-soft-charcoal)]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  הסיסמה חייבת להכיל לפחות 6 תווים
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-charcoal)]">
                  אימות סיסמה
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border rounded-lg sm:text-sm placeholder-[var(--color-soft-charcoal)] text-[var(--color-charcoal)] border-[var(--color-warm-gray)] focus:outline-none focus:border-[var(--color-sage)]"
                    placeholder="••••••••"
                    dir="ltr"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-soft-charcoal)]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'משנה סיסמה...' : 'שנה סיסמה'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 text-center space-y-6">
            <CheckCircleIcon className="w-20 h-20 text-green-600 mx-auto" />
            <Link
              href="/login"
              className="btn-primary inline-block"
            >
              התחבר עכשיו
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
