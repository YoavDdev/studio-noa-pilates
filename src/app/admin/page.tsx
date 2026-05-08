// 👑 Admin Dashboard - דף ניהול ראשי
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';

export default async function AdminDashboard() {
  const adminAccess = await isAdmin();

  if (!adminAccess) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👑 לוח בקרה - מנהל
          </h1>
          <p className="text-gray-600">
            שלום נועה! ברוכה הבאה לממשק הניהול
          </p>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ניהול משתמשים */}
          <Link href="/admin/users">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ניהול משתמשים</h3>
              <p className="text-gray-600 text-sm">
                צפייה בכל המשתמשים, עריכת מנויים, וניהול הרשאות
              </p>
            </div>
          </Link>

          {/* הודעות למשתמשים */}
          <Link href="/admin/messages">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-pink-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">הודעות</h3>
              <p className="text-gray-600 text-sm">
                שליחת הודעות למשתמשים, הכרזות וניהול תקשורת
              </p>
            </div>
          </Link>

          {/* שיעורים חיים */}
          <Link href="/admin/live-events">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-red-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">שיעורים חיים</h3>
              <p className="text-gray-600 text-sm">
                יצירת ושידור שיעורי פילאטיס בזמן אמת
              </p>
            </div>
          </Link>

          {/* סנכרון Vimeo */}
          <Link href="/admin/sync-vimeo">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">סנכרון Vimeo</h3>
              <p className="text-gray-600 text-sm">
                משוך סרטונים מ-Vimeo ושמור ב-Database
              </p>
            </div>
          </Link>

          {/* ניהול תוכן */}
          <Link href="/admin/content">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ניהול תוכן</h3>
              <p className="text-gray-600 text-sm">
                ניהול תיקיות, קטגוריות וסרטונים
              </p>
            </div>
          </Link>

          {/* אנליטיקס */}
          <Link href="/admin/analytics">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">סטטיסטיקות</h3>
              <p className="text-gray-600 text-sm">
                דוחות, אנליטיקס ומעקב אחר מיילים
              </p>
            </div>
          </Link>

          {/* ניוזלטר */}
          <Link href="/admin/newsletter">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-yellow-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ניוזלטר</h3>
              <p className="text-gray-600 text-sm">
                ניהול רשימת תפוצה ושליחת עדכונים
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">סטטיסטיקות מהירות</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">-</div>
              <div className="text-gray-600 text-sm mt-2">סה"כ משתמשים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">-</div>
              <div className="text-gray-600 text-sm mt-2">מנויים פעילים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">-</div>
              <div className="text-gray-600 text-sm mt-2">סרטונים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">-</div>
              <div className="text-gray-600 text-sm mt-2">שיעורים חיים</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
