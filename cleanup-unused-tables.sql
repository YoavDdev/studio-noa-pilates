-- ========================================
-- מחיקת טבלאות שלא נחוצות יותר
-- המערכת עובדת עם Vimeo API ישירות + config file
-- ========================================

-- מחיקת טבלת folder_metadata (עברנו ל-config file)
DROP TABLE IF EXISTS folder_metadata CASCADE;

-- מחיקת טבלת videos (מושכים ישירות מ-Vimeo)
DROP TABLE IF EXISTS videos CASCADE;

-- מחיקת טבלות קטגוריות (נמצאות ב-config)
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ========================================
-- מה שנשאר ב-Supabase (עדיין נחוץ!)
-- ========================================
-- ✅ profiles         - משתמשים ומנויים
-- ✅ messages         - הודעות מהאדמין
-- ✅ message_reads    - קריאת הודעות
-- ✅ message_dismisses - סגירת הודעות
-- ✅ message_replies  - תגובות
-- ✅ email_logs       - לוג אימיילים
-- ✅ live_events      - שיעורים חיים
-- ✅ live_event_registrations - הרשמות
-- ✅ newsletter_subscribers   - ניוזלטר
-- ✅ site_settings    - הגדרות אתר

SELECT '✅ ניקוי הושלם! טבלאות מיותרות נמחקו.' as message;
