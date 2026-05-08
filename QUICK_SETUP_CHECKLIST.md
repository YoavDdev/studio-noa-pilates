# ✅ Checklist מהיר - הקמת Studio Noa Pilates

הדפס את הדף הזה ותסמן V ליד כל משימה שהשלמת!

---

## 📦 **שלב 1: Supabase Setup** (10 דקות)

- [ ] נכנסתי ל-https://supabase.com/dashboard
- [ ] יצרתי Organization חדש: "Studio Noa Pilates"
- [ ] יצרתי Project חדש: `studio-noa-pilates`
- [ ] בחרתי Region: Europe (Frankfurt)
- [ ] שמרתי את Database Password במקום בטוח
- [ ] המתנתי 2-3 דקות עד שהפרויקט מוכן
- [ ] העתקתי את Project URL: `https://_____.supabase.co`
- [ ] העתקתי את anon public key: `eyJhbGc...`

---

## 🔐 **שלב 2: Google OAuth** (15 דקות)

- [ ] נכנסתי ל-https://console.cloud.google.com
- [ ] יצרתי/בחרתי פרויקט Google
- [ ] יצרתי OAuth Client ID (Web application)
- [ ] הוספתי Authorized JavaScript origins:
  - [ ] `http://localhost:3000`
  - [ ] `https://_____.supabase.co`
- [ ] הוספתי Authorized redirect URI:
  - [ ] `https://_____.supabase.co/auth/v1/callback`
- [ ] שמרתי Client ID ו-Client Secret
- [ ] ב-Supabase: Authentication → Providers → Google
- [ ] הפעלתי Google OAuth והדבקתי את ה-credentials
- [ ] שמרתי

---

## 🗄️ **שלב 3: Database Schema** (5 דקות)

- [ ] ב-Supabase: פתחתי SQL Editor
- [ ] העתקתי את `supabase-setup.sql`
- [ ] הרצתי את הסקריפט (Run)
- [ ] ראיתי הודעת הצלחה ✅
- [ ] פתחתי query חדש
- [ ] העתקתי את `supabase-user-management.sql`
- [ ] הרצתי את הסקריפט (Run)
- [ ] ראיתי הודעת הצלחה ✅
- [ ] בדקתי ב-Table Editor שהטבלאות נוצרו

---

## 👤 **שלב 4: יצירת Admin** (3 דקות)

- [ ] הרצתי `npm install` בטרמינל
- [ ] יצרתי קובץ `.env.local` מ-`env.example`
- [ ] מילאתי NEXT_PUBLIC_SUPABASE_URL
- [ ] מילאתי NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] הרצתי `npm run dev`
- [ ] נרשמתי באתר עם המייל של נועה
- [ ] חזרתי ל-Supabase SQL Editor
- [ ] הרצתי:
  ```sql
  UPDATE profiles 
  SET subscription_id = 'Admin', user_type = 'admin'
  WHERE email = 'noa@studionoapilates.com';
  ```
- [ ] התנתקתי והתחברתי שוב
- [ ] נכנסתי ל-`/admin` - עובד! 🎉

---

## 🧪 **שלב 5: בדיקות** (5 דקות)

- [ ] רישום עובד (`/register`)
- [ ] התחברות עובדת (`/login`)
- [ ] Google OAuth עובד
- [ ] Admin Dashboard נגיש (`/admin`)
- [ ] משתמש רגיל לא יכול להיכנס ל-`/admin`
- [ ] התנתקות עובדת

---

## 🎨 **שלב 6: אופציונלי - הגדרות נוספות**

### PayPal (כשתרצו תשלומים)
- [ ] נרשמתי ל-PayPal Developer
- [ ] יצרתי Sandbox App
- [ ] העתקתי Client ID ו-Secret
- [ ] הוספתי ל-.env.local

### Vimeo (כשיהיו סרטונים)
- [ ] נרשמתי ל-Vimeo Developer
- [ ] יצרתי App
- [ ] קיבלתי Access Token
- [ ] הוספתי ל-.env.local

### Resend (כשתרצו מיילים)
- [ ] נרשמתי ל-https://resend.com
- [ ] יצרתי API Key
- [ ] הוספתי ל-.env.local

---

## 🚀 **סיימתי! מה עכשיו?**

אם סימנת V ליד כל הפריטים בשלבים 1-5, **האתר מוכן לעבודה!**

**הצעדים הבאים:**
1. ✅ העלאת סרטוני פילאטיס ל-Vimeo
2. ✅ הוספת משתמשים ראשונים
3. ✅ התאמת עיצוב (צבעים, לוגו)
4. ✅ הגדרת תשלומים
5. ✅ Launch! 🎉

---

**תאריך השלמה:** ___/___/___

**חתימה:** ________________

**הערות:**
_________________________________
_________________________________
_________________________________
