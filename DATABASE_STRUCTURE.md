# 🗄️ מבנה Database - Studio Noa Pilates

## 📊 **סקירה כללית**

המערכת משתמשת ב-**Supabase (PostgreSQL)** עם **Vimeo** לאחסון סרטונים.

---

## 🎯 **עקרונות עיצוב:**

1. ✅ **Vimeo הוא מקור האמת** - הסרטונים נשמרים ב-Vimeo
2. ✅ **Cache חכם** - שומרים metadata ב-Database למהירות
3. ✅ **סנכרון אוטומטי** - פעם ביום מעדכנים מ-Vimeo
4. ✅ **ללא כפילויות מיותרות** - רק מה שצריך

---

## 📋 **טבלאות ראשיות (Supabase Setup)**

### 1️⃣ **`profiles`** - פרופילי משתמשים

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי (מקושר ל-auth.users) |
| `email` | TEXT | מייל המשתמש |
| `full_name` | TEXT | שם מלא |
| **ניהול מנויים:** |
| `subscription_id` | TEXT | PayPal ID / "Admin" / "Trial" / "Free" |
| `user_type` | TEXT | admin / premium / trial / free |
| `trial_start_date` | TIMESTAMP | מתי התחילה תקופת ניסיון |
| `subscription_start_date` | TIMESTAMP | מתי התחיל מנוי |
| `cancellation_date` | TIMESTAMP | מתי בוטל (ממשיך עד סוף חודש) |
| **PayPal Cache:** |
| `paypal_status` | TEXT | ACTIVE / CANCELLED / EXPIRED |
| `paypal_id` | TEXT | מזהה PayPal |
| `paypal_cancellation_date` | TIMESTAMP | תאריך ביטול ב-PayPal |
| `paypal_last_sync_at` | TIMESTAMP | מתי סונכרן לאחרונה |
| **UX:** |
| `has_seen_welcome_message` | BOOLEAN | האם ראה הודעת ברוכים הבאים |
| `created_at` | TIMESTAMP | תאריך יצירה |
| `updated_at` | TIMESTAMP | תאריך עדכון |

**למה אין:**
- ❌ `avatar_url` - לא צריך תמונות פרופיל
- ❌ `subscription_expires_at` - מיותר (יש cancellation_date)
- ❌ `lessons_remaining` - לא רלוונטי למנוי חודשי

---

### 2️⃣ **`videos`** - סרטונים (Cache מ-Vimeo)

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי |
| **Vimeo Data (אוטומטי):** |
| `vimeo_id` | TEXT | מזהה הסרטון ב-Vimeo (ייחודי!) |
| `vimeo_uri` | TEXT | URI מלא (/videos/123456789) |
| `title` | TEXT | כותרת (מ-Vimeo) |
| `description` | TEXT | תיאור (מ-Vimeo) |
| `thumbnail_url` | TEXT | תמונה ממוזערת (מ-Vimeo) |
| `duration` | INTEGER | אורך בשניות (מ-Vimeo) |
| **Metadata שלנו (נועה מגדירה):** |
| `focus_area` | TEXT | core, flexibility, strength, balance, rehabilitation |
| `style` | TEXT | mat, classical, contemporary, seniors |
| `difficulty_level` | TEXT | beginner / intermediate / advanced |
| `is_premium` | BOOLEAN | האם פרימיום? (ברירת מחדל: true) |
| `category` | TEXT | קטגוריה ראשית |
| `tags` | TEXT[] | תגיות לחיפוש |
| **Vimeo Folder:** |
| `vimeo_folder_id` | TEXT | מזהה תיקייה ב-Vimeo |
| `vimeo_folder_name` | TEXT | שם תיקייה |
| **Timestamps:** |
| `created_at` | TIMESTAMP | מתי נוצר |
| `updated_at` | TIMESTAMP | מתי עודכן |
| `last_synced_at` | TIMESTAMP | מתי סונכרן מ-Vimeo |

**איך זה עובד:**
1. 🎥 נועה מעלה סרטון ל-Vimeo
2. 🔄 סקריפט סנכרון רץ (אוטומטי או ידני)
3. 💾 הסרטון נשמר ב-Database עם metadata
4. 🚀 המשתמשים רואים אותו באתר מיידית
5. ▶️ כשלוחצים "נגן" - יוצרים URL מאובטח מ-Vimeo

---

