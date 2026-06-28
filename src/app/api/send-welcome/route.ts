import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, has_seen_welcome_message')
      .eq('id', user.id)
      .single()

    if (profile?.has_seen_welcome_message) {
      return NextResponse.json({ skipped: true })
    }

    await sendWelcomeEmail(user.email!, profile?.full_name || 'חברה יקרה')

    await supabase
      .from('profiles')
      .update({ has_seen_welcome_message: true })
      .eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json({ error: 'שגיאה בשליחת מייל' }, { status: 500 })
  }
}
