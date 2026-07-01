import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendTrialReminderEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { email, name, type } = await req.json()

    if (!email || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const displayName = name || email

    if (type === 'welcome') {
      await sendWelcomeEmail(email, displayName)
    } else if (type === 'trial_reminder') {
      await sendTrialReminderEmail(email, displayName)
    } else {
      return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Send Email]', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
