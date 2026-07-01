import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'noa@studio-noa.com'
const FROM_NAME = 'נועה גורלניק | סטודיו פילאטיס'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studio-noa-pilates.vercel.app'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { subject, body, audience, channel = 'both', userIds } = await req.json()

    if (!subject || !body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // channel: 'email' | 'site' | 'both'
    const sendEmail = channel === 'email' || channel === 'both'
    const sendSite  = channel === 'site'  || channel === 'both'

    let recipients: { id: string; email: string; full_name: string }[] = []

    if (Array.isArray(userIds) && userIds.length > 0) {
      // Specific users
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds)
      if (fetchError) throw fetchError
      recipients = data || []
    } else {
      // Audience group
      let query = supabase.from('profiles').select('id, email, full_name')
      if (audience === 'subscription') query = query.eq('user_type', 'subscription')
      else if (audience === 'trial')    query = query.eq('user_type', 'trial')
      else if (audience === 'free')     query = query.eq('user_type', 'free')
      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError
      recipients = data || []
    }

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({ count: 0 })
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Assistant', Arial, sans-serif; background: #FAF8F3; margin: 0; padding: 0; direction: rtl; }
          .container { max-width: 560px; margin: 40px auto; background: #fff; border: 1px solid #EBE5DC; }
          .header { padding: 32px 40px 24px; border-bottom: 1px solid #EBE5DC; }
          .logo { font-size: 22px; font-weight: 300; color: #1A1410; letter-spacing: 0.02em; }
          .content { padding: 32px 40px; color: #1A1410; font-size: 15px; line-height: 1.8; white-space: pre-wrap; }
          .footer { padding: 20px 40px; border-top: 1px solid #EBE5DC; color: #A39888; font-size: 12px; text-align: center; }
          a { color: #C9A871; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">נועה גורלניק</div>
          </div>
          <div class="content">${body.replace(/\n/g, '<br/>')}</div>
          <div class="footer">
            <a href="${SITE_URL}">כניסה לסטודיו</a>
          </div>
        </div>
      </body>
      </html>
    `

    if (sendSite) {
      const siteMessageData = recipients.map(r => ({
        user_id: r.id,
        subject,
        body,
        is_read: false,
        created_at: new Date().toISOString()
      }))
      const { error: msgError } = await supabase
        .from('user_messages')
        .insert(siteMessageData)
      if (msgError) {
        console.error('[Broadcast] Message insert error:', msgError.message)
      }
    }

    if (sendEmail) {
      const emailChunks: typeof recipients[] = []
      for (let i = 0; i < recipients.length; i += 50) {
        emailChunks.push(recipients.slice(i, i + 50))
      }
      for (const chunk of emailChunks) {
        await Promise.allSettled(
          chunk.map(r =>
            resend.emails.send({
              from: `${FROM_NAME} <${FROM}>`,
              to: r.email,
              subject,
              html: emailHtml,
            })
          )
        )
      }
    }

    return NextResponse.json({ success: true, count: recipients.length })
  } catch (error) {
    console.error('[Broadcast]', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
