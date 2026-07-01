import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth-helpers'
import Link from 'next/link'

const ADMIN_LINKS = [
  {
    href: '/admin/users',
    label: 'משתמשים',
    desc: 'ניהול, מנויים, PayPal, ימי ניסיון',
    accent: '#C9A871',
  },
  {
    href: '/admin/folders',
    label: 'תיקיות',
    desc: 'כותרות, תמונות, סדר תצוגה',
    accent: '#C9A871',
  },
  {
    href: '/admin/messages',
    label: 'הודעות',
    desc: 'שליחת מייל + הודעה באתר לקהל יעד',
    accent: '#C9A871',
  },
  {
    href: '/admin/analytics',
    label: 'סטטיסטיקות',
    desc: 'המרות, הכנסה, גרפי הצטרפות',
    accent: '#C9A871',
  },
]

export default async function AdminDashboard() {
  const adminAccess = await isAdmin()
  if (!adminAccess) redirect('/')

  return (
    <div className="min-h-screen bg-[#FDFCFA] py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="font-body text-[11px] tracking-[0.25em] uppercase text-[#A39888] mb-2">ממשק ניהול</p>
          <h1 className="font-heading text-4xl font-light text-[#1A1410]">לוח בקרה</h1>
          <div className="w-12 h-px bg-[#C9A871] mt-4" />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-px bg-[#EBE5DC] border border-[#EBE5DC] mb-12">
          {ADMIN_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white p-8 hover:bg-[#FAF8F3] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-light text-[#1A1410] mb-2 group-hover:text-[#C9A871] transition-colors">
                    {link.label}
                  </h2>
                  <p className="font-body text-sm text-[#A39888]">{link.desc}</p>
                </div>
                <svg className="w-5 h-5 text-[#EBE5DC] group-hover:text-[#C9A871] transition-colors mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Back to site */}
        <div className="border-t border-[#EBE5DC] pt-6">
          <Link
            href="/"
            className="font-body text-sm text-[#A39888] hover:text-[#1A1410] transition-colors"
          >
            ← חזרה לאתר
          </Link>
        </div>
      </div>
    </div>
  )
}