### 3️⃣ **`user_favorites`** - מועדפים

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי |
| `user_id` | UUID | מי שמר |
| `video_id` | UUID | איזה סרטון |
| `created_at` | TIMESTAMP | מתי נשמר |

**Unique:** `(user_id, video_id)` - משתמש לא יכול לשמור אותו סרטון פעמיים

---

### 4️⃣ **`user_progress`** - התקדמות

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי |
| `user_id` | UUID | מי צפה |
| `video_id` | UUID | באיזה סרטון |
| `vimeo_id` | TEXT | גיבוי (אם הסרטון נמחק מה-DB) |
| `completed` | BOOLEAN | האם סיים? |
| `watch_time` | INTEGER | כמה שניות צפה |
| `resume_time` | FLOAT | זמן אחרון (לחזרה למקום) |
| `completed_at` | TIMESTAMP | מתי סיים |
| `created_at` | TIMESTAMP | מתי התחיל |
| `updated_at` | TIMESTAMP | עדכון אחרון |

**Unique:** `(user_id, video_id)` - משתמש לא יכול להתקדם באותו סרטון פעמיים

---

## 🔐 **אבטחה (RLS - Row Level Security)**

### **Profiles:**
- ✅ משתמשים רואים רק את הפרופיל שלהם
- ✅ משתמשים יכולים לעדכן רק את הפרופיל שלהם

### **Videos:**
- ✅ כולם יכולים לראות סרטונים (הנגן יבדוק הרשאות)

### **User Favorites:**
- ✅ משתמשים מנהלים רק את המועדפים שלהם

### **User Progress:**
- ✅ משתמשים רואים רק את ההתקדמות שלהם

---

## ⚡ **אינדקסים (לביצועים מהירים)**

### **Videos:**
- `vimeo_id` - חיפוש לפי Vimeo ID
- `difficulty_level` - סינון לפי רמת קושי
- `category` - סינון לפי קטגוריה
- `is_premium` - סינון פרימיום/חינמי
- `vimeo_folder_name` - סינון לפי תיקייה

### **Profiles:**
- `email` - חיפוש לפי מייל
- `user_type` - סינון לפי סוג משתמש
- `subscription_id` - חיפוש מנויים
- `paypal_status` - סינון לפי סטטוס PayPal

### **Progress:**
- `user_id` - כל ההתקדמות של משתמש
- `vimeo_id` - התקדמות בסרטון ספציפי
- `completed` - סרטונים שהושלמו

---

## 📊 **טבלאות מתקדמות (User Management)**

### 5️⃣ **`messages`** - הודעות מנועה
### 6️⃣ **`message_reads`** - מעקב קריאה
### 7️⃣ **`message_dismisses`** - מעקב סגירה
### 8️⃣ **`message_replies`** - תגובות
### 9️⃣ **`email_logs`** - לוג מיילים
### 🔟 **`live_events`** - שיעורים חיים
### 1️⃣1️⃣ **`live_event_registrations`** - רישום לשיעורים
### 1️⃣2️⃣ **`newsletter_subscribers`** - ניוזלטר
### 1️⃣3️⃣ **`folder_metadata`** - ניהול תיקיות Vimeo
### 1️⃣4️⃣ **`categories`** - קטגוריות דינמיות
### 1️⃣5️⃣ **`subcategories`** - תת-קטגוריות
### 1️⃣6️⃣ **`site_settings`** - הגדרות אתר

*(פירוט מלא בסקריפט `supabase-user-management.sql`)*

---

## 🔄 **תהליך סנכרון Vimeo**

```
1. Vimeo API → קריאה לכל הסרטונים והתיקיות
2. בדיקה מה חדש/השתנה
3. עדכון טבלת videos
4. עדכון last_synced_at
5. ✅ סיום!
```

**תדירות:** פעם ביום (או כשנועה מוסיפה סרטון חדש)

---

## 🎯 **סיכום:**

✅ **4 טבלאות בסיסיות** - profiles, videos, favorites, progress  
✅ **12 טבלאות מתקדמות** - messages, live events, newsletter, וכו'  
✅ **אבטחה מלאה** - RLS על כל טבלה  
✅ **ביצועים מהירים** - אינדקסים על כל השדות החשובים  
✅ **סנכרון חכם** - Cache מ-Vimeo ללא כפילויות  

**הכל מוכן להרצה!** 🚀
