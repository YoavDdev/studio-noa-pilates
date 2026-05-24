import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1A1410] text-[#FDFCFA]">
      <div className="max-w-8xl mx-auto px-6 md:px-10">

        {/* Main footer content */}
        <div className="py-10 sm:py-16 md:py-20 grid md:grid-cols-3 gap-8 md:gap-8 border-b border-white/10">

          {/* Brand */}
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-light text-[#F5EFE6] mb-4 leading-tight">
              נועה<br />גורלניק
            </p>
            <p className="font-heading text-sm font-light italic text-[#A39888] leading-relaxed">
              גופנו הוא בית מקדש —<br />
              רב הנסתר על הגלוי.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-[#A39888] mb-6">ניווט</p>
            <div className="space-y-3">
              {[
                { href: '/', label: 'בית' },
                { href: '/videos', label: 'שיעורים' },
                { href: '/packages', label: 'חבילות' },
                { href: '/login', label: 'כניסה' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="block font-body text-sm text-[#A39888] hover:text-[#F5EFE6] transition-colors duration-200">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-[#A39888] mb-6">קשר</p>
            <div className="space-y-3">
              <a href="mailto:noa@studio-noa.com"
                className="block font-body text-sm text-[#A39888] hover:text-[#F5EFE6] transition-colors duration-200">
                noa@studio-noa.com
              </a>
              <a href="https://wa.me/972500000000" target="_blank" rel="noopener noreferrer"
                className="block font-body text-sm text-[#A39888] hover:text-[#F5EFE6] transition-colors duration-200">
                וואטסאפ
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="block font-body text-sm text-[#A39888] hover:text-[#F5EFE6] transition-colors duration-200">
                אינסטגרם
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-[#5C4D3C]">
            © {new Date().getFullYear()} נועה גורלניק
          </p>
          <div className="w-1 h-1 rounded-full bg-[#C9A871] hidden md:block" />
          <p className="font-body text-xs text-[#5C4D3C]">
            עוצב באהבה ומודעות
          </p>
        </div>
      </div>
    </footer>
  )
}
