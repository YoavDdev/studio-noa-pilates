# 🔐 הגדרת Google OAuth ב-Supabase

## שלב 1: הגדרת Google Cloud Console

1. **כנס ל-Google Cloud Console:**
   - לך ל: https://console.cloud.google.com/

2. **צור פרויקט חדש (או בחר קיים):**
   - לחץ על "Select a project" בראש הדף
   - לחץ על "NEW PROJECT"
   - תן שם לפרויקט: `Studio Noa Pilates`
   - לחץ "CREATE"

3. **הפעל את Google+ API:**
   - בתפריט צד, לך ל: **APIs & Services** → **Library**
   - חפש: `Google+ API`
   - לחץ עליו ולחץ **ENABLE**

4. **צור OAuth 2.0 Credentials:**
   - לך ל: **APIs & Services** → **Credentials**
   - לחץ **CREATE CREDENTIALS** → **OAuth client ID**
   
5. **הגדר OAuth consent screen (אם נדרש):**
   - בחר **External**
   - מלא את הפרטים:
     - App name: `Studio Noa Pilates`
     - User support email: `guralnikn@gmail.com`
     - Developer contact: `guralnikn@gmail.com`
   - לחץ **SAVE AND CONTINUE**
   - דלג על Scopes (לחץ **SAVE AND CONTINUE**)
   - הוסף Test users אם צריך
   - לחץ **SAVE AND CONTINUE**

6. **צור OAuth Client ID:**
   - Application type: **Web application**
   - Name: `Studio Noa Pilates Web`
   - **Authorized redirect URIs** - הוסף:
     ```
     https://yqobrqxzlgjwraytokgd.supabase.co/auth/v1/callback
     ```
   - לחץ **CREATE**

7. **שמור את הפרטים:**
   - תקבל **Client ID** ו-**Client Secret**
   - שמור אותם ב-`.env.local` - תצטרך אותם בשלב הבא!

---

## שלב 2: הגדרת Supabase

1. **כנס ל-Supabase Dashboard:**
   - לך ל: https://supabase.com/dashboard
   - בחר את הפרויקט שלך

2. **הגדר Google Provider:**
   - לך ל: **Authentication** → **Providers**
   - מצא את **Google** ברשימה
   - לחץ עליו

3. **הפעל את Google OAuth:**
   - **Enable Sign in with Google** - הפעל
   - **Client ID** - הדבק את ה-Client ID מ-Google
   - **Client Secret** - הדבק את ה-Client Secret מ-Google
   - לחץ **SAVE**

---

## שלב 3: הגדרת Site URL (חשוב!)

1. **בחזרה ל-Supabase Dashboard:**
   - לך ל: **Authentication** → **URL Configuration**

2. **הגדר Site URL:**
   - **Site URL**: 
     - Development: `http://localhost:3000`
     - Production: `https://studionoapilates.com` (או הדומיין שלך)

3. **הגדר Redirect URLs:**
   - **Redirect URLs** - הוסף:
     ```
     http://localhost:3000/auth/callback
     https://studionoapilates.com/auth/callback
     ```

4. **שמור את השינויים**

---

## שלב 4: בדיקה

1. **הפעל את האפליקציה:**
   ```bash
   npm run dev
   ```

2. **נסה להתחבר:**
   - לך ל: http://localhost:3000/login
   - לחץ על "התחבר עם Google"
   - בחר חשבון Google
   - אשר את ההרשאות

3. **אם הכל עובד:**
   - תועבר ל-`/videos`
   - תראה את הפרופיל שלך
   - ✅ Google OAuth עובד!

---

## 🐛 פתרון בעיות נפוצות

### שגיאה: "redirect_uri_mismatch"
- **פתרון:** ודא שה-Redirect URI ב-Google Cloud Console תואם בדיוק ל-Supabase callback URL
- צריך להיות: `https://yqobrqxzlgjwraytokgd.supabase.co/auth/v1/callback`

### שגיאה: "Access blocked: This app's request is invalid"
- **פתרון:** ודא שהפעלת את Google+ API ב-Google Cloud Console

### המשתמש לא נוצר ב-Database
- **פתרון:** ודא שיש לך trigger ב-Supabase שיוצר profile אוטומטית
- בדוק ב: `supabase-user-management.sql`

### לא מועבר אחרי התחברות
- **פתרון:** ודא שה-callback route קיים ב: `/src/app/auth/callback/route.ts`

---

## 📝 הערות חשובות

1. **Development vs Production:**
   - בפיתוח: השתמש ב-`http://localhost:3000`
   - בפרודקשן: עדכן את כל ה-URLs לדומיין האמיתי

2. **Email Verification:**
   - משתמשים שנרשמים דרך Google לא צריכים אימות email
   - ה-email שלהם כבר מאומת על ידי Google

3. **Profile Creation:**
   - ה-profile נוצר אוטומטית ב-database trigger
   - ה-`full_name` מגיע מ-Google

4. **Security:**
   - אל תשתף את ה-Client Secret
   - שמור אותו ב-`.env.local` (לא ב-git!)

---

## ✅ Checklist

- [ ] יצרתי פרויקט ב-Google Cloud Console
- [ ] הפעלתי Google+ API
- [ ] יצרתי OAuth Client ID
- [ ] הוספתי את ה-Redirect URI הנכון
- [ ] הגדרתי את Google Provider ב-Supabase
- [ ] הגדרתי Site URL ו-Redirect URLs ב-Supabase
- [ ] בדקתי שההתחברות עובדת
- [ ] הפרופיל נוצר אוטומטית ב-database

---

**עודכן:** מאי 2026  
**סטטוס:** ✅ מוכן לשימוש
