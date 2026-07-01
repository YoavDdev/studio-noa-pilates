import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET — fetch current user's messages
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ messages: [], unread: 0 })

    const { data, error } = await supabase
      .from('user_messages')
      .select('id, subject, body, is_read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    const messages = data || []
    const unread = messages.filter(m => !m.is_read).length

    return NextResponse.json({ messages, unread })
  } catch (error) {
    console.error('[Messages GET]', error)
    return NextResponse.json({ messages: [], unread: 0 })
  }
}

// PATCH — mark message(s) as read
export async function PATCH(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, markAllRead } = await req.json()

    if (markAllRead) {
      await supabase
        .from('user_messages')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
    } else if (id) {
      await supabase
        .from('user_messages')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Messages PATCH]', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
