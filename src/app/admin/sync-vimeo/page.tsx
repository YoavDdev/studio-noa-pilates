// Admin - דף סנכרון Vimeo
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SyncVimeoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/sync-vimeo', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="text-purple-600 hover:text-purple-800 mb-4 flex items-center gap-2"
          >
            ← חזרה לדף הניהול
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔄 סנכרון סרטונים מ-Vimeo
          </h1>
          <p className="text-gray-600">
            משוך את כל הסרטונים מ-Vimeo ושמור אותם ב-Database
          </p>
        </div>

        {/* Sync Button */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <button
            onClick={handleSync}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                מסנכרן...
              </span>
            ) : (
              '🚀 התחל סנכרון'
            )}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            הסנכרון עשוי לקחת כמה שניות, תלוי בכמות הסרטונים
          </p>
        </div>

        {/* Results */}
        {result && (
          <div
            className={`rounded-xl shadow-lg p-6 ${
              result.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
            }`}
          >
            {result.success ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">✅</span>
                  <div>
                    <h3 className="text-2xl font-bold text-green-900">
                      הסנכרון הצליח!
                    </h3>
                    <p className="text-green-700">{result.message}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-600">
                      {result.synced}
                    </div>
                    <div className="text-sm text-gray-600">סרטונים סונכרנו</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-3xl font-bold text-red-600">
                      {result.errors}
                    </div>
                    <div className="text-sm text-gray-600">שגיאות</div>
                  </div>
                </div>

                {result.details?.errors?.length > 0 && (
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <h4 className="font-bold text-red-900 mb-2">שגיאות:</h4>
                    <ul className="text-sm space-y-1">
                      {result.details.errors.map((err: any, i: number) => (
                        <li key={i} className="text-red-700">
                          • {err.video}: {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => router.push('/admin/videos')}
                  className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  צפה בסרטונים →
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">❌</span>
                  <div>
                    <h3 className="text-2xl font-bold text-red-900">
                      הסנכרון נכשל
                    </h3>
                    <p className="text-red-700">{result.error}</p>
                  </div>
                </div>
                {result.details && (
                  <pre className="bg-white rounded p-4 text-xs overflow-auto">
                    {result.details}
                  </pre>
                )}
              </>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ מידע חשוב:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• הסנכרון ימשוך את כל הסרטונים מחשבון Vimeo של נועה</li>
            <li>• סרטונים קיימים יתעדכנו, חדשים ייווצרו</li>
            <li>• כל הסרטונים יסומנו כ-"פרימיום" כברירת מחדל</li>
            <li>• אפשר להריץ סנכרון מתי שרוצים - זה בטוח!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
