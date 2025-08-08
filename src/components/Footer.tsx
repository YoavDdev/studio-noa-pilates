import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[var(--color-charcoal)] to-[var(--color-soft-charcoal)] text-white">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between h-20 gap-3" style={{ direction: 'rtl' }}>
          {/* Brand / Tagline */}
          <div className="body-sm text-white/90">
            <span className="font-normal" style={{ fontFamily: 'var(--font-quote)' }}>יש לך אותך</span>
            <span className="mx-2 text-white/50">•</span>
            <span>© {new Date().getFullYear()} Noa Gorolnik</span>
          </div>

          {/* Simple links */}
          <nav className="flex items-center gap-5" style={{ direction: 'ltr' }}>
            <Link href="/videos" className="body-sm font-medium text-white/90 hover:text-white">
              שיעורים
            </Link>
            <Link href="/packages" className="body-sm font-medium text-white/90 hover:text-white">
              חבילות
            </Link>
            <a href="mailto:studio.noa.pilates@gmail.com" className="body-sm font-medium text-white/90 hover:text-white">
              מייל
            </a>
            <a href="https://wa.me/972526123456" target="_blank" rel="noopener noreferrer" className="body-sm font-medium text-white/90 hover:text-white">
              וואטסאפ
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
