'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp(email, password, fullName)
      toast.success(
        'נשלח מייל אישור! 📧\nבדקי את תיבת הדואר שלך (וגם בספאם) ולחצי על הקישור לאישור ההרשמה.',
        { duration: 8000 }
      )
      // Don't redirect - let user see the message
      setEmail('')
      setPassword('')
      setFullName('')
    } catch (error: unknown) {
      const msg = (error as Error).message || ''
      if (msg.includes('already registered') || msg.includes('User already registered') || msg.includes('already been registered')) {
        toast.error('כתובת המייל הזו כבר רשומה במערכת.\nאם נרשמת עם Google — התחברי דרך כפתור Google.', { duration: 8000 })
      } else {
        toast.error(msg || translations.registerError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error: unknown) {
      toast.error((error as Error).message || 'שגיאה בהרשמה עם Google')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center section-padding px-4 sm:px-6">
      <div className="card max-w-md w-full space-y-8 bg-white p-6 sm:p-8 border border-[var(--color-border,#EBE5DC)]">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-deep-sage)]">
            <span className="text-white font-semibold text-xl">נ</span>
          </div>
          <h2 className="mt-6 text-center heading-lg text-[var(--color-charcoal)]">
            {translations.register}
          </h2>
          <p className="mt-2 text-center body-sm text-[var(--color-soft-charcoal)]">
            {translations.alreadyHaveAccount}{' '}
            <Link
              href="/login"
              className="font-medium text-[var(--color-deep-sage)] hover:text-[var(--color-sage)]"
            >
              {translations.signIn}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[var(--color-charcoal)]">
                {translations.fullName}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border rounded-lg sm:text-sm placeholder-[var(--color-soft-charcoal)] text-[var(--color-charcoal)] border-[var(--color-warm-gray)] focus:outline-none focus:border-[var(--color-sage)]"
                placeholder="השם המלא שלך"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-charcoal)]">
                {translations.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border rounded-lg sm:text-sm placeholder-[var(--color-soft-charcoal)] text-[var(--color-charcoal)] border-[var(--color-warm-gray)] focus:outline-none focus:border-[var(--color-sage)]"
                placeholder="your@email.com"
                dir="ltr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-charcoal)]">
                {translations.password}
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
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? translations.loading : translations.signUp}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            בהרשמה אתה מסכים ל
            <Link href="/terms" className="text-[var(--color-deep-sage)] hover:text-[var(--color-sage)] mx-1">
              תנאי השימוש
            </Link>
            ול
            <Link href="/privacy" className="text-[var(--color-deep-sage)] hover:text-[var(--color-sage)] mx-1">
              מדיניות הפרטיות
            </Link>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-warm-gray)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--color-soft-white)] text-[var(--color-soft-charcoal)]">או</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-[var(--color-warm-gray)] rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-[var(--color-charcoal)]">
                {googleLoading ? 'נרשם...' : 'הירשם עם Google'}
              </span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-soft-charcoal)]">
              רוצה לראות שיעורים חינמיים?{' '}
              <Link
                href="/videos"
                className="font-medium text-[var(--color-deep-sage)] hover:text-[var(--color-sage)]"
              >
                לחץ כאן
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
