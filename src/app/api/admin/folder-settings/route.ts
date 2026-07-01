import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

// GET - fetch all folder settings
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('folder_settings')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[Folder Settings] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ settings: data || [] })
  } catch (error) {
    console.error('[Folder Settings] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST - upsert folder settings (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminAccess = await isAdmin()
    if (!adminAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { folder_name, subtitle, sort_order, image_url } = body

    if (!folder_name) {
      return NextResponse.json({ error: 'folder_name is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const upsertData: Record<string, unknown> = {
      folder_name,
      subtitle: subtitle || '',
      sort_order: sort_order ?? 50,
    }
    if (image_url !== undefined) upsertData.image_url = image_url

    const { data, error } = await supabase
      .from('folder_settings')
      .upsert(upsertData, { onConflict: 'folder_name' })
      .select()
      .single()

    if (error) {
      console.error('[Folder Settings] Upsert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, setting: data })
  } catch (error) {
    console.error('[Folder Settings] Error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
