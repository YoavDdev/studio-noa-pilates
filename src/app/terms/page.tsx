export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-16 md:py-24">
      <div className="container max-w-4xl mx-auto px-6">
        <h1 className="font-heading text-4xl md:text-6xl font-light mb-8 text-[var(--color-text-primary)]">
          תנאי שימוש
        </h1>
        
        <div className="bg-white p-8 md:p-12 space-y-8">
          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              1. כללי
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              ברוכים הבאים לאתר סטודיו נועה פילאטיס. השימוש באתר מהווה הסכמה לתנאי שימוש אלה.
              אנא קרא בעיון את התנאים המפורטים להלן.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              2. שימוש באתר
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mb-4">
              האתר מיועד לשימוש אישי בלבד. אסור להעתיק, להפיץ או למכור תכנים מהאתר ללא אישור מפורש בכתב.
            </p>
            <ul className="list-disc list-inside font-body text-[var(--color-text-secondary)] space-y-2 mr-4">
              <li>השימוש בתכנים מותר לצפייה אישית בלבד</li>
              <li>אסור להעתיק או להפיץ וידאו, תמונות או טקסט מהאתר</li>
              <li>אסור לשתף חשבון משתמש עם אחרים</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              3. מנויים ותשלומים
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed mb-4">
              המנוי מחודש אוטומטית אלא אם צוין אחרת. ניתן לבטל את המנוי בכל עת דרך הגדרות החשבון.
            </p>
            <ul className="list-disc list-inside font-body text-[var(--color-text-secondary)] space-y-2 mr-4">
              <li>התשלומים מתבצעים באמצעות PayPal</li>
              <li>ביטול מנוי תקף עד סוף התקופה ששולמה</li>
              <li>אין החזרים כספיים עבור ביטולים באמצע התקופה</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              4. זכויות יוצרים
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              כל התכנים באתר, כולל וידאו, תמונות, טקסטים ועיצוב, הם בבעלות סטודיו נועה פילאטיס
              ומוגנים בזכויות יוצרים. אין להשתמש בתכנים ללא אישור מפורש.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              5. אחריות והגבלת חבות
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              השימוש באתר ובתכנים הוא על אחריותך הבלעדית. מומלץ להתייעץ עם רופא לפני תחילת
              כל פעילות גופנית. האתר אינו אחראי לכל נזק או פגיעה שייגרמו כתוצאה מהשימוש בתכנים.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              6. שינויים בתנאי השימוש
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              אנו שומרים לעצמנו את הזכות לשנות את תנאי השימוש בכל עת. שינויים יכנסו לתוקף
              מיד עם פרסומם באתר.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-light mb-4 text-[var(--color-text-primary)]">
              7. יצירת קשר
            </h2>
            <p className="font-body text-[var(--color-text-secondary)] leading-relaxed">
              לשאלות או בקשות בנוגע לתנאי השימוש, ניתן ליצור קשר דרך טופס יצירת הקשר באתר.
            </p>
          </section>

          <div className="pt-8 border-t border-[var(--color-border)]">
            <p className="font-body text-sm text-[var(--color-text-muted)]">
              תנאים אלה עודכנו לאחרונה: מאי 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
