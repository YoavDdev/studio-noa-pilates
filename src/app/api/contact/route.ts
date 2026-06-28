import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
    }

    await sendContactEmail(email, name, message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact email error:', error)
    return NextResponse.json({ error: 'שגיאה בשליחת ההודעה' }, { status: 500 })
  }
}
