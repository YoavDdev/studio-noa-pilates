'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { translations } from '@/lib/translations'
import { useState } from 'react'
import { 
  HomeIcon, 
  PlayIcon, 
  CubeIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Close mobile menu if open
      setIsMenuOpen(false)
      // Navigate home and force a full reload to guarantee UI updates
      router.replace('/')
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { href: '/', label: translations.home, icon: HomeIcon },
    { href: '/videos', label: translations.videos, icon: PlayIcon },
    { href: '/packages', label: translations.packages, icon: CubeIcon },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-warm-gray)]/30 bg-[var(--color-soft-white)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-soft-white)]/75">
      <div className="container">
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center h-20">
          {/* Left navigation */}
          <div className="hidden md:flex col-start-1 justify-self-start" style={{ direction: 'rtl' }}>
            <div className="flex items-center gap-6">
              {navItems.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative font-medium text-base transition-colors ${
                      active
                        ? 'text-[var(--color-warm-terracotta)]'
                        : 'text-[var(--color-soft-charcoal)] hover:text-[var(--color-warm-terracotta)]'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Brand (text only, logo removed) */}
          <Link href="/" className="col-start-2 justify-self-center text-2xl md:text-3xl font-bold tracking-wide text-[var(--color-warm-terracotta)]">
            {user ? (
              <span className="font-normal text-[var(--color-warm-terracotta)]" style={{ fontFamily: 'var(--font-quote)' }}>
                {(profile?.full_name?.split(' ')[0] || (user.email?.split('@')[0] || '')) + ', '}
                יש לך אותך
              </span>
            ) : (
              <span className="font-normal text-[var(--color-warm-terracotta)]" style={{ fontFamily: 'var(--font-quote)' }}>
                יש לך אותך
              </span>
            )}
          </Link>

          {/* Right side actions / Mobile trigger */}
          <div className="col-start-3 justify-self-end">
            <div className="hidden md:flex items-center gap-4" style={{ direction: 'ltr' }}>
              {user ? (
                <>
                  <button onClick={handleSignOut} className="text-[var(--color-soft-charcoal)] hover:text-[var(--color-warm-terracotta)] text-base font-medium">
                    {translations.logout}
                  </button>
                  <Link href="/videos" className="text-[var(--color-warm-terracotta)] hover:text-[var(--color-accent-coral)] text-base font-semibold border-b-2 border-[var(--color-warm-terracotta)] hover:border-[var(--color-accent-coral)] transition-colors">
                    התחל עכשיו
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[var(--color-soft-charcoal)] hover:text-[var(--color-warm-terracotta)] text-base font-medium">
                    {translations.signIn}
                  </Link>
                  <Link href="/register" className="text-[var(--color-warm-terracotta)] hover:text-[var(--color-accent-coral)] text-base font-semibold border-b-2 border-[var(--color-warm-terracotta)] hover:border-[var(--color-accent-coral)] transition-colors">
                    התחל ניסיון חינם
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[var(--color-warm-terracotta)] p-2"
              aria-label="פתח תפריט"
            >
              {isMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-warm-gray)]/30 py-4 bg-[var(--color-soft-white)]/90">
            <div className="space-y-4">
              {navItems.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`block uppercase tracking-wider font-medium ${active ? 'text-[var(--color-warm-terracotta)]' : 'text-[var(--color-soft-charcoal)] hover:text-[var(--color-warm-terracotta)]'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-[var(--color-warm-gray)]/30 mt-4">
                {user ? (
                  <div className="space-y-3">
                    <span className="block text-[var(--color-warm-terracotta)] font-medium">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-[var(--color-soft-charcoal)] hover:text-[var(--color-warm-terracotta)]"
                    >
                      {translations.logout}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block text-[var(--color-soft-charcoal)] hover:text-[var(--color-warm-terracotta)]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {translations.signIn}
                    </Link>
                    <Link
                      href="/register"
                      className="inline-block px-6 py-3 rounded-full border border-[var(--color-warm-terracotta)] text-[var(--color-warm-terracotta)] hover:bg-[var(--color-warm-terracotta)] hover:text-white transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {translations.signUp}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
