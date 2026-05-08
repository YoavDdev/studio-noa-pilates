-- 🔐 Studio Noa Pilates - User Management System
-- הרחבת מערכת ניהול משתמשים עם כל הפיצ'רים מ-flyStick

-- ========================================
-- שלב 1: טבלת profiles כבר מעודכנת!
-- ========================================
-- כל השדות הנדרשים כבר נוצרו בסקריפט הראשון (supabase-setup.sql)
-- אין צורך ב-ALTER TABLE - הכל כבר קיים!

-- ========================================
-- שלב 2: טבלת הודעות (Messages)
-- ========================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  link_text TEXT,
  target_user_ids UUID[], -- אם ריק = שידור לכולם
  allow_reply BOOLEAN DEFAULT false,
  target_group TEXT, -- 'all', 'active', 'free', 'premium', 'trial'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  message_id UUID REFERENCES messages ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, message_id)
);

CREATE TABLE IF NOT EXISTS message_dismisses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  message_id UUID REFERENCES messages ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, message_id)
);

CREATE TABLE IF NOT EXISTS message_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false, -- האם האדמין קרא את התגובה
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, message_id)
);

-- ========================================
-- שלב 3: Email Logging
-- ========================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  from_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'welcome', 'subscription', 'reset_password', 'live_event', etc.
  status TEXT NOT NULL, -- 'sent', 'failed', 'pending'
  resend_id TEXT, -- Resend email ID
  error_message TEXT,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_to ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);

-- ========================================
-- שלב 4: Live Events (שיעורים חיים)
-- ========================================

CREATE TABLE IF NOT EXISTS live_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_duration INTEGER DEFAULT 60, -- בדקות
  status TEXT DEFAULT 'scheduled', -- scheduled, live, ended, cancelled
  vimeo_embed_url TEXT,
  vimeo_event_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live_event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES live_events ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  wants_email_updates BOOLEAN DEFAULT true,
  UNIQUE(event_id, user_id)
);

-- ========================================
-- שלב 5: Newsletter
-- ========================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  source TEXT, -- 'registration', 'footer', 'dashboard'
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  unsubscribe_token TEXT UNIQUE
);

-- ========================================
-- שלב 6: Folder Metadata (ניהול תיקיות Vimeo)
-- ========================================

CREATE TABLE IF NOT EXISTS folder_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folder_name TEXT UNIQUE NOT NULL, -- שם התיקייה ב-Vimeo
  description TEXT,
  level TEXT, -- 'beginners', 'intermediate', 'advanced', 'all'
  levels TEXT[], -- תמיכה במספר רמות
  level_hebrew TEXT,
  category TEXT,
  sub_category TEXT,
  order_index INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false, -- תג "חדש"
  is_visible BOOLEAN DEFAULT true,
  image_url TEXT, -- תמונת רקע מותאמת אישית
  icon TEXT, -- אייקון SVG
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- שלב 7: Categories (קטגוריות דינמיות)
-- ========================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL, -- 'technique', 'equipment', etc.
  hebrew TEXT NOT NULL, -- 'טכניקה', 'אביזרים'
  emoji TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  hebrew TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  category_id UUID REFERENCES categories ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, key)
);

-- ========================================
-- שלב 8: Site Settings
-- ========================================

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- RLS Policies
-- ========================================

-- Messages - כולם יכולים לקרוא, רק אדמין יכול לכתוב
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active messages" ON messages 
  FOR SELECT USING (is_active = true);

-- Message Reads - משתמשים יכולים לנהל את הקריאות שלהם
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own message reads" ON message_reads 
  FOR ALL USING (auth.uid() = user_id);

-- Message Dismisses
ALTER TABLE message_dismisses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own dismisses" ON message_dismisses 
  FOR ALL USING (auth.uid() = user_id);

-- Message Replies
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own replies" ON message_replies 
  FOR ALL USING (auth.uid() = user_id);

-- Email Logs - רק אדמין יכול לראות
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Live Events - כולם יכולים לראות
ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view live events" ON live_events 
  FOR SELECT USING (true);

-- Live Event Registrations - משתמשים יכולים לנהל את הרישומים שלהם
ALTER TABLE live_event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own registrations" ON live_event_registrations 
  FOR ALL USING (auth.uid() = user_id);

-- Newsletter - כולם יכולים להירשם
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers 
  FOR INSERT WITH CHECK (true);

-- Folder Metadata - כולם יכולים לקרוא
ALTER TABLE folder_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view folder metadata" ON folder_metadata 
  FOR SELECT USING (is_visible = true);

-- Categories - כולם יכולים לקרוא
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON categories 
  FOR SELECT USING (is_active = true);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active subcategories" ON subcategories 
  FOR SELECT USING (is_active = true);

-- Site Settings - כולם יכולים לקרוא
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site settings" ON site_settings 
  FOR SELECT USING (true);

-- ========================================
-- הוספת קטגוריות ברירת מחדל
-- ========================================

INSERT INTO categories (key, hebrew, emoji, order_index) VALUES
  ('technique', 'טכניקה', '🎯', 1),
  ('equipment', 'אביזרים', '🏋️', 2),
  ('level', 'רמה', '📊', 3),
  ('focus', 'מיקוד', '💪', 4)
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- הודעת הצלחה
-- ========================================

SELECT '✅ User Management System Setup Complete!' as message;
SELECT 'טבלאות שנוצרו:' as info;
SELECT '- profiles (עודכן)' as table_name
UNION ALL SELECT '- messages'
UNION ALL SELECT '- message_reads'
UNION ALL SELECT '- message_dismisses'
UNION ALL SELECT '- message_replies'
UNION ALL SELECT '- email_logs'
UNION ALL SELECT '- live_events'
UNION ALL SELECT '- live_event_registrations'
UNION ALL SELECT '- newsletter_subscribers'
UNION ALL SELECT '- folder_metadata'
UNION ALL SELECT '- categories'
UNION ALL SELECT '- subcategories'
UNION ALL SELECT '- site_settings';
