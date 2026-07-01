# רשימת משימות — Studio Noa Pilates
> עודכן: יולי 2026 | סריקה מלאה של הקוד

---

## 🔴 עדיפות גבוהה (חובה לפני השקה)

### 1. דפי אדמין חסרים
הקישורים בדף `/admin` מפנים לדפים שלא קיימים:

| קישור | סטטוס |
|---|---|
| `/admin/messages` | ❌ לא קיים |
| `/admin/live-events` | ❌ לא קיים |
| `/admin/analytics` | ❌ לא קיים |
| `/admin/newsletter` | ❌ לא קיים |
| `/admin/sync-vimeo` | ❌ לא קיים |

**מה לבנות בכל דף:**
- **messages** — ממשק כתיבה ושליחת הודעות לכל המשתמשים או לקבוצות ספציפיות
- **live-events** — ניהול אירועים חיים (תאריך, שעה, קישור Vimeo, רישום)
- **analytics** — סטטיסטיקות: מספר משתמשים, מנויים, צפיות פופולריות
- **newsletter** — ניהול מנויי ניוזלטר + שליחת עדכון חודשי
- **sync-vimeo** — כפתור לסנכרון ידני של נתוני Vimeo (תיקיות/סרטונים)

---

### 2. מועדפים — לא מחובר לבסיס הנתונים
**קובץ:** `src/app/videos/VideosClient.tsx` שורות 102, 106

```
// TODO: API call to remove favorite
// TODO: API call to add favorite
```

המועדפים עובדים רק באופן מקומי (state) — לא נשמרים ב-Supabase.

**מה צריך:**
- [ ] API route: `POST /api/favorites` — הוסף/הסר מועדף
- [ ] קריאה ראשונית לטעינת מועדפים מה-DB בעת טעינת הדף
- [ ] טבלת `user_favorites` בסופאבייס (אם לא קיימת — לוודא)

---

### 3. מעקב צפייה (Progress) — לא מממושש
הטבלה `user_progress` מוגדרת בסכמת הדאטאבייס (`src/lib/supabase.ts`) אבל אין:
- [ ] שמירת התקדמות בזמן צפייה (כל 30 שניות)
- [ ] המשך צפייה מהנקודה האחרונה
- [ ] סימון סרטון כ"הושלם"
- [ ] API route: `POST /api/progress`
- [ ] דף `/profile` לא מציג היסטוריית צפייה

---

### 4. PayPal — לא מוגדר בסביבה
**קובץ:** `env.example`

כל ה-variables של PayPal הם placeholder:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here
PAYPAL_MONTHLY_PLAN_ID=P-xxxxxxxxxxxxxxxxxxxx
PAYPAL_YEARLY_PLAN_ID=P-xxxxxxxxxxxxxxxxxxxx
PAYPAL_WEBHOOK_ID=your_webhook_id_here
```

**מה צריך:**
- [ ] יצירת אפליקציית PayPal Developer ב-sandbox ולאחר מכן live
- [ ] יצירת subscription plans ב-PayPal
- [ ] הגדרת Webhook URL: `https://yourdomain.com/api/webhooks/paypal`
- [ ] מילוי כל הערכים ב-`.env.local`
- [ ] בדיקת זרימת התשלום מקצה לקצה

---

### 5. Resend — Email לא מוגדר
**קובץ:** `env.example`

```
RESEND_API_KEY=re_xxxxx
```

**מה צריך:**
- [ ] הרשמה ל-Resend.com וקבלת API Key אמיתי
- [ ] אימות דומיין `noaguralnik.co.il` ב-Resend
- [ ] בדיקה שמייל ברוכים הבאים נשלח בהרשמה
- [ ] בדיקה שמייל אישור מנוי נשלח לאחר תשלום PayPal

---

### 6. בקרת גישה לסרטונים — לא מיושמת בדפים הראשיים
**קבצים:** `src/app/videos/[folderName]/[videoId]/page.tsx`, `src/components/FolderVideosGrid.tsx`

כרגע כל הסרטונים נגישים לכולם. אין בדיקה אם המשתמש:
- [ ] רשום / בניסיון / מנוי בפועל
- הצגת "נעול" על סרטונים פרמיום למשתמשים חינמיים
- הפניה לדף `/packages` אם אין גישה

---

## 🟠 עדיפות בינונית (חשוב לחוויית משתמש)

### 7. דף פרופיל — חסר מידע
**קובץ:** `src/app/profile/page.tsx`

הדף מציג שם ומייל בלבד. חסר:
- [ ] היסטוריית צפייה (Progress)
- [ ] סרטונים מועדפים
- [ ] מצב מנוי מדויק + תאריך חידוש
- [ ] כפתור ביטול מנוי PayPal
- [ ] קישור לניהול המנוי ב-PayPal

---

### 8. console.log — יש להסיר לפני production
מצאנו `console.log` בקבצים הבאים:

| קובץ | מספר שורות |
|---|---|
| `src/contexts/AuthContext.tsx` | 10 |
| `src/app/api/folders/[folderName]/route.ts` | 5 |
| `src/app/api/webhooks/paypal/route.ts` | 5 |
| `src/app/api/folders/route.ts` | 4 |
| `src/app/videos/page.tsx` | 4 |
| `src/app/profile/page.tsx` | 2 |
| `src/components/Navbar.tsx` | 1 |
| `src/app/api/videos/all/route.ts` | 1 |

- [ ] להחליף ב-`console.error` רק לשגיאות אמיתיות
- [ ] להסיר את כל ה-debug logs

---

### 9. Footer — פרטי קשר placeholder
**קובץ:** `src/components/Footer.tsx`

