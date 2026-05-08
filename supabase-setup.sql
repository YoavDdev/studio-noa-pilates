-- Studio Noa Pilates Database Setup
-- Run this script in your Supabase SQL Editor

-- טבלת פרופילי משתמשים
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  -- ניהול מנויים מתקדם
  subscription_id TEXT, -- PayPal ID, "Admin", "Trial", "Free", or null
  user_type TEXT DEFAULT 'free', -- 'admin', 'premium', 'trial', 'free'
  trial_start_date TIMESTAMP WITH TIME ZONE,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  cancellation_date TIMESTAMP WITH TIME ZONE,
  -- PayPal cached data (למנוע קריאות מיותרות)
  paypal_status TEXT, -- ACTIVE, CANCELLED, EXPIRED
  paypal_id TEXT,
  paypal_cancellation_date TIMESTAMP WITH TIME ZONE,
  paypal_last_sync_at TIMESTAMP WITH TIME ZONE,
  -- UX
  has_seen_welcome_message BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת סרטונים (Cache מ-Vimeo)
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Vimeo data (מסונכרן אוטומטית)
  vimeo_id TEXT NOT NULL UNIQUE, -- מזהה הסרטון ב-Vimeo
  vimeo_uri TEXT, -- URI מלא מ-Vimeo (לדוגמה: /videos/123456789)
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  -- Metadata שלנו (נועה מגדירה)
  focus_area TEXT, -- core, flexibility, strength, balance, rehabilitation
  style TEXT, -- mat, classical, contemporary, seniors
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  is_premium BOOLEAN DEFAULT true, -- ברירת מחדל: פרימיום
  category TEXT, -- קטגוריה ראשית
  tags TEXT[], -- תגיות לחיפוש
  -- Vimeo folder (לארגון)
  vimeo_folder_id TEXT,
  vimeo_folder_name TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- מתי סונכרן מ-Vimeo
);

-- טבלת מועדפים
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  video_id UUID REFERENCES videos ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- טבלת התקדמות משתמשים
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  video_id UUID REFERENCES videos ON DELETE CASCADE,
  vimeo_id TEXT NOT NULL, -- גיבוי - אם הסרטון נמחק מה-DB
  completed BOOLEAN DEFAULT false,
  watch_time INTEGER DEFAULT 0, -- in seconds
  resume_time FLOAT, -- זמן אחרון שנשמר (לחזרה למקום)
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- הפעלת Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- מדיניות אבטחה לפרופילים
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- מדיניות אבטחה למועדפים
CREATE POLICY "Users can manage own favorites" ON user_favorites 
  FOR ALL USING (auth.uid() = user_id);

-- מדיניות אבטחה להתקדמות
CREATE POLICY "Users can manage own progress" ON user_progress 
  FOR ALL USING (auth.uid() = user_id);

-- מדיניות אבטחה לסרטונים
CREATE POLICY "Anyone can view videos" ON videos 
  FOR SELECT TO authenticated, anon USING (true);

-- פונקציה ליצירת פרופיל אוטומטית
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- טריגר ליצירת פרופיל אוטומטית
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- הסרטונים ימולאו אוטומטית מ-Vimeo אחרי חיבור ה-API
-- לא נוסיף סרטוני דמו - רק סרטונים אמיתיים של נועה!

-- ========================================
-- אינדקסים לביצועים מהירים
-- ========================================

-- חיפוש סרטונים
CREATE INDEX idx_videos_vimeo_id ON videos(vimeo_id);
CREATE INDEX idx_videos_difficulty ON videos(difficulty_level);
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_is_premium ON videos(is_premium);
CREATE INDEX idx_videos_folder ON videos(vimeo_folder_name);

-- חיפוש משתמשים
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_subscription_id ON profiles(subscription_id);
CREATE INDEX idx_profiles_paypal_status ON profiles(paypal_status);

-- התקדמות משתמשים
CREATE INDEX idx_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_progress_vimeo_id ON user_progress(vimeo_id);
CREATE INDEX idx_progress_completed ON user_progress(completed);

-- מועדפים
CREATE INDEX idx_favorites_user_id ON user_favorites(user_id);

-- הודעת הצלחה
SELECT 'Database setup completed successfully! 🎉' as message;
SELECT 'Created tables: profiles, videos, user_favorites, user_progress' as info;
SELECT 'Added indexes for fast search and filtering' as info;
