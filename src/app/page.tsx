'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import HomepageFolders from '@/components/HomepageFolders'

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
    <main className="min-h-screen bg-[#FDFCFA] text-[#2A2520]">

      {/* ═══════════════════════════════════════
          HERO — Editorial split layout
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[calc(100svh-4.5rem)] md:min-h-screen grid md:grid-cols-2">

        {/* Right: Text */}
        <div className="flex flex-col justify-center px-6 sm:px-8 md:px-16 lg:px-24 py-12 sm:py-24 md:py-0 order-2 md:order-1">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-[#A39888] mb-8 fade-in-up" style={{ animationDelay: '0s' }}>
            מורה לתנועה ונשימה
          </p>
          <h1 className="font-heading text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] text-[#1A1410] mb-6 md:mb-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
            נועה<br />גורלניק
          </h1>
          <div className="w-12 h-px bg-[#C9A871] mb-8 fade-in-up" style={{ animationDelay: '0.2s' }} />
          <p className="font-heading text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-[#5C4D3C] mb-8 md:mb-10 max-w-md fade-in-up" style={{ animationDelay: '0.25s' }}>
            תנועה היא שפה.<br />
            גופנו הוא בית מקדש —<br />
            מרחב בטוח לגלות, לחקור, להתעורר.
          </p>
          {!user ? (
            <div className="flex flex-wrap gap-4 fade-in-up" style={{ animationDelay: '0.35s' }}>
              <Link href="/register"
                className="inline-flex items-center justify-center gap-3 bg-[#1A1410] text-[#FDFCFA] font-body text-sm tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 hover:bg-[#C9A871] transition-colors duration-300 flex-1 sm:flex-initial">
                התחילי מסע
              </Link>
              <Link href="/videos"
                className="inline-flex items-center justify-center gap-3 border border-[#EBE5DC] text-[#2A2520] font-body text-sm tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 hover:border-[#C9A871] hover:text-[#C9A871] transition-colors duration-300 flex-1 sm:flex-initial">
                לספריית השיעורים
              </Link>
            </div>
          ) : (
            <div className="fade-in-up" style={{ animationDelay: '0.35s' }}>
              <p className="font-body text-[#5C4D3C] mb-4">
                שלום {profile?.full_name?.split(' ')[0]} —
                {profile?.subscription_id?.startsWith('I-') || profile?.user_type === 'premium' ? ' המנוי שלך פעיל' : ' ברוכה הבאה'}
              </p>
              <Link href="/videos"
                className="inline-flex items-center gap-3 bg-[#1A1410] text-[#FDFCFA] font-body text-sm tracking-wider px-8 py-4 hover:bg-[#C9A871] transition-colors duration-300">
                המשיכי לתרגל
              </Link>
            </div>
          )}
        </div>

        {/* Left: Image */}
        <div className="relative min-h-[40vh] sm:min-h-[50vh] md:min-h-screen order-1 md:order-2 overflow-hidden">
          <Image
            src="/img/noa_guralnik_main.jpg"
            alt="נועה גורלניק - פילאטיס ותנועה"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFCFA]/30" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[#A39888] opacity-60 hidden md:flex">
          <div className="w-px h-12 bg-[#A39888] animate-pulse" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT — Centered, poetic
      ═══════════════════════════════════════ */}
      <section className="section-padding reveal-on-scroll border-t border-[#EBE5DC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-12 text-center">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-[#A39888] mb-10 fade-in-up" style={{ animationDelay: '0s' }}>
            קצת עלי
          </p>
          <h2 className="font-heading text-[clamp(2rem,5vw,4rem)] font-light text-[#1A1410] mb-8 md:mb-10 fade-in-up" style={{ animationDelay: '0.1s' }}>
            נעים להכיר
          </h2>
          <div className="w-8 h-px bg-[#C9A871] mx-auto mb-10 fade-in-up" style={{ animationDelay: '0.15s' }} />
          <p className="font-heading text-lg md:text-xl font-light leading-[2] text-[#5C4D3C] mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
            אמא לשניים, בת 34, חיה את עולם התנועה מגיל 4.
          </p>
          <p className="font-body text-base leading-8 text-[#5C4D3C] mb-8 fade-in-up" style={{ animationDelay: '0.25s' }}>
            מ-2015 נכנסתי להדריך אינספור אנשים ולטפל ממקום של הקשבה, הנאה ולא מאבק —
            ליצור חיבור של הרמוניה, אהבה וריפוי.
            יציאה לחקירה וגילויים, לשחרר את האוטומט שאנחנו חיים בו.
          </p>
          <p className="font-body text-sm tracking-wider text-[#A39888] fade-in-up" style={{ animationDelay: '0.3s' }}>
            Contrology · Flystick · כוח · גמישות · ריקוד מודרני · Movement · נשימה · תודעה
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CLASSES — Dynamic folders from Vimeo
      ═══════════════════════════════════════ */}
      <HomepageFolders />

      {/* ═══════════════════════════════════════
          QUOTE — Full width, dark section
      ═══════════════════════════════════════ */}
      <section className="py-16 sm:py-28 md:py-40 bg-[#1A1410] reveal-on-scroll">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-12 text-center">
          <p className="font-heading text-[clamp(1.25rem,4vw,3rem)] font-light text-[#F5EFE6] leading-[1.7] fade-in-up">
            &ldquo;מזמינה אתכם להתאהב בעצמכם מחדש —<br />
            מרחב בטוח להיות בנוכחות,<br />
            ולגלות תוך המסע המטורף<br />
            התעוררות חדשה.&rdquo;
          </p>
          <div className="mt-10 w-8 h-px bg-[#C9A871] mx-auto fade-in-up" style={{ animationDelay: '0.2s' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING — Clean, two cards
      ═══════════════════════════════════════ */}
      <section className="section-padding reveal-on-scroll">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-[#A39888] mb-4 fade-in-up">הצטרפי</p>
            <h2 className="font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] font-light text-[#1A1410] mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
              בחרי את המנוי שלך
            </h2>
            <p className="font-body text-[#5C4D3C] fade-in-up" style={{ animationDelay: '0.15s' }}>
              גישה בלתי מוגבלת לכל השיעורים — ביטול בכל עת.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly */}
            <div className="border border-[#EBE5DC] p-6 sm:p-10 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="font-body text-xs tracking-widest uppercase text-[#A39888] mb-6">מנוי חודשי</p>
              <div className="font-heading text-5xl sm:text-6xl font-light text-[#1A1410] mb-1">₪99</div>
              <p className="font-body text-sm text-[#A39888] mb-8">לחודש · ביטול בכל עת</p>
              <ul className="space-y-3 mb-10">
                {['גישה לכל השיעורים', 'סרטונים חדשים כל שבוע', 'ביטול בכל עת'].map(f => (
                  <li key={f} className="font-body text-sm text-[#5C4D3C] flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#C9A871] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/packages"
                className="block text-center border border-[#1A1410] font-body text-sm tracking-wider py-4 hover:bg-[#1A1410] hover:text-white transition-colors duration-300">
                הצטרפי עכשיו
              </Link>
            </div>

            {/* Yearly */}
            <div className="bg-[#1A1410] p-6 sm:p-10 fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-6">
                <p className="font-body text-xs tracking-widest uppercase text-[#A39888]">מנוי שנתי</p>
                <span className="font-body text-xs bg-[#C9A871] text-[#1A1410] px-2 py-0.5">חסכון 17%</span>
              </div>
              <div className="font-heading text-5xl sm:text-6xl font-light text-[#F5EFE6] mb-1">₪990</div>
              <p className="font-body text-sm text-[#A39888] mb-8">לשנה · במקום ₪1,188</p>
              <ul className="space-y-3 mb-10">
                {['כל יתרונות המנוי החודשי', 'חסכון של ₪198 בשנה', 'עדיפות בהרשמה לאירועים'].map(f => (
                  <li key={f} className="font-body text-sm text-[#B8CEBC] flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#C9A871] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/packages"
                className="block text-center bg-[#C9A871] text-[#1A1410] font-body text-sm tracking-wider py-4 hover:bg-[#F5EFE6] transition-colors duration-300">
                הצטרפי ושמרי
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT — Minimal, warm
      ═══════════════════════════════════════ */}
      <section className="section-padding reveal-on-scroll border-t border-[#EBE5DC]">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 md:px-12 text-center">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-[#A39888] mb-6 fade-in-up">צרי קשר</p>
          <h2 className="font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] font-light text-[#1A1410] mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
            בואי נדבר
          </h2>
          <p className="font-body text-[#5C4D3C] mb-12 fade-in-up" style={{ animationDelay: '0.15s' }}>
            שאלות? רוצה להתחיל? אני כאן.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="mailto:noa@studio-noa.com"
              className="inline-flex items-center justify-center gap-3 border border-[#1A1410] font-body text-sm tracking-wider px-10 py-4 hover:bg-[#1A1410] hover:text-white transition-colors duration-300"
            >
              אימייל
            </a>
            <a
              href="https://wa.me/972500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#1A1410] text-[#FDFCFA] font-body text-sm tracking-wider px-10 py-4 hover:bg-[#C9A871] transition-colors duration-300"
            >
              וואטסאפ
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
