export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-16 md:py-24">
      <div className="container max-w-4xl mx-auto px-6">
        <h1 className="font-heading text-4xl md:text-6xl font-light mb-8 text-[var(--color-text-primary)]">
          מדיניות פרטיות
        </h1>
        
        <div className="bg-white p-8 md:p-12 space-y-8">
          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              1. כללי
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              אנו מתחייבים לשמור על פרטיותך ולהגן על המידע האישי שלך. מדיניות פרטיות זו מסבירה
              כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              2. איסוף מידע
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mb-4">
              אנו אוספים מידע שאתה מספק בעת הרשמה או שימוש באתר:
            </p>
            <ul className="list-disc list-inside font-body text-[var(--color-text-secondary)] space-y-2 mr-4">
              <li>שם מלא וכתובת דוא&quot;ל</li>
              <li>פרטי חיוב ותשלום (באמצעות PayPal)</li>
              <li>היסטוריית צפייה והתקדמות בשיעורים</li>
              <li>העדפות אישיות והגדרות חשבון</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              3. שימוש במידע
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mb-4">
              אנו משתמשים במידע שלך למטרות הבאות:
            </p>
            <ul className="list-disc list-inside font-body text-[var(--color-text-secondary)] space-y-2 mr-4">
              <li>מתן גישה לתכנים ושירותים באתר</li>
              <li>ניהול חשבונך והמנוי שלך</li>
              <li>שיפור חווית המשתמש והתאמה אישית</li>
              <li>שליחת עדכונים ותוכן רלוונטי (אם הסכמת לכך)</li>
              <li>תמיכה טכנית ומענה לפניות</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              4. שיתוף מידע עם צדדים שלישיים
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mb-4">
              אנו משתפים מידע רק עם ספקי שירותים מהימנים:
            </p>
            <ul className="list-disc list-inside font-body text-[var(--color-text-secondary)] space-y-2 mr-4">
              <li>PayPal - לעיבוד תשלומים</li>
              <li>Supabase - לאחסון נתונים ואימות משתמשים</li>
              <li>Vimeo - לאחסון והזרמת וידאו</li>
              <li>Vercel - לאירוח האתר</li>
            </ul>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mt-4">
              אנו לא מוכרים או משתפים את המידע שלך לצדדים שלישיים למטרות שיווקיות.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              5. אבטחת מידע
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              אנו נוקטים באמצעי אבטחה טכניים וארגוניים להגנה על המידע שלך, כולל הצפנה,
              גישה מוגבלת ואחסון מאובטח. עם זאת, אף שיטת העברה או אחסון אינה בטוחה ב-100%.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              6. Cookies
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              האתר משתמש ב-cookies לשיפור חווית השימוש, שמירת העדפות וניתוח שימוש באתר.
              ניתן לנהל cookies דרך הגדרות הדפדפן שלך.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              7. זכויות המשתמש
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mb-4">
              יש לך זכות:
            </p>
            <ul className="list-disc list-inside font-body text-[var(--color-text-secondary)] space-y-2 mr-4">
              <li>לצפות במידע האישי שלך</li>
              <li>לבקש תיקון או עדכון מידע</li>
              <li>לבקש מחיקת החשבון והמידע שלך</li>
              <li>לבטל הסכמה לקבלת דיוור</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              8. שינויים במדיניות
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יפורסמו באתר
              ויכנסו לתוקף מיד עם פרסומם.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              9. יצירת קשר
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              לשאלות או בקשות בנוגע לפרטיות שלך, ניתן ליצור קשר דרך טופס יצירת הקשר באתר
              או לשלוח דוא&quot;ל ישירות.
            </p>
          </section>

          <div className="pt-8 border-t border-[var(--color-border)]">
            <p className="font-body text-sm text-[var(--color-text-muted)]">
              מדיניות זו עודכנה לאחרונה: מאי 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
