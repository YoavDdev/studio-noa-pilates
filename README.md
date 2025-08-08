# סטודיו נועה פילאטיס 🧘‍♀️

אתר מנויים ושיעורי פילאטיס מקצועיים עם נועה גורליק

## תכונות עיקריות

- ✅ **אימות משתמשים** - התחברות והרשמה עם Supabase
- ✅ **ספריית וידאו** - סרטונים מסווגים לפי רמת קושי, אזור מיקוד וסגנון
- ✅ **מערכת מנויים** - חבילות שיעורים ומנוי פרימיום
- ✅ **תשלומים** - אינטגרציה עם PayPal
- ✅ **ממשק בעברית** - תמיכה מלאה ב-RTL
- ✅ **עיצוב רספונסיבי** - מותאם לכל המכשירים
- ✅ **מועדפים ומעקב התקדמות** - תכונות אישיות למשתמשים

## טכנולוגיות

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Payments**: PayPal
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## הגדרה מקומית

### 1. שכפול הפרויקט
```bash
git clone <repository-url>
cd studio-noa-pilates
```

### 2. התקנת תלויות
```bash
npm install --legacy-peer-deps
```

### 3. הגדרת משתני סביבה
צור קובץ `.env.local` בתיקיית הפרויקט:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 4. הגדרת Supabase

#### יצירת טבלאות
הרץ את השאילתות הבאות ב-Supabase SQL Editor:

```sql
-- טבלת פרופילי משתמשים
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_type TEXT CHECK (subscription_type IN ('free', 'premium', 'package')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  lessons_remaining INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת סרטונים
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  focus_area TEXT NOT NULL,
  style TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת מועדפים
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  video_id UUID REFERENCES videos ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- טבלת התקדמות
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  video_id UUID REFERENCES videos ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  watch_time INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- הפעלת RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- מדיניות אבטחה
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view videos" ON videos FOR SELECT TO authenticated, anon USING (true);
```

### 5. הגדרת PayPal
1. צור חשבון PayPal Developer
2. צור אפליקציה חדשה
3. העתק את ה-Client ID ל-.env.local

### 6. הרצת השרת
```bash
npm run dev
```

האתר יהיה זמין ב: [http://localhost:3000](http://localhost:3000)

## מבנה הפרויקט

```
src/
├── app/                    # דפי האפליקציה (App Router)
│   ├── login/             # דף התחברות
│   ├── register/          # דף הרשמה
│   ├── videos/            # ספריית הסרטונים
│   ├── packages/          # חבילות ומנויים
│   └── layout.tsx         # Layout ראשי
├── components/            # רכיבי UI
│   └── Navbar.tsx         # תפריט ניווט
├── contexts/              # React Contexts
│   └── AuthContext.tsx    # הקשר אימות
└── lib/                   # עזרים ותצורות
    ├── supabase.ts        # לקוח Supabase
    ├── translations.ts    # תרגומים לעברית
    └── utils.ts           # פונקציות עזר
```

## פיצ'רים נוספים לפיתוח עתידי

- [ ] העלאת סרטונים לאדמין
- [ ] שידורים חיים
- [ ] קהילת משתמשים (פורום/צ'אט)
- [ ] אפליקציה ניידת
- [ ] אנליטיקס ודוחות
- [ ] מערכת התראות
- [ ] אינטגרציה עם מערכות תשלום ישראליות (Bit, Tranzila)

## פריסה (Deployment)

האתר מוכן לפריסה ב-Vercel, Netlify או כל פלטפורמה אחרת התומכת ב-Next.js.

### Vercel
1. חבר את הריפוזיטורי ל-Vercel
2. הגדר את משתני הסביבה
3. פרוס!

## תמיכה

לשאלות ותמיכה, צור קשר עם המפתח או פתח issue בריפוזיטורי.

---

**נבנה עם ❤️ עבור סטודיו נועה פילאטיס**