```
noa@studio-noa.com        ← לא האימייל האמיתי
wa.me/972500000000        ← מספר מזויף
https://instagram.com     ← לא הפרופיל האמיתי
```

- [ ] לעדכן אימייל אמיתי
- [ ] לעדכן מספר WhatsApp אמיתי
- [ ] לעדכן קישור אינסטגרם אמיתי

---

### 10. folder-metadata.ts — metadata מקודד manually
**קובץ:** `src/config/folder-metadata.ts`

כל הגדרות התיקיות (תיאור, רמה, קטגוריה) קשיחות בקוד.  
הגישה הנכונה: לנהל דרך ממשק Admin → Supabase (`folder_settings` table).

- [ ] להעביר את כל השדות לטבלת `folder_settings` בסופאבייס
- [ ] שדה `is_visible` לשלוט על הצגה/הסתרה מה-admin
- [ ] שדה `level` (רמה) ו-`category` לניהול דינמי
- [ ] להסיר/לצמצם את `folder-metadata.ts`

---

### 11. דפי אדמין — עיצוב לא עקבי
- `src/app/admin/page.tsx` — עיצוב ישן עם `rounded-xl`, `shadow-lg` (לא תואם לשפה העיצובית החדשה)
- `src/app/admin/users/page.tsx` — עיצוב חדש (עקבי)
- `src/app/admin/folders/page.tsx` — עיצוב חדש (עקבי)
- [ ] לעדכן `admin/page.tsx` לעיצוב editorial flat (ללא rounded, ללא shadow)

---

### 12. דף הרשמה — עיצוב לא עקבי
**קובץ:** `src/app/register/page.tsx`

משתמש ב-CSS variables ישנים (`--color-cream`, `--color-sage`) שלא תואמות פלטת הצבעים החדשה.
- [ ] לעדכן לפלטת `#FDFCFA`, `#C9A871`, `#1A1410`, `#EBE5DC`
- [ ] להסיר `rounded-lg` מ-inputs ו-buttons (עיצוב sharp corners)

---

## 🟡 עדיפות נמוכה (שיפורים)

### 13. ניוזלטר — לא קיים
- [ ] שדה הרשמה לניוזלטר בעמוד הבית או בדף packages
- [ ] טבלת `newsletter_subscribers` בסופאבייס
- [ ] API route: `POST /api/newsletter/subscribe`
- [ ] אינטגרציה עם Resend לשליחת מיילים

---

### 14. Live Events — לא קיים
- [ ] טבלת `live_events` בסופאבייס
- [ ] דף ציבורי להצגת אירועים קרובים
- [ ] רישום משתמשים לאירועים
- [ ] מייל אישור רישום

---

### 15. אימות דו-שלבי עם NEXT_PUBLIC_SITE_URL
**קובץ:** `src/app/videos/[folderName]/page.tsx` שורה 19

```typescript
(typeof window !== 'undefined' ? window.location.origin : 'https://studio-noa-pilates.vercel.app')
```

ה-fallback URL ישן. לוודא ש-`NEXT_PUBLIC_SITE_URL` מוגדר נכון ב-`.env.local`.

---

### 16. VideosClient.tsx — קובץ לא בשימוש?
**קובץ:** `src/app/videos/VideosClient.tsx`

הקובץ קיים אבל כנראה לא בשימוש (המערכת עברה לתצוגת תיקיות Vimeo).  
- [ ] לבדוק אם הקובץ עדיין נדרש
- [ ] אם לא — למחוק או לנקות

---

### 17. admin/users — אין אפשרות לאפס סיסמה
**קובץ:** `src/app/admin/users/page.tsx`

ניתן לשנות `user_type` אבל לא:
- [ ] לאפס סיסמה לאדמין
- [ ] לשלוח מייל הזמנה מחדש
- [ ] למחוק משתמש

---

## ✅ מה שכבר עובד (לא לגעת)

| פיצ'ר | סטטוס |
|---|---|
| Auth (login/register/Google/reset password) | ✅ |
| ספריית סרטונים עם תיקיות Vimeo | ✅ |
| דף חיפוש חופשי (`/videos/explore`) | ✅ |
| נגן סרטונים Vimeo | ✅ |
| תת-תיקיות עם filter strip | ✅ |
| Admin: ניהול משתמשים (`/admin/users`) | ✅ |
| Admin: ניהול תיקיות (`/admin/folders`) | ✅ |
| דף חבילות עם PayPal UI | ✅ |
| Webhook PayPal (קוד) | ✅ |
| מיילים: ברוכים הבאה, ביטול מנוי, ניסיון | ✅ |
| עיצוב Editorial — דפים ראשיים | ✅ |
| RTL Hebrew תמיכה | ✅ |
| דפי terms/privacy | ✅ |
| Footer + Navbar | ✅ (חסר פרטים אמיתיים) |

---

## סדר פעולות מומלץ

```
שלב 1 — הפעלה (Production Ready):
  ├── הגדרת PayPal (env + plans + webhook)
  ├── הגדרת Resend (env + domain verification)
  ├── עדכון פרטי קשר ב-Footer
  └── הסרת console.log

שלב 2 — פיצ'רים ליבה:
  ├── חיבור מועדפים לסופאבייס (API + DB)
  ├── מעקב צפייה (Progress save/resume)
  ├── בקרת גישה לסרטונים (paywall)
  └── שיפור דף פרופיל

שלב 3 — Admin מלא:
  ├── /admin/messages
  ├── /admin/newsletter
  ├── /admin/analytics
  └── /admin/sync-vimeo

שלב 4 — שיפורים:
  ├── Live Events
  ├── ניוזלטר
  ├── עיצוב עקבי (register, admin/page)
  └── folder-metadata דינמי
```
