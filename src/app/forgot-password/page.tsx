'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await resetPassword(email)
      setEmailSent(true)
      toast.success('נשלח קישור לאיפוס סיסמה! 📧\nבדקי את תיבת הדואר שלך')
    } catch (error: unknown) {
      toast.error((error as Error).message || 'שגיאה בשליחת המייל')
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
            {emailSent ? 'המייל נשלח!' : 'שכחת סיסמה?'}
          </h2>
          <p className="mt-2 text-center body-sm text-[var(--color-soft-charcoal)]">
            {emailSent 
              ? 'שלחנו לך קישור לאיפוס הסיסמה. בדקי את תיבת הדואר שלך (וגם בספאם).'
              : 'אין בעיה! נשלח לך קישור לאיפוס הסיסמה.'
            }
          </p>
        </div>

        {!emailSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'שולח...' : 'שלח קישור לאיפוס סיסמה'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-deep-sage)] hover:text-[var(--color-sage)]"
              >
                <ArrowRightIcon className="w-4 h-4" />
                חזרה להתחברות
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">📧</div>
              <p className="text-sm text-[var(--color-soft-charcoal)]">
                לא קיבלת את המייל?{' '}
                <button
                  onClick={() => setEmailSent(false)}
                  className="font-medium text-[var(--color-deep-sage)] hover:text-[var(--color-sage)]"
                >
                  נסי שוב
                </button>
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-deep-sage)] hover:text-[var(--color-sage)]"
              >
                <ArrowRightIcon className="w-4 h-4" />
                חזרה להתחברות
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
