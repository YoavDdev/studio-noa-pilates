'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Home() {
  const { user, profile } = useAuth()

  useEffect(() => {
    const containers = Array.from(document.querySelectorAll<HTMLElement>('.reveal-on-scroll'))
    if (containers.length === 0) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { containers.forEach((el) => el.classList.add('in-view')); return }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    containers.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-[#FAF8F3] text-[#1A130A]">

      {/* ═══════════════════════════════════════
          HERO — Editorial split layout
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen grid md:grid-cols-2">

        {/* Right: Text */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 md:py-0 order-2 md:order-1">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-[#9C8E7E] mb-8 fade-in-up" style={{ animationDelay: '0s' }}>
            מורה לתנועה ונשימה
          </p>
          <h1 className="font-heading text-[clamp(4rem,8vw,7rem)] font-light leading-[0.95] text-[#0F0A05] mb-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
            נועה<br />גורלניק
          </h1>
          <div className="w-12 h-px bg-[#B8935A] mb-8 fade-in-up" style={{ animationDelay: '0.2s' }} />
          <p className="font-heading text-xl md:text-2xl font-light leading-relaxed text-[#5C4D3C] mb-10 max-w-md fade-in-up" style={{ animationDelay: '0.25s' }}>
            רב הנסתר על הגלוי.<br />
            גופנו הוא בית מקדש —<br />
            ואין תנועה שאינה נכונה.
          </p>
          {!user ? (
            <div className="flex flex-wrap gap-4 fade-in-up" style={{ animationDelay: '0.35s' }}>
              <Link href="/register"
                className="inline-flex items-center gap-3 bg-[#0F0A05] text-[#FAF8F3] font-body text-sm tracking-wider px-8 py-4 hover:bg-[#B8935A] transition-colors duration-300">
                התחילי מסע
              </Link>
              <Link href="/videos"
                className="inline-flex items-center gap-3 border border-[#E8E2D9] text-[#1A130A] font-body text-sm tracking-wider px-8 py-4 hover:border-[#B8935A] hover:text-[#B8935A] transition-colors duration-300">
                לספריית השיעורים
              </Link>
            </div>
          ) : (
            <div className="fade-in-up" style={{ animationDelay: '0.35s' }}>
              <p className="font-body text-[#5C4D3C] mb-4">
                שלום {profile?.full_name?.split(' ')[0]} —
                {profile?.subscription_type === 'premium' ? ' המנוי שלך פעיל' : ' ברוכה הבאה'}
              </p>
              <Link href="/videos"
                className="inline-flex items-center gap-3 bg-[#0F0A05] text-[#FAF8F3] font-body text-sm tracking-wider px-8 py-4 hover:bg-[#B8935A] transition-colors duration-300">
                המשיכי לתרגל
              </Link>
            </div>
          )}
        </div>

        {/* Left: Image */}
        <div className="relative min-h-[50vh] md:min-h-screen order-1 md:order-2 overflow-hidden">
          <Image
            src="/img/468399876_122127044720380852_7297415422565837152_n.jpg"
            alt="נועה גורלניק"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF8F3]/20" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#9C8E7E] opacity-60">
          <div className="w-px h-12 bg-[#9C8E7E] animate-pulse" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT — Centered, poetic
      ═══════════════════════════════════════ */}
      <section className="section-padding reveal-on-scroll border-t border-[#E8E2D9]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-[#9C8E7E] mb-10 fade-in-up" style={{ animationDelay: '0s' }}>
            קצת עלי
          </p>
          <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-light text-[#0F0A05] mb-10 fade-in-up" style={{ animationDelay: '0.1s' }}>
            נעים להכיר
          </h2>
          <div className="w-8 h-px bg-[#B8935A] mx-auto mb-10 fade-in-up" style={{ animationDelay: '0.15s' }} />
          <p className="font-heading text-lg md:text-xl font-light leading-[2] text-[#5C4D3C] mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
            אמא לשניים, בת 34, חיה את עולם התנועה מגיל 4.
          </p>
          <p className="font-body text-base leading-8 text-[#5C4D3C] mb-8 fade-in-up" style={{ animationDelay: '0.25s' }}>
            מ-2015 נכנסתי להדריך אינספור אנשים ולטפל ממקום של הקשבה, הנאה ולא מאבק —
            ליצור חיבור של הרמוניה, אהבה וריפוי.
            יציאה לחקירה וגילויים, לשחרר את האוטומט שאנחנו חיים בו.
          </p>
          <p className="font-body text-sm tracking-wider text-[#9C8E7E] fade-in-up" style={{ animationDelay: '0.3s' }}>
            Contrology · Flystick · כוח · גמישות · ריקוד מודרני · Movement · נשימה · תודעה
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CLASSES — 3 columns, minimal
      ═══════════════════════════════════════ */}
      <section className="section-padding reveal-on-scroll bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-[#9C8E7E] mb-4 fade-in-up">מרחב השיעורים</p>
            <h2 className="font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] font-light text-[#0F0A05] fade-in-up" style={{ animationDelay: '0.1s' }}>
              בחרי את הדרך שלך
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[#E8E2D9]">
            {[
              { emoji: '🌬️', title: 'נשימה', desc: 'חזרה לבסיס. כל שינוי מתחיל בנשימה אחת מודעת.', href: '/videos' },
              { emoji: '🏠', title: 'עשו את זה בבית', desc: 'שיעורים שמותאמים לכל מרחב — בלי ציוד, בלי תירוצים.', href: '/videos' },
              { emoji: '✨', title: 'פיטנס ופלייסטיק', desc: 'כוח, גמישות וזרימה — דרך מקל הפלייסטיק הייחודי.', href: '/videos' },
            ].map((item, i) => (
              <Link
                key={item.title}
                href={item.href}
                className="group block bg-[#FAF8F3] p-10 md:p-14 hover:bg-[#EFE3CC] transition-colors duration-500 fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="text-3xl mb-6">{item.emoji}</div>
                <h3 className="font-heading text-2xl font-light text-[#0F0A05] mb-4 group-hover:text-[#B8935A] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="font-body text-sm leading-7 text-[#5C4D3C]">{item.desc}</p>
                <div className="mt-8 w-0 h-px bg-[#B8935A] group-hover:w-12 transition-all duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          QUOTE — Full width, dark section
      ═══════════════════════════════════════ */}
      <section className="py-28 md:py-40 bg-[#0F0A05] reveal-on-scroll">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <p className="font-heading text-[clamp(1.75rem,4vw,3rem)] font-light text-[#EFE3CC] leading-[1.7] fade-in-up">
            &ldquo;מזמינה אתכם להתאהב בעצמכם מחדש —<br />
            מרחב בטוח להיות בנוכחות,<br />
            ולגלות תוך המסע המטורף<br />
            התעוררות חדשה.&rdquo;
          </p>
          <div className="mt-10 w-8 h-px bg-[#B8935A] mx-auto fade-in-up" style={{ animationDelay: '0.2s' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING — Clean, two cards
      ═══════════════════════════════════════ */}
      <section className="section-padding reveal-on-scroll">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-[#9C8E7E] mb-4 fade-in-up">הצטרפי</p>
            <h2 className="font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] font-light text-[#0F0A05] mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
              7 ימים חינם
            </h2>
            <p className="font-body text-[#5C4D3C] fade-in-up" style={{ animationDelay: '0.15s' }}>
              מעל 300 שיעורים — בקצב שלך, באהבה לגוף שלך.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Package */}
            <div className="border border-[#E8E2D9] p-10 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="font-body text-xs tracking-widest uppercase text-[#9C8E7E] mb-6">חבילה</p>
              <div className="font-heading text-6xl font-light text-[#0F0A05] mb-1">₪200</div>
              <p className="font-body text-sm text-[#9C8E7E] mb-8">5 שיעורים · גישה ל-3 חודשים</p>
              <ul className="space-y-3 mb-10">
                {['5 שיעורים מלאים', 'גישה ל-3 חודשים', 'תמיכה מלאה'].map(f => (
                  <li key={f} className="font-body text-sm text-[#5C4D3C] flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#B8935A] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/packages"
                className="block text-center border border-[#0F0A05] font-body text-sm tracking-wider py-4 hover:bg-[#0F0A05] hover:text-white transition-colors duration-300">
                בחרי חבילה
              </Link>
            </div>

            {/* Monthly */}
            <div className="bg-[#0F0A05] p-10 fade-in-up" style={{ animationDelay: '0.3s' }}>
              <p className="font-body text-xs tracking-widest uppercase text-[#9C8E7E] mb-6">מנוי חודשי</p>
              <div className="font-heading text-6xl font-light text-[#EFE3CC] mb-1">₪99</div>
              <p className="font-body text-sm text-[#9C8E7E] mb-8">לחודש · ביטול בכל עת</p>
              <ul className="space-y-3 mb-10">
                {['גישה לכל השיעורים', 'תוכניות לכל רמה', 'קהילה תומכת'].map(f => (
                  <li key={f} className="font-body text-sm text-[#B8CEBC] flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#B8935A] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className="block text-center bg-[#B8935A] text-[#0F0A05] font-body text-sm tracking-wider py-4 hover:bg-[#EFE3CC] transition-colors duration-300">
                נסי 7 ימים חינם
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT — Minimal, warm
      ═══════════════════════════════════════ */}
      <section className="section-padding reveal-on-scroll border-t border-[#E8E2D9]">
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-[#9C8E7E] mb-6 fade-in-up">צרי קשר</p>
          <h2 className="font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] font-light text-[#0F0A05] mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
            בואי נדבר
          </h2>
          <p className="font-body text-[#5C4D3C] mb-12 fade-in-up" style={{ animationDelay: '0.15s' }}>
            שאלות? רוצה להתחיל? אני כאן.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="mailto:noa@studio-noa.com"
              className="inline-flex items-center justify-center gap-3 border border-[#0F0A05] font-body text-sm tracking-wider px-10 py-4 hover:bg-[#0F0A05] hover:text-white transition-colors duration-300"
            >
              אימייל
            </a>
            <a
              href="https://wa.me/972500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#0F0A05] text-[#FAF8F3] font-body text-sm tracking-wider px-10 py-4 hover:bg-[#B8935A] transition-colors duration-300"
            >
              וואטסאפ
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
