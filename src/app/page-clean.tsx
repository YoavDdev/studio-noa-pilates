'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

export default function Home() {
  const { user, profile } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            תנועה לכל מצב רוח
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            פילאטיס מקצועי שישנה את הגוף והנפש. גישה למאות שיעורים בכל מקום ובכל זמן
          </p>
          
          {!user ? (
            <div className="space-y-4">
              <Link
                href="/register"
                className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                התחלי 7 ימים חינם
              </Link>
              <p className="text-sm text-gray-500">ללא התחייבות</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">שלום {profile?.full_name}!</h3>
              {profile?.subscription_type === 'premium' ? (
                <p className="text-green-600 mb-4">יש לך גישה פרימיום פעילה</p>
              ) : profile?.subscription_type === 'package' && profile?.lessons_remaining ? (
                <p className="text-blue-600 mb-4">
                  נותרו לך {profile.lessons_remaining} שיעורים
                </p>
              ) : (
                <p className="text-gray-600 mb-4">גישה חופשית</p>
              )}
              <Link
                href="/videos"
                className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors inline-block"
              >
                המשך לשיעורים
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Our Classes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              השיעורים שלנו
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              בין אם את מחפשת מתיחות, אימון בטן, שריפת קלוריות או את כולם יחד - יש לנו שיעור בשבילך
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
              <div className="text-gray-600">רמות עוצמה</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">שבועי</div>
              <div className="text-gray-600">שיעורים חדשים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">300+</div>
              <div className="text-gray-600">אימונים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">15</div>
              <div className="text-gray-600">קטגוריות שיעורים</div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/videos"
              className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              צפי בשיעורים
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Your Instructor */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              הכירי את המדריכה שלך
            </h2>
            <p className="text-xl text-gray-600">
              התחזקי והתארכי עם נועה
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">נועה גורלניק</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  דרך האימון איתי, חברות הסטודיו יכולות לצפות להרגיש חזקות יותר, ארוכות יותר ורזות יותר, 
                  אבל גם משוחררות ממתח פיזי ונפשי. הגישה שלי לבריאות ולרווחה עוסקת ביצירת שינויים מתמשכים 
                  שישרתו אותך על המזרן ומחוצה לו, כך שתוכלי להרגיש כמו הגרסה הטובה ביותר של עצמך!
                </p>
                <Link
                  href="/register"
                  className="inline-block bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors"
                >
                  נסי שיעור של נועה 7 ימים חינם
                </Link>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg">תמונה של נועה</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Every Body */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            לכל גוף
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            יותר מסתם אימון. קהילת הסטודיו משתרעת על פני 118 מדינות עם חברות מכל הגילאים ומכל הרמות במסע הכושר שלהן. 
            כאשר נשאלו, 99% מהחברות דיווחו על השפעה חיובית על הבריאות הנפשית והפיזית שלהן.
          </p>
          <Link
            href="/register"
            className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            התחלי 7 ימים חינם
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              7 ימים חינם
            </h2>
            <p className="text-xl text-gray-600">
              מעל 300 שיעורים שישנו את הגוף, הנפש והביטחון שלך
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">חבילת שיעורים</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">₪200</div>
                <div className="text-gray-600">5 שיעורים</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 ml-2" />
                  <span>5 שיעורים מלאים</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 ml-2" />
                  <span>גישה למשך 3 חודשים</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 ml-2" />
                  <span>תמיכה מלאה</span>
                </li>
              </ul>
              <Link
                href="/packages"
                className="block w-full bg-gray-900 text-white text-center py-3 font-semibold hover:bg-gray-800 transition-colors"
              >
                התחלי עכשיו
              </Link>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-gray-900">
              <div className="text-center mb-6">
                <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                  הכי משתלם: חסכי 60%
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">מנוי חודשי</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">₪99</div>
                <div className="text-gray-600">לחודש</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 ml-2" />
                  <span>גישה לכל השיעורים</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 ml-2" />
                  <span>שיעורים חדשים כל שבוע</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 ml-2" />
                  <span>אתגרים חודשיים</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 ml-2" />
                  <span>תמיכה מלאה</span>
                </li>
              </ul>
              <Link
                href="/packages"
                className="block w-full bg-gray-900 text-white text-center py-3 font-semibold hover:bg-gray-800 transition-colors"
              >
                התחלי 7 ימים חינם
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-600 mb-4">
                  &quot;למרות שאת יכולה להרגיש את השריפה למחרת, אלה לא סוג האימונים שתשנאי או תפחדי מהם. 
                  במקום זאת, הם מזמינים אותך להתחבר לגוף ולנשימה שלך.&quot;
                </p>
                <div className="font-semibold text-gray-900">מארי קלייר</div>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-600 mb-4">
                  &quot;תמיד הייתי אדם פעיל והתאמנתי כל חיי, אבל הגוף שלי השתנה לטובה לחלוטין 
                  ברגע שהתחלתי להתאמן עם נועה.&quot;
                </p>
                <div className="font-semibold text-gray-900">נטשה אוקלי</div>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-600 mb-4">
                  &quot;הפילאטיס של נועה הוא הדבר הטוב ביותר שקרה לי השנה. השיעורים שלה מאתגרים אבל נגישים, 
                  והיא מצליחה ליצור תחושה של קהילה גם באימונים הוירטואליים.&quot;
                </p>
                <div className="font-semibold text-gray-900">גופ</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              התחלי את ה-7 ימים החינם שלך עכשיו
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            הישארי מעודכנת
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            היי הראשונה לדעת על שיעורים חדשים, מדריכות חדשות, אירועים מיוחדים ועוד
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://www.instagram.com/studio_noa_pilates/"
              target="_blank"
              className="text-gray-300 hover:text-white transition-colors"
            >
              עקבי באינסטגרם
            </Link>
            <Link
              href="/register"
              className="bg-white text-gray-900 px-6 py-3 font-semibold hover:bg-gray-100 transition-colors"
            >
              הורידי את האפליקציה
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
