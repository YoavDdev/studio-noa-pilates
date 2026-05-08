# 🚀 מדריך הקמה מלא - Studio Noa Pilates

## 📋 תוכן עניינים
1. [הקמת Supabase](#1-הקמת-supabase)
2. [הגדרת Google OAuth](#2-הגדרת-google-oauth)
3. [הרצת Database Schema](#3-הרצת-database-schema)
4. [יצירת משתמש Admin](#4-יצירת-משתמש-admin)
5. [הגדרת Environment Variables](#5-הגדרת-environment-variables)
6. [הרצת הפרויקט](#6-הרצת-הפרויקט)
7. [בדיקות](#7-בדיקות)

---

## 1️⃣ הקמת Supabase

### שלב 1.1: יצירת Organization
1. היכנס ל-https://supabase.com/dashboard
2. לחץ **"New organization"** (למעלה משמאל)
3. שם: **"Studio Noa Pilates"**
4. לחץ **Create organization**

### שלב 1.2: יצירת Project
1. בתוך ה-Organization, לחץ **"New project"**
2. מלא:
   - **Name:** `studio-noa-pilates`
   - **Database Password:** **שמור סיסמה חזקה!** 🔐
   - **Region:** `Europe (Frankfurt)` (הכי קרוב לישראל)
   - **Pricing Plan:** Free (להתחלה)
3. לחץ **Create new project**
4. ⏳ **המתן 2-3 דקות**

### שלב 1.3: העתקת API Keys
1. לך ל-**Settings** (⚙️ בצד שמאל)
2. לחץ **API**
3. העתק:
   - **Project URL** (למשל: `https://xxxxx.supabase.co`)
   - **anon public** key (מפתח ארוך שמתחיל ב-`eyJhbGc...`)

📝 **שמור את שני הערכים האלה - תצטרך אותם בהמשך!**

---

## 2️⃣ הגדרת Google OAuth

### שלב 2.1: יצירת Google OAuth App
1. היכנס ל-https://console.cloud.google.com
2. צור פרויקט חדש או בחר קיים
3. לך ל-**APIs & Services** → **Credentials**
4. לחץ **Create Credentials** → **OAuth client ID**
5. בחר **Application type:** Web application
6. הוסף:
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
     - `https://xxxxx.supabase.co` (ה-URL של Supabase שלך)
   - **Authorized redirect URIs:**
     - `https://xxxxx.supabase.co/auth/v1/callback`
7. שמור את **Client ID** ו-**Client Secret**

### שלב 2.2: הפעלת Google OAuth ב-Supabase
1. ב-Supabase Dashboard, לך ל-**Authentication** → **Providers**
2. מצא **Google** ולחץ עליו
3. הפעל את **Enable Sign in with Google**
4. הדבק:
   - **Client ID** (מ-Google Console)
   - **Client Secret** (מ-Google Console)
5. לחץ **Save**

✅ **Google OAuth מוכן!**

---

## 3️⃣ הרצת Database Schema

### שלב 3.1: פתיחת SQL Editor
1. ב-Supabase Dashboard, לך ל-**SQL Editor** (בצד שמאל)
2. לחץ **New query**

### שלב 3.2: הרצת הסקריפט הראשון
1. פתח את הקובץ `supabase-setup.sql`
2. העתק את **כל התוכן**
3. הדבק ב-SQL Editor
4. לחץ **Run** (או Ctrl/Cmd + Enter)
5. ✅ אמור להופיע: "Database setup completed successfully! 🎉"

### שלב 3.3: הרצת הסקריפט השני (User Management)
1. פתח קובץ חדש ב-SQL Editor
2. פתח את הקובץ `supabase-user-management.sql`
3. העתק את **כל התוכן**
4. הדבק ב-SQL Editor
5. לחץ **Run**
6. ✅ אמור להופיע: "User Management System Setup Complete!"

### שלב 3.4: בדיקה
1. לך ל-**Table Editor** (בצד שמאל)
2. בדוק שהטבלאות הבאות קיימות:
   - ✅ profiles
   - ✅ videos
   - ✅ user_favorites
   - ✅ user_progress
   - ✅ messages
   - ✅ email_logs
   - ✅ live_events
   - ✅ folder_metadata
   - ✅ categories

---

## 4️⃣ יצירת משתמש Admin

### שלב 4.1: רישום ראשוני
1. הרץ את הפרויקט (נסביר איך בהמשך)
2. היכנס לדף הרישום: `http://localhost:3000/register`
3. הירשם עם המייל של נועה (למשל: `noa@studionoapilates.com`)

### שלב 4.2: הפיכה ל-Admin
1. חזור ל-Supabase Dashboard → **SQL Editor**
2. הרץ את הפקודה הבאה (החלף את המייל!):

```sql
UPDATE profiles 
SET 
  subscription_id = 'Admin',
  user_type = 'admin'
WHERE email = 'noa@studionoapilates.com';
```

3. לחץ **Run**
4. ✅ עכשיו נועה היא Admin!

### שלב 4.3: בדיקה
1. התנתק והתחבר שוב
2. נסה להיכנס ל-`http://localhost:3000/admin`
3. ✅ אמור לעבוד!

---

## 5️⃣ הגדרת Environment Variables

### שלב 5.1: יצירת קובץ .env.local
```bash
# בטרמינל, בתיקיית הפרויקט:
cp env.example .env.local
```

### שלב 5.2: מילוי הערכים
פתח את `.env.local` וערוך:

```bash
# ========================================
# 🔐 Supabase Configuration
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co  # מ-Supabase Dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...             # מ-Supabase Dashboard

# ========================================
# 💳 PayPal Configuration (אופציונלי בהתחלה)
# ========================================
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_MODE=sandbox

# ========================================
# 🎥 Vimeo Configuration (אופציונלי בהתחלה)
# ========================================
VIMEO_ACCESS_TOKEN=your_token
NEXT_PUBLIC_VIMEO_APP_ID=your_app_id

# ========================================
# 📧 Email Configuration (אופציונלי בהתחלה)
# ========================================
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@studionoapilates.com
ADMIN_EMAIL=noa@studionoapilates.com

# ========================================
# 🌐 Site Configuration
# ========================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**חובה למלא עכשיו:**
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY

**אפשר למלא אחר כך:**
- ⏳ PayPal (כשתרצו לבדוק תשלומים)
- ⏳ Vimeo (כשיהיו סרטונים)
- ⏳ Resend (כשתרצו מיילים)

---

## 6️⃣ הרצת הפרויקט

### שלב 6.1: התקנת Dependencies
```bash
npm install
```

### שלב 6.2: הרצה
```bash
npm run dev
```

### שלב 6.3: פתיחת הדפדפן
1. פתח: http://localhost:3000
2. ✅ האתר אמור לעבוד!

---

## 7️⃣ בדיקות

### ✅ בדיקה 1: רישום והתחברות
1. לך ל-`/register`
2. הירשם עם מייל חדש
3. התנתק
4. התחבר שוב ב-`/login`
5. ✅ אמור לעבוד

### ✅ בדיקה 2: Google OAuth
1. לחץ "המשך עם Google" בדף ההתחברות
2. בחר חשבון Google
3. ✅ אמור להתחבר אוטומטית

### ✅ בדיקה 3: Admin Dashboard
1. התחבר עם המשתמש שהפכת ל-Admin
2. לך ל-`/admin`
3. ✅ אמור לראות את לוח הבקרה

### ✅ בדיקה 4: הגנה על דפים
1. התנתק
2. נסה להיכנס ל-`/admin`
3. ✅ אמור להפנות אותך ל-`/login`

---

## 🎯 מה הלאה?

עכשיו שהבסיס עובד, אפשר להמשיך ל:

1. **הוספת סרטונים** - חיבור Vimeo
2. **הגדרת תשלומים** - PayPal Integration
3. **שליחת מיילים** - Resend Setup
4. **עיצוב מותאם אישית** - צבעים ולוגו של נועה

---

## 🆘 פתרון בעיות נפוצות

### בעיה: "Invalid API credentials"
**פתרון:** בדוק ש-NEXT_PUBLIC_SUPABASE_URL ו-NEXT_PUBLIC_SUPABASE_ANON_KEY נכונים

### בעיה: "User not found"
**פתרון:** וודא שהרצת את `supabase-setup.sql` - הטריגר יוצר פרופיל אוטומטית

### בעיה: "Access denied to /admin"
**פתרון:** הרץ את ה-UPDATE query להפיכת המשתמש ל-Admin

### בעיה: Google OAuth לא עובד
**פתרון:** 
1. בדוק שה-Redirect URI ב-Google Console תואם ל-Supabase
2. וודא שהפעלת את Google Provider ב-Supabase

---

## 📞 צריך עזרה?

אם משהו לא עובד, תגיד לי:
1. מה השגיאה המדויקת?
2. באיזה שלב זה קרה?
3. צילום מסך (אם אפשר)

**בהצלחה! 🚀**
