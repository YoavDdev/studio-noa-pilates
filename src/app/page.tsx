'use client'

import { useAuth } from '@/contexts/AuthContext'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import Image from 'next/image'
import { PlayIcon, StarIcon, ClockIcon, CheckIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useEffect } from 'react'

export default function Home() {
  const { user, profile } = useAuth()

  // Scroll-trigger: add .in-view to .reveal-on-scroll when section enters viewport
  useEffect(() => {
    const containers = Array.from(document.querySelectorAll<HTMLElement>('.reveal-on-scroll'))

    if (containers.length === 0) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      containers.forEach((el) => el.classList.add('in-view'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          if (entry.isIntersecting) {
            target.classList.add('in-view')
            observer.unobserve(target)
          }
        })
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    )

    containers.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen image-text-contrast">
      {/* Site-wide Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/img/315649_65c0b7b669363.jpg"
          alt="רקע הסטודיו של נועה"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Soft overlay for readability across the page */}
        <div className="absolute inset-0 bg-white/50"></div>
      </div>
      {/* Hero Section - Personal, inviting, Noa-forward */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        
        {/* Content */}
        <div className="container relative z-10 text-center image-text-contrast">
          <div className="mx-auto">
            <h1 className="heading-xl text-[var(--color-charcoal)] mb-6 fade-in-up" style={{ animationDelay: '0s' }}>
              הסטודיו שלו נועה גורלינק
            </h1>
            <p className="body-lg text-[var(--color-soft-charcoal)] mb-4 fade-in-up" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
              מביאה חיזוק, רכות וריפוי.
            </p>
            <p className="quote-xl quote-accent-strong mb-10 fade-in-up" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
              ״יש לך אותך״
            </p>
            <p className="body-md text-[var(--color-soft-charcoal)] mb-10 fade-in-up" style={{ textAlign: 'center', animationDelay: '0.3s' }}>
              בעלת סטודיו פילאטיס מזרן • פילאטיס לכל הרמות • לנשים בהריון • לאחר לידה • בייבילאטיס • שיטת הפלייסטיק • יוגה האטה • ויניאסה • פאוור ויניאסה
            </p>
            
            {!user ? (
              <div className="space-y-6">
                <Link href="/register" className="btn-primary text-lg px-10 py-4 fade-in-up" style={{ animationDelay: '0.45s' }}>
                  <SparklesIcon className="w-5 h-5" />
                  התחלי 7 ימים חינם
                </Link>
                <p className="body-sm text-[var(--color-soft-charcoal)] opacity-70 fade-in-up" style={{ animationDelay: '0.55s' }}>
                  ללא התחייבות • ביטול בכל עת
                </p>
              </div>
            ) : (
              <div className="card max-w-md mx-auto text-center">
                <h3 className="heading-sm mb-4 text-[var(--color-charcoal)]">שלום {profile?.full_name}!</h3>
                {profile?.subscription_type === 'premium' ? (
                  <p className="body-md text-[var(--color-deep-sage)] mb-4 font-medium">יש לך גישה פרימיום פעילה</p>
                ) : profile?.subscription_type === 'package' && profile?.lessons_remaining ? (
                  <p className="body-md text-[var(--color-deep-sage)] mb-4 font-medium">
                    נותרו לך {profile.lessons_remaining} שיעורים
                  </p>
                ) : (
                  <p className="body-md text-[var(--color-soft-charcoal)] mb-4">גישה חופשית</p>
                )}
                <Link href="/videos" className="btn-primary">
                  <PlayIcon className="w-5 h-5" />
                  המשך לשיעורים
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      

      {/* Our Classes Section - Noa style */}
      <section className="section-padding bg-[var(--color-warm-gray)]/70 reveal-on-scroll">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-[var(--color-charcoal)] mb-6 fade-in-up" style={{ animationDelay: '0s' }}>
              איזה שיעור מתאים לך היום?
            </h2>
            <p className="body-lg text-[var(--color-soft-charcoal)] fade-in-up" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
              אני מזמינה אותך לבחור שיעור על פי התחושה שלך עכשיו — נשימה, רכות, או חיזוק עדין שמחזיר יציבות.
            </p>
            <div className="h-px w-24 bg-[var(--color-soft-terracotta)]/50 mx-auto mt-4 fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Link
              href="/videos"
              className="card block text-center group hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-terracotta)]/40 fade-in-up"
              style={{ animationDelay: '0.25s' }}
            >
              <h3 className="heading-sm mb-3 text-[var(--color-charcoal)] group-hover:underline decoration-[var(--color-warm-terracotta)] underline-offset-4">
                בוקר עדין להתעוררות
              </h3>
              <p className="body-md text-[var(--color-soft-charcoal)]">נשימה רכה ומתיחות עדינות לפתוח את הגוף והלב — להתחיל מחדש.</p>
              <span className="body-sm text-[var(--color-warm-terracotta)] mt-3 inline-block">לחצי כדי לצפות</span>
            </Link>
            <Link
              href="/videos"
              className="card block text-center group md:shadow-lg md:-translate-y-1.5 md:scale-[1.02] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-terracotta)]/40 fade-in-up"
              style={{ animationDelay: '0.35s' }}
            >
              <h3 className="heading-sm mb-3 text-[var(--color-charcoal)] group-hover:underline decoration-[var(--color-warm-terracotta)] underline-offset-4">
                חיזוק רך שמחזיר יציבות
              </h3>
              <p className="body-md text-[var(--color-soft-charcoal)]">תנועה מודעת שמייצבת ומחזקת — בקצב שלך, באהבה לגוף שלך.</p>
              <span className="body-sm text-[var(--color-warm-terracotta)] mt-3 inline-block">לחצי כדי לצפות</span>
            </Link>
            <Link
              href="/videos"
              className="card block text-center group hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm-terracotta)]/40 fade-in-up"
              style={{ animationDelay: '0.45s' }}
            >
              <h3 className="heading-sm mb-3 text-[var(--color-charcoal)] group-hover:underline decoration-[var(--color-warm-terracotta)] underline-offset-4">
                לנשום מחדש בכל רמה
              </h3>
              <p className="body-md text-[var(--color-soft-charcoal)]">מתחילות או מתקדמות — את בוחרת לעצמך, אני כאן להחזיק אותך בדרך.</p>
              <span className="body-sm text-[var(--color-warm-terracotta)] mt-3 inline-block">לחצי כדי לצפות</span>
            </Link>
          </div>
        </div>
      </section>


            {/* For Every Body - Redesigned */}
            <section className="section-padding reveal-on-scroll">
        <div className="container text-center">
          <h2 className="heading-lg text-[var(--color-charcoal)] mb-8 fade-in-up" style={{ animationDelay: '0s' }}>
            לכל גוף
          </h2>
          <p className="body-lg text-[var(--color-soft-charcoal)] mb-12 fade-in-up" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
            זה הרבה מעבר לאימון. זו קהילה רכה ומחזיקה של נשים שבוחרות לנשום, לנוע ולהקשיב לגוף.
            בכל גיל ובכל רמה — את מתקבלת כפי שאת. בכל שבוע אנחנו מתרגלות יחד ומגלות
            כמה תנועה קטנה יכולה לשנות יום שלם — לנפש ולגוף.
          </p>
          <Link href="/register" className="btn-primary text-lg px-10 py-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <HeartIcon className="w-5 h-5" />
            התחלי 7 ימים חינם
          </Link>
        </div>
      </section>

      {/* Meet Your Instructor - Noa style */}
      <section className="section-padding bg-[var(--color-warm-gray)]/70 reveal-on-scroll">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-[var(--color-charcoal)] mb-6 fade-in-up" style={{ animationDelay: '0s' }}>נעים להכיר,</h2>
          </div>

          <div className="card mx-auto fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="fade-in-up" style={{ animationDelay: '0.25s' }}>
                <p className="body-lg text-[var(--color-soft-charcoal)] mb-8 leading-relaxed">
                  אני נועה גורלניק. מאז 2015 אני מלווה נשים בתהליך עדין ומדויק של חיבור לגוף, לרצפה ולנשימה. באימון איתי אין מאבק ואין הוכחות — יש הקשבה, רוך, וחיזוק שמחזיר ביטחון מבפנים. אני מתמחה בפילאטיס מזרן ובגישות שיקומיות מודרניות מתוך הקלאסי (Contrology), ומשלבת עקרונות של פלדנקרייז ונשימה מודעת. הסטודיו פתוח לכל הרמות, לנשים בהריון ולאחר לידה, וגם למי שרוצה להתחיל מחדש — לאט, בחמלה. הפילוסופיה שלי פשוטה: יש לך אותך. האחריות לגוף, לבחירה ולמחשבה — היא שלך, ואני כאן להחזיק מרחב בטוח, אוהב ומאפשר לתנועה שמרפאת.
                </p>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-sm fade-in-up" style={{ animationDelay: '0.35s' }}>
                <Image
                  src="/img/noa_about.jpg"
                  alt="נועה גורלניק"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      <div className="section-divider"></div>
      
      {/* Pricing - Noa style */}
      <section className="section-padding bg-[var(--color-warm-gray)]/70 reveal-on-scroll">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-[var(--color-charcoal)] mb-6 fade-in-up" style={{ animationDelay: '0s' }}>
              7 ימים חינם
            </h2>
            <p className="body-lg text-[var(--color-soft-charcoal)] fade-in-up" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
              מעל 300 שיעורים לנשימה, רכות וחיזוק עדין — בקצב שלך, באהבה לגוף שלך.
            </p>
            <div className="h-px w-24 bg-[var(--color-soft-terracotta)]/50 mx-auto mt-4 fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card fade-in-up" style={{ animationDelay: '0.25s' }}>
              <div className="text-center mb-8">
                <h3 className="heading-sm text-[var(--color-charcoal)] mb-4">חבילת שיעורים</h3>
                <div className="heading-lg text-[var(--color-warm-terracotta)] mb-2">₪200</div>
                <div className="body-md text-[var(--color-soft-charcoal)]">5 שיעורים</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[var(--color-sage)] ml-2 flex-shrink-0" />
                  <span className="body-md text-[var(--color-charcoal)]">5 שיעורים מלאים</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[var(--color-sage)] ml-2 flex-shrink-0" />
                  <span className="body-md text-[var(--color-charcoal)]">גישה למשך 3 חודשים</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[var(--color-sage)] ml-2 flex-shrink-0" />
                  <span className="body-md text-[var(--color-charcoal)]">תמיכה מלאה</span>
                </li>
              </ul>
              <Link href="/packages" className="btn-secondary w-full justify-center">
                התחלי עכשיו
              </Link>
            </div>

            <div className="card border-2 border-[var(--color-warm-terracotta)] relative overflow-hidden fade-in-up" style={{ animationDelay: '0.35s' }}>
              <div className="text-center mb-8">
                <h3 className="heading-sm text-[var(--color-charcoal)] mb-4">מנוי חודשי</h3>
                <div className="heading-lg text-[var(--color-warm-terracotta)] mb-2">₪99</div>
                <div className="body-md text-[var(--color-soft-charcoal)]">לחודש</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[var(--color-sage)] ml-2 flex-shrink-0" />
                  <span className="body-md text-[var(--color-charcoal)]">גישה לכל השיעורים</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[var(--color-sage)] ml-2 flex-shrink-0" />
                  <span className="body-md text-[var(--color-charcoal)]">תוכניות מותאמות לכל רמה</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[var(--color-sage)] ml-2 flex-shrink-0" />
                  <span className="body-md text-[var(--color-charcoal)]">גישה מלאה בקהילה תומכת</span>
                </li>
              </ul>
              <Link href="/register" className="btn-primary w-full justify-center">
                נסי 7 ימים חינם
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="section-divider"></div>

      {/* Contact - Beautiful Form */}
      <section className="section-padding bg-[var(--color-warm-gray)]/70 reveal-on-scroll">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-[var(--color-charcoal)] mb-6 fade-in-up" style={{ animationDelay: '0s' }}>בואי נדבר</h2>
            <p className="body-lg text-[var(--color-soft-charcoal)] leading-relaxed fade-in-up" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
              יש לך שאלות על הפילאטיס? רוצה לדעת איך להתחיל?<br />
              אני כאן בשבילך — בואי ניצור קשר.
            </p>
            <div className="h-px w-24 bg-[var(--color-soft-terracotta)]/50 mx-auto mt-6 fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <div className="card bg-white/90 backdrop-blur-sm shadow-xl fade-in-up" style={{ animationDelay: '0.25s' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const name = (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
                const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || '';
                const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || '';
                const subject = encodeURIComponent(`פניה מהאתר — ${name}`);
                const body = encodeURIComponent(`שם: ${name}\nאימייל: ${email}\n\nהודעה:\n${message}`);
                window.location.href = `mailto:noa@studio-noa-pilates.com?subject=${subject}&body=${body}`;
              }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block body-sm font-medium text-[var(--color-charcoal)]">שם מלא</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    className="input w-full bg-[var(--color-warm-gray)]/40 focus:bg-[var(--color-warm-gray)]/50 border border-[var(--color-warm-gray)]/60 focus:border-[var(--color-warm-terracotta)] text-[var(--color-charcoal)] placeholder:text-[var(--color-soft-charcoal)]/70 focus:ring-2 focus:ring-[var(--color-warm-terracotta)]/30 transition-all duration-200" 
                    placeholder="איך קוראים לך?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block body-sm font-medium text-[var(--color-charcoal)]">אימייל</label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    className="input w-full bg-[var(--color-warm-gray)]/40 focus:bg-[var(--color-warm-gray)]/50 border border-[var(--color-warm-gray)]/60 focus:border-[var(--color-warm-terracotta)] text-[var(--color-charcoal)] placeholder:text-[var(--color-soft-charcoal)]/70 focus:ring-2 focus:ring-[var(--color-warm-terracotta)]/30 transition-all duration-200" 
                    placeholder="your.name@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block body-sm font-medium text-[var(--color-charcoal)]">ההודעה שלך</label>
                <textarea 
                  name="message" 
                  required 
                  rows={6} 
                  className="input w-full min-h-[160px] bg-[var(--color-warm-gray)]/40 focus:bg-[var(--color-warm-gray)]/50 border border-[var(--color-warm-gray)]/60 focus:border-[var(--color-warm-terracotta)] text-[var(--color-charcoal)] placeholder:text-[var(--color-soft-charcoal)]/70 focus:ring-2 focus:ring-[var(--color-warm-terracotta)]/30 transition-all duration-200" 
                  placeholder="ספרי לי קצת על עצמך... מה את מחפשת? יש לך ניסיון קודם בפילאטיס? או כל שאלה אחרת שחשובה לך"
                ></textarea>
                <p className="body-sm text-[var(--color-soft-charcoal)] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-warm-terracotta)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  אני אחזור אליך תוך 24 שעות
                </p>
              </div>

              <div className="border-t border-[var(--color-warm-gray)]/30 pt-8">
                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                  <button 
                    type="submit" 
                    className="btn-primary flex items-center gap-3 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    שלחי הודעה
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-[var(--color-warm-gray)]"></div>
                    <span className="text-[var(--color-soft-charcoal)] body-sm">או</span>
                    <div className="h-px w-8 bg-[var(--color-warm-gray)]"></div>
                  </div>
                  
                  <Link
                    href="https://wa.me/972526123456?text=היי%20נועה,%20אשמח%20לשמוע%20עוד%20על%20השיעורים"
                    target="_blank"
                    className="btn-secondary flex items-center gap-3 px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    וואטסאפ
                  </Link>
                </div>
              </div>
            </form>
          </div>

        </div>
      </section>



    </div>
  )
}
