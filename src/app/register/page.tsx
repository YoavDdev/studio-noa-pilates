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
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp(email, password, fullName)
      toast.success(translations.registerSuccess)
      router.push('/')
    } catch (error: unknown) {
      toast.error((error as Error).message || translations.registerError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center section-padding">
      <div className="card max-w-md w-full space-y-8">
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
