import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'noreply@noaguralnik.co.il'
const FROM_NAME = 'Studio Noa Pilates'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://noaguralnik.co.il'
const NOA_EMAIL = process.env.NOA_EMAIL || 'studionoapilates.israel@gmail.com'

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #FAF8F3; font-family: Arial, sans-serif; direction: rtl; }
    .container { max-width: 580px; margin: 40px auto; background: #fff; border: 1px solid #E8E2D9; }
    .header { background: #0F0A05; padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; color: #C9A871; font-size: 20px; font-weight: 300; letter-spacing: 3px; }
    .body { padding: 40px; color: #1A130A; }
    .body p { font-size: 15px; line-height: 1.8; color: #5C4D3C; margin: 0 0 16px; }
    .button { display: inline-block; background: #0F0A05; color: #C9A871 !important; text-decoration: none; padding: 14px 32px; font-size: 13px; letter-spacing: 2px; margin: 24px 0; }
    .divider { border: none; border-top: 1px solid #E8E2D9; margin: 32px 0; }
    .footer { padding: 24px 40px; text-align: center; background: #FAF8F3; border-top: 1px solid #E8E2D9; }
    .footer p { font-size: 12px; color: #9C8E7E; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>נועה גורלניק | פילאטיס</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>Studio Noa Pilates · <a href="${SITE_URL}" style="color:#9C8E7E;">${SITE_URL}</a></p>
      <p>לביטול הרשמה <a href="${SITE_URL}/profile" style="color:#9C8E7E;">לחצי כאן</a></p>
    </div>
  </div>
</body>
</html>`
}

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: 'ברוכה הבאה לסטודיו 🌿',
    html: baseTemplate(`
      <p>שלום ${name},</p>
      <p>שמחה שהצטרפת לסטודיו.</p>
      <p>יש לך <strong>3 ימי ניסיון חינם</strong> — גישה מלאה לכל הסרטונים.</p>
      <a href="${SITE_URL}/videos" class="button">התחילי לצפות</a>
      <hr class="divider" />
      <p>לאחר תקופת הניסיון תוכלי לבחור מנוי חודשי (₪99) או שנתי (₪990).</p>
    `)
  })
}

export async function sendSubscriptionConfirmEmail(to: string, name: string, plan: 'monthly' | 'yearly') {
  const planText = plan === 'monthly' ? 'חודשי — ₪99 לחודש' : 'שנתי — ₪990 לשנה'
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: 'המנוי שלך פעיל ✅',
    html: baseTemplate(`
      <p>שלום ${name},</p>
      <p>המנוי שלך <strong>${planText}</strong> פעיל כעת.</p>
      <p>יש לך גישה מלאה לכל הסרטונים.</p>
      <a href="${SITE_URL}/videos" class="button">לספריית הסרטונים</a>
      <hr class="divider" />
      <p>לניהול המנוי שלך — <a href="${SITE_URL}/profile" style="color:#B8935A;">פרופיל אישי</a></p>
    `)
  })
}

export async function sendSubscriptionCancelEmail(to: string, name: string) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: 'המנוי שלך בוטל',
    html: baseTemplate(`
      <p>שלום ${name},</p>
      <p>המנוי שלך בוטל. מצטערת לראות אותך עוזבת.</p>
      <p>הגישה שלך לתוכן תישאר פעילה עד סוף תקופת החיוב הנוכחית.</p>
      <a href="${SITE_URL}/packages" class="button">חזרי אלינו בכל עת</a>
    `)
  })
}

export async function sendTrialReminderEmail(to: string, name: string) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: 'נותר יום אחד לתקופת הניסיון שלך ⏳',
    html: baseTemplate(`
      <p>שלום ${name},</p>
      <p>תקופת הניסיון החינמית שלך מסתיימת <strong>מחר</strong>.</p>
      <p>כדי להמשיך לצפות בסרטונים — בחרי מנוי עכשיו.</p>
      <a href="${SITE_URL}/packages" class="button">בחרי מנוי</a>
      <hr class="divider" />
      <p>מנוי חודשי: ₪99 | מנוי שנתי: ₪990 (חיסכון של 17%)</p>
    `)
  })
}

export async function sendTrialExpiredEmail(to: string, name: string) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: 'תקופת הניסיון שלך הסתיימה',
    html: baseTemplate(`
      <p>שלום ${name},</p>
      <p>תקופת הניסיון החינמית שלך הסתיימה.</p>
      <p>כדי להמשיך לצפות בסרטונים — בחרי מנוי.</p>
      <a href="${SITE_URL}/packages" class="button">בחרי מנוי עכשיו</a>
      <hr class="divider" />
      <p>מנוי חודשי: ₪99 | מנוי שנתי: ₪990</p>
    `)
  })
}

export async function sendContactEmail(from: string, name: string, message: string) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to: NOA_EMAIL,
    replyTo: from,
    subject: `הודעה חדשה מ-${name}`,
    html: baseTemplate(`
      <p><strong>שם:</strong> ${name}</p>
      <p><strong>מייל:</strong> ${from}</p>
      <hr class="divider" />
      <p>${message.replace(/\n/g, '<br>')}</p>
    `)
  })
}
