'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { CheckIcon, StarIcon } from '@heroicons/react/24/outline'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import toast from 'react-hot-toast'

export default function PackagesPage() {
  const { user, profile, updateProfile } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const packages = [
    {
      id: 'lesson-package',
      name: translations.lessonPackage,
      price: '200',
      currency: '₪',
      description: translations.packageDescription,
      features: [
        '5 שיעורי פילאטיס מקצועיים',
        'גישה למשך 3 חודשים',
        'תמיכה טכנית',
        'מעקב אחר התקדמות'
      ],
      popular: false,
      paypalPrice: '50' // $50 USD equivalent
    },
    {
      id: 'premium-monthly',
      name: translations.premiumSubscription,
      price: '99',
      currency: '₪',
      description: translations.premiumDescription,
      features: [
        'גישה בלתי מוגבלת לכל הסרטונים',
        'סרטונים חדשים כל שבוע',
        'שיעורים בשידור חי',
        'קהילת משתמשים',
        'תמיכה מועדפת',
        'הורדה לצפייה אופליין'
      ],
      popular: true,
      paypalPrice: '25' // $25 USD equivalent
    }
  ]

  const handlePayPalSuccess = async (packageId: string) => {
    setLoading(true)
    try {
      // Update user profile based on package
      const updates: Record<string, unknown> = {}
      
      if (packageId === 'lesson-package') {
        updates.subscription_type = 'package'
        updates.lessons_remaining = 5
        // Set expiration to 3 months from now
        const expirationDate = new Date()
        expirationDate.setMonth(expirationDate.getMonth() + 3)
        updates.subscription_expires_at = expirationDate.toISOString()
      } else if (packageId === 'premium-monthly') {
        updates.subscription_type = 'premium'
        // Set expiration to 1 month from now
        const expirationDate = new Date()
        expirationDate.setMonth(expirationDate.getMonth() + 1)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePayPalError = (error: any) => {
    toast.error('שגיאה בתשלום')
    console.error('PayPal error:', error)
    setSelectedPackage(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] section-padding">
        <div className="container text-center">
          <h1 className="heading-lg text-[var(--color-charcoal)] mb-8">
            חבילות ומנויים
          </h1>
          <div className="card">
            <h2 className="text-2xl font-semibold text-[var(--color-charcoal)] mb-4">
              נדרשת התחברות
            </h2>
            <p className="text-[var(--color-soft-charcoal)] mb-6">
              כדי לרכוש חבילות ומנויים, עליך להתחבר תחילה
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="btn-primary"
              >
                {translations.login}
              </Link>
              <Link
                href="/register"
                className="btn-secondary"
              >
                {translations.register}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
      currency: 'USD'
    }}>
      <div className="min-h-screen bg-[var(--color-cream)] section-padding">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-lg text-[var(--color-charcoal)] mb-4">
              חבילות ומנויים
            </h1>
            <p className="body-md text-[var(--color-soft-charcoal)]">
              בחר את החבילה המתאימה לך ותתחיל להתאמן עם נועה
            </p>
          </div>

          {/* Current Subscription Status */}
          {profile && (
            <div className="card mb-8">
              <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-4">
                המנוי הנוכחי שלך
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  {profile.subscription_type === 'premium' ? (
                    <div>
                      <p className="text-[var(--color-deep-sage)] font-semibold">מנוי פרימיום פעיל</p>
                      {profile.subscription_expires_at && (
                        <p className="text-sm text-[var(--color-soft-charcoal)]">
                          פג תוקף: {new Date(profile.subscription_expires_at).toLocaleDateString('he-IL')}
                        </p>
                      )}
                    </div>
                  ) : profile.subscription_type === 'package' && profile.lessons_remaining ? (
                    <div>
                      <p className="text-[var(--color-sage)] font-semibold">
                        חבילת שיעורים - נותרו {profile.lessons_remaining} שיעורים
                      </p>
                      {profile.subscription_expires_at && (
                        <p className="text-sm text-[var(--color-soft-charcoal)]">
                          תוקף עד: {new Date(profile.subscription_expires_at).toLocaleDateString('he-IL')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[var(--color-soft-charcoal)]">גישה חופשית</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Packages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative card overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-[var(--color-deep-sage)]' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-[var(--color-deep-sage)] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow">
                      <StarIcon className="w-4 h-4" />
                      מומלץ
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[var(--color-charcoal)] mb-2">
                    {pkg.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-[var(--color-deep-sage)]">
                      {pkg.price}
                    </span>
                    <span className="text-xl text-[var(--color-soft-charcoal)] mr-1">
                      {pkg.currency}
                    </span>
                    {pkg.id === 'premium-monthly' && (
                      <span className="text-[var(--color-soft-charcoal)]">/חודש</span>
                    )}
                  </div>

                  <p className="text-[var(--color-soft-charcoal)] mb-6">
                    {pkg.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckIcon className="w-5 h-5 text-[var(--color-deep-sage)] flex-shrink-0" />
                        <span className="text-[var(--color-charcoal)]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedPackage === pkg.id ? (
                    <div className="space-y-4">
                      <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [{
                              amount: {
                                value: pkg.paypalPrice,
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
                      <button
                        onClick={() => setSelectedPackage(null)}
                        className="w-full text-[var(--color-soft-charcoal)] hover:text-[var(--color-charcoal)] transition-colors"
                      >
                        ביטול
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPackage(pkg.id)}
                      disabled={loading}
                      className={`w-full rounded-lg font-semibold transition-colors ${
                        pkg.popular
                          ? 'btn-primary'
                          : 'btn-secondary'
                      } disabled:opacity-50 disabled:cursor-not-allowed py-3 px-6`}
                    >
                      {loading ? 'מעבד...' : 'בחר חבילה'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-[var(--color-charcoal)] mb-6 text-center">
              שאלות נפוצות
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[var(--color-charcoal)] mb-2">
                  מה ההבדל בין חבילת השיעורים למנוי הפרימיום?
                </h4>
                <p className="text-[var(--color-soft-charcoal)]">
                  חבילת השיעורים מעניקה גישה ל-5 שיעורים ספציפיים למשך 3 חודשים, 
                  בעוד שהמנוי הפרימיום מעניק גישה בלתי מוגבלת לכל הסרטונים והתכנים החדשים.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-[var(--color-charcoal)] mb-2">
                  האם אוכל לבטל את המנוי בכל עת?
                </h4>
                <p className="text-[var(--color-soft-charcoal)]">
                  כן, תוכל לבטל את המנוי בכל עת דרך הפרופיל שלך. המנוי יישאר פעיל עד לתום התקופה ששולמה.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-[var(--color-charcoal)] mb-2">
                  איך אוכל לצפות בשיעורים?
                </h4>
                <p className="text-[var(--color-soft-charcoal)]">
                  לאחר הרכישה, תוכל לצפות בשיעורים דרך דף הסרטונים באתר, 
                  או להוריד את האפליקציה לצפייה נוחה יותר.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
