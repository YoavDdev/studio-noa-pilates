'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { CheckIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import toast from 'react-hot-toast'

export default function PackagesPage() {
  const { user, profile, updateProfile } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const isPayPalConfigured = paypalClientId && paypalClientId !== 'your_paypal_client_id_here' && paypalClientId !== 'test'

  const packages = [
    {
      id: 'free',
      name: 'גישה חופשית',
      price: '0',
      currency: '₪',
      period: '',
      description: 'התנסות ראשונית בסטודיו',
      features: [
        'גישה לשיעורים נבחרים',
        'תצוגה מקדימה של תוכן',
        'מעקב בסיסי',
      ],
      popular: false,
      icon: SparklesIcon,
      badge: null,
      paypalPrice: null,
      isFree: true
    },
    {
      id: 'premium-monthly',
      name: 'מנוי חודשי',
      price: '99',
      currency: '₪',
      period: 'לחודש',
      description: 'גמישות מלאה',
      features: [
        'גישה בלתי מוגבלת לכל הסרטונים',
        'סרטונים חדשים כל שבוע',
        'שיעורים בהתאמה אישית',
        'קהילה פרטית',
        'תמיכה מועדפת',
      ],
      popular: true,
      icon: TrophyIcon,
      badge: 'הכי פופולרי',
      paypalPrice: '25'
    },
    {
      id: 'premium-yearly',
      name: 'מנוי שנתי',
      price: '990',
      originalPrice: '1,188',
      currency: '₪',
      period: 'לשנה',
      description: 'חסכון של 17%',
      features: [
        'כל היתרונות של המנוי החודשי',
        'חסכון של 198 ₪ בשנה',
        'עדיפות בהרשמה לאירועים',
        'תוכן בלעדי לחברי שנתי',
        'אפשרות להקפאת מנוי',
      ],
      popular: false,
      icon: TrophyIcon,
      badge: 'המבצע הטוב ביותר',
      paypalPrice: '250'
    }
  ]

  const handlePayPalSuccess = async (packageId: string) => {
    setLoading(true)
    try {
      const updates: Record<string, unknown> = {}
      
      if (packageId === 'premium-monthly') {
        updates.subscription_type = 'premium'
        const expirationDate = new Date()
        expirationDate.setMonth(expirationDate.getMonth() + 1)
        updates.subscription_expires_at = expirationDate.toISOString()
      } else if (packageId === 'premium-yearly') {
        updates.subscription_type = 'premium'
        const expirationDate = new Date()
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
        updates.subscription_expires_at = expirationDate.toISOString()
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateProfile(updates as any)
      toast.success('הרכישה הושלמה בהצלחה! 🎉')
      setSelectedPackage(null)
    } catch (error) {
      toast.error('שגיאה בעדכון המנוי')
      console.error('Error updating subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFreeAccess = async () => {
    if (!profile) return
    setLoading(true)
    try {
      const updates = {
        subscription_type: 'free'
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateProfile(updates as any)
      toast.success('עברת לגישה חופשית')
    } catch (error) {
      toast.error('שגיאה בעדכון')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePayPalError = (error: any) => {
    toast.error('שגיאה בתשלום')
    console.error('PayPal error:', error)
    setSelectedPackage(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading text-5xl md:text-6xl font-light mb-6">
            חבילות ומנויים
          </h1>
          <div className="bg-white border border-[var(--color-border)] p-12 mt-12">
            <h2 className="font-heading text-2xl font-light mb-4">
              נדרשת התחברות
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] mb-8">
              כדי לרכוש חבילות ומנויים, עליך להתחבר תחילה
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="font-body px-8 py-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                התחברות
              </Link>
              <Link
                href="/register"
                className="font-body px-8 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors"
              >
                הרשמה
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const PageContent = (
      <div className="min-h-screen bg-[var(--color-background)] py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-5xl md:text-7xl font-light mb-6">
              חבילות ומנויים
            </h1>
            <p className="font-body text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              בחרי את החבילה המתאימה לך והתחילי את המסע שלך עם נועה
            </p>
            {!isPayPalConfigured && (
              <div className="mt-8 max-w-2xl mx-auto bg-[#EFE3CC] border border-[var(--color-primary)] p-6">
                <p className="font-body text-sm text-[var(--color-text-primary)]">
                  💳 <strong>שימי לב:</strong> מערכת התשלומים האוטומטית עדיין בהקמה. לרכישת מנוי, צרי קשר ישירות.
                </p>
              </div>
            )}
          </div>

          {/* Current Subscription Status */}
          {profile && (
            <div className="bg-white border border-[var(--color-border)] p-8 mb-12 max-w-3xl mx-auto">
              <h3 className="font-heading text-lg font-medium mb-4 text-[var(--color-text-primary)]">
                המנוי הנוכחי שלך
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  {profile.subscription_type === 'premium' ? (
                    <div>
                      <p className="font-medium text-[var(--color-sage)]">מנוי פרימיום פעיל</p>
                      {profile.subscription_expires_at && (
                        <p className="text-sm text-[var(--color-text-muted)]">
                          תוקף עד: {new Date(profile.subscription_expires_at).toLocaleDateString('he-IL')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[var(--color-text-secondary)]">גישה חופשית</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-20 max-w-6xl mx-auto border border-[var(--color-border)]">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon
              return (
                <div
                  key={pkg.id}
                  className={`relative p-10 ${
                    pkg.popular ? 'bg-[#0F0A05] text-white md:-mt-8 md:mb-0 md:py-16 z-10' : 'bg-white'
                  } ${
                    index < packages.length - 1 ? 'md:border-l border-[var(--color-border)]' : ''
                  }`}
                >
                  {pkg.badge && (
                    <div className="text-center mb-6">
                      <span className={`font-body inline-block px-4 py-1 text-xs tracking-widest uppercase ${
                        pkg.popular ? 'bg-[var(--color-primary)] text-[var(--color-black)]' : 'border border-[var(--color-primary)] text-[var(--color-primary)]'
                      }`}>
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <Icon className={`w-12 h-12 mx-auto mb-6 ${pkg.popular ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`} />
                    <h3 className={`font-heading text-2xl font-light mb-4 ${pkg.popular ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>
                      {pkg.name}
                    </h3>
                    
                    <div className="mb-3">
                      {pkg.originalPrice && (
                        <div className={`text-sm line-through mb-1 ${pkg.popular ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>
                          {pkg.originalPrice} {pkg.currency}
                        </div>
                      )}
                      <div>
                        <span className={`font-heading text-5xl font-light ${pkg.popular ? 'text-[#B8935A]' : 'text-[var(--color-primary)]'}`}>
                          {pkg.price}
                        </span>
                        <span className={`text-xl mr-1 ${pkg.popular ? 'text-white' : 'text-[var(--color-text-secondary)]'}`}>
                          {pkg.currency}
                        </span>
                      </div>
                      {pkg.period && (
                        <div className={`text-sm mt-1 ${pkg.popular ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
                          {pkg.period}
                        </div>
                      )}
                    </div>

                    <p className={`font-body text-sm mb-8 ${pkg.popular ? 'text-white/80' : 'text-[var(--color-text-secondary)]'}`}>
                      {pkg.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pkg.popular ? 'text-[var(--color-primary)]' : 'text-[var(--color-sage)]'}`} />
                        <span className={`font-body text-sm leading-relaxed ${pkg.popular ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {pkg.isFree ? (
                    <button
                      onClick={handleFreeAccess}
                      disabled={loading || profile?.subscription_type === 'free'}
                      className={`font-body w-full py-4 border transition-colors ${
                        pkg.popular 
                          ? 'border-white text-white hover:bg-white hover:text-[var(--color-black)]' 
                          : 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {profile?.subscription_type === 'free' ? 'המנוי הנוכחי שלך' : 'התחילי חינם'}
                    </button>
                  ) : selectedPackage === pkg.id ? (
                    <div className="space-y-4">
                      {isPayPalConfigured ? (
                        <PayPalButtons
                          style={{ layout: 'vertical' }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              intent: 'CAPTURE',
                              purchase_units: [{
                                amount: {
                                  value: pkg.paypalPrice || '0',
                                  currency_code: 'USD'
                                },
                                description: pkg.name
                              }]
                            })
                          }}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onApprove={(data: unknown, actions: any) => {
                            return actions.order.capture().then(() => {
                              handlePayPalSuccess(pkg.id)
                            })
                          }}
                          onError={handlePayPalError}
                          disabled={loading}
                        />
                      ) : (
                        <div className={`text-center p-6 border ${pkg.popular ? 'border-white/20' : 'border-[var(--color-border)]'}`}>
                          <p className={`text-sm mb-3 ${pkg.popular ? 'text-white' : 'text-[var(--color-text-secondary)]'}`}>
                            מערכת התשלומים בהקמה
                          </p>
                          <p className={`text-xs ${pkg.popular ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
                            בינתיים צרי קשר לרכישת מנוי
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedPackage(null)}
                        className={`w-full text-sm ${pkg.popular ? 'text-white hover:text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'} transition-colors font-body`}
                      >
                        ביטול
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPackage(pkg.id)}
                      disabled={loading}
                      className={`font-body w-full py-4 transition-colors ${
                        pkg.popular
                          ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                          : 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? 'מעבד...' : 'בחרי חבילה'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="bg-white border border-[var(--color-border)] p-12 max-w-4xl mx-auto">
            <h3 className="font-heading text-3xl font-light mb-12 text-center text-[var(--color-text-primary)]">
              שאלות נפוצות
            </h3>
            
            <div className="space-y-8">
              <div className="pb-6 border-b border-[var(--color-border)]">
                <h4 className="font-heading text-lg font-medium mb-3 text-[var(--color-text-primary)]">
                  מה ההבדל בין המנוי החודשי לשנתי?
                </h4>
                <p className="font-body leading-relaxed text-[var(--color-text-secondary)]">
                  המנוי החודשי מספק גמישות מלאה ללא התחייבות ארוכת טווח, בעוד המנוי השנתי מציע חיסכון של 17% ויתרונות נוספים כמו עדיפות בהרשמה לאירועים ותוכן בלעדי.
                </p>
              </div>
              
              <div className="pb-6 border-b border-[var(--color-border)]">
                <h4 className="font-heading text-lg font-medium mb-3 text-[var(--color-text-primary)]">
                  האם ניתן לבטל את המנוי בכל עת?
                </h4>
                <p className="font-body leading-relaxed text-[var(--color-text-secondary)]">
                  כן, ניתן לבטל את המנוי בכל עת דרך הפרופיל שלך. המנוי יישאר פעיל עד לתום התקופה ששולמה.
                </p>
              </div>
              
              <div className="pb-6 border-b border-[var(--color-border)]">
                <h4 className="font-heading text-lg font-medium mb-3 text-[var(--color-text-primary)]">
                  איך מתחילים לצפות בשיעורים?
                </h4>
                <p className="font-body leading-relaxed text-[var(--color-text-secondary)]">
                  לאחר רכישת המנוי, תקבלי גישה מיידית לכל הסרטונים באתר. פשוט היכנסי לחשבון שלך וצפי בכל שיעור שתרצי, בכל זמן שנוח לך.
                </p>
              </div>

              <div>
                <h4 className="font-heading text-lg font-medium mb-3 text-[var(--color-text-primary)]">
                  מה כולל המנוי החינמי?
                </h4>
                <p className="font-body leading-relaxed text-[var(--color-text-secondary)]">
                  המנוי החינמי מאפשר לך להתנסות בסטודיו עם גישה לשיעורים נבחרים ותצוגה מקדימה של התוכן. זו דרך נהדרת להכיר את הסטודיו לפני ההתחייבות.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 pb-12">
            <h3 className="font-heading text-3xl font-light mb-4 text-[var(--color-text-primary)]">
              מוכנה להתחיל?
            </h3>
            <p className="font-body text-lg mb-8 max-w-2xl mx-auto text-[var(--color-text-secondary)]">
              הצטרפי אלינו והתחילי את המסע שלך לגוף חזק ובריא
            </p>
            <Link
              href="/videos"
              className="font-body inline-block px-12 py-4 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              לספריית השיעורים
            </Link>
          </div>
        </div>
      </div>
  )

  return isPayPalConfigured ? (
    <PayPalScriptProvider options={{ 
      clientId: paypalClientId!,
      currency: 'USD'
    }}>
      {PageContent}
    </PayPalScriptProvider>
  ) : (
    PageContent
  )
}
