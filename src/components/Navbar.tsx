'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setIsUserMenuOpen(false)
    }
    if (isUserMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    setIsMenuOpen(false)
    
    toast.loading('מתנתק...', { id: 'signout' })
    
    // Sign out on client side
    await signOut()
    
    // Also sign out on server side to clear cookies
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch (e) {
      console.error('Server signout error:', e)
    }
    
    toast.success('התנתקת בהצלחה', { id: 'signout' })
    
    // Force a full page reload to clear all state
    window.location.href = '/'
  }

  const navLinks = user
    ? [{ href: '/videos', label: 'שיעורים' }, { href: '/packages', label: 'חבילות' }]
    : [{ href: '/', label: 'בית' }, { href: '/videos', label: 'שיעורים' }, { href: '/packages', label: 'חבילות' }]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#FDFCFA]/96 backdrop-blur-md border-b border-[#EBE5DC] shadow-[0_1px_12px_rgba(0,0,0,0.06)]'
        : 'bg-[#FDFCFA] border-b border-[#EBE5DC]'
    }`}>
      <div className="max-w-8xl mx-auto px-6 md:px-12">
        <div className="relative flex items-center justify-between" style={{ height: '4.5rem' }}>

          {/* Logo */}
          <div>
            <Link href="/" className="group inline-flex flex-col">
              <span className="font-heading text-2xl md:text-3xl font-light text-[#1A1410] tracking-wide group-hover:text-[#C9A871] transition-colors duration-300 leading-tight">
                נועה גורלניק
              </span>
              <span className="block h-px w-0 group-hover:w-full bg-[#C9A871] transition-all duration-500" />
            </Link>
          </div>

          {/* Nav — absolutely centered regardless of logo/actions width */}
          <div className="hidden md:flex items-center gap-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map(({ href, label }) => {
              const active = mounted && pathname === href
              return (
                <Link key={href} href={href}
                  className={`font-body text-sm tracking-wider transition-colors duration-200 relative group ${
                    active ? 'text-[#C9A871]' : 'text-[#5C4D3C] hover:text-[#1A1410]'
                  }`}
                >
                  {label}
                  <span className={`absolute -bottom-1 right-0 h-px bg-[#C9A871] transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-6">

            {/* Desktop actions */}
            {user ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 font-body text-sm text-[#5C4D3C] hover:text-[#1A1410] transition-colors"
                >
                  <span>
                    {profile?.full_name?.split(' ')[0] || 
                     user.user_metadata?.full_name?.split(' ')[0] || 
                     user.user_metadata?.name?.split(' ')[0] || 
                     'משתמש'}
                  </span>
                  <svg className="w-3 h-3 text-[#C9A871] mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-3 w-52 bg-[#FDFCFA] border border-[#EBE5DC] shadow-strong z-50">
                    <div className="px-5 py-4 border-b border-[#EBE5DC]">
                      <p className="font-body text-xs text-[#A39888]">{user.email}</p>
                    </div>
                    <Link href="/profile"
                      className="block px-5 py-3 font-body text-sm text-[#5C4D3C] hover:bg-[#F5EFE6] hover:text-[#1A1410] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}>
                      הפרופיל שלי
                    </Link>
                    {(profile as { is_admin?: boolean } | null)?.is_admin && (
                      <Link href="/admin"
                        className="block px-5 py-3 font-body text-sm text-[#5C4D3C] hover:bg-[#F5EFE6] hover:text-[#1A1410] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}>
                        ניהול מערכת
                      </Link>
                    )}
                    <div className="border-t border-[#EBE5DC]">
                      <button 
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-right px-5 py-3 font-body text-sm text-[#B86B5A] hover:bg-[#F5EFE6] transition-colors">
                        התנתקות
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/login" className="font-body text-sm text-[#5C4D3C] hover:text-[#1A1410] transition-colors">
                  כניסה
                </Link>
                <Link href="/register"
                  className="font-body text-sm tracking-wider bg-[#1A1410] text-[#FDFCFA] px-6 py-2.5 hover:bg-[#C9A871] transition-colors duration-300">
                  התחילי מסע
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 text-[#1A1410]"
              aria-label="תפריט"
            >
              <span className={`block w-6 h-px bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block w-6 h-px bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-px bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#FDFCFA] border-t border-[#EBE5DC] px-6 py-8">
          <div className="space-y-1 mb-8">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`block py-3 font-body text-base border-b border-[#EBE5DC] transition-colors ${
                  mounted && pathname === href ? 'text-[#C9A871]' : 'text-[#5C4D3C]'
                }`}
                onClick={() => setIsMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="space-y-1">
              <p className="font-body text-xs text-[#A39888] mb-4">{user.email}</p>
              <Link href="/profile" className="block py-3 font-body text-sm text-[#5C4D3C] border-b border-[#EBE5DC]" onClick={() => setIsMenuOpen(false)}>הפרופיל שלי</Link>
              {(profile as { is_admin?: boolean } | null)?.is_admin && (
                <Link href="/admin" className="block py-3 font-body text-sm text-[#5C4D3C] border-b border-[#EBE5DC]" onClick={() => setIsMenuOpen(false)}>ניהול מערכת</Link>
              )}
              <button 
                type="button"
                onClick={handleSignOut} 
                className="block py-3 font-body text-sm text-[#B86B5A] w-full text-right">
                התנתקות
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Link href="/login" className="block text-center py-3 font-body text-sm text-[#5C4D3C] border border-[#EBE5DC]" onClick={() => setIsMenuOpen(false)}>כניסה</Link>
              <Link href="/register" className="block text-center py-3 font-body text-sm bg-[#1A1410] text-[#FDFCFA] tracking-wider" onClick={() => setIsMenuOpen(false)}>התחילי מסע</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
