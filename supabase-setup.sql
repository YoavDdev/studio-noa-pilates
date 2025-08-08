-- Studio Noa Pilates Database Setup
-- Run this script in your Supabase SQL Editor

-- טבלת פרופילי משתמשים
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_type TEXT CHECK (subscription_type IN ('free', 'premium', 'package')) DEFAULT 'free',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  lessons_remaining INTEGER DEFAULT 0,
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
  duration INTEGER, -- in seconds
  focus_area TEXT NOT NULL,
  style TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
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

-- טבלת התקדמות משתמשים
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  video_id UUID REFERENCES videos ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  watch_time INTEGER DEFAULT 0, -- in seconds
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

-- הוספת סרטוני דמו
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, focus_area, style, difficulty_level, is_premium) VALUES
('פילאטיס לליבה חזקה', 'שיעור מתמקד בחיזוק שרירי הליבה והשיפור היציבה', 'https://example.com/video1', 'https://example.com/thumb1.jpg', 1800, 'core', 'mat', 'beginner', false),
('גמישות וזרימה', 'שיעור עדין לשיפור הגמישות והתנועתיות', 'https://example.com/video2', 'https://example.com/thumb2.jpg', 2700, 'flexibility', 'contemporary', 'intermediate', true),
('פילאטיס מתקדם', 'אתגר לכל הגוף עם תרגילים מתקדמים', 'https://example.com/video3', 'https://example.com/thumb3.jpg', 3600, 'strength', 'classical', 'advanced', true),
('איזון ויציבה', 'שיעור לשיפור האיזון והיציבה', 'https://example.com/video4', 'https://example.com/thumb4.jpg', 2400, 'balance', 'mat', 'intermediate', false),
('פילאטיס לגיל הזהב', 'שיעור מותאם לגיל המבוגר', 'https://example.com/video5', 'https://example.com/thumb5.jpg', 2100, 'flexibility', 'seniors', 'beginner', true),
('שיקום וחיזוק', 'שיעור לשיקום פציעות וחיזוק שרירים', 'https://example.com/video6', 'https://example.com/thumb6.jpg', 2700, 'rehabilitation', 'mat', 'beginner', true);

-- הודעת הצלחה
SELECT 'Database setup completed successfully! 🎉' as message;
