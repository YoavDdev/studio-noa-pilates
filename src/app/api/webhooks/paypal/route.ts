import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendSubscriptionConfirmEmail, sendSubscriptionCancelEmail } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyPayPalWebhook(req: NextRequest, body: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    console.warn('[PayPal Webhook] PAYPAL_WEBHOOK_ID not set - skipping verification')
    return true
  }

  const authAlgo = req.headers.get('paypal-auth-algo')
  const certUrl = req.headers.get('paypal-cert-url')
  const transmissionId = req.headers.get('paypal-transmission-id')
  const transmissionSig = req.headers.get('paypal-transmission-sig')
  const transmissionTime = req.headers.get('paypal-transmission-time')

  if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
    console.error('[PayPal Webhook] Missing verification headers')
    return false
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
    const mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox'
    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    })
    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    const verifyRes = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body)
      })
    })
    const verifyData = await verifyRes.json()
    return verifyData.verification_status === 'SUCCESS'
  } catch (err) {
    console.error('[PayPal Webhook] Verification error:', err)
    return false
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  let event: Record<string, unknown>

  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const isValid = await verifyPayPalWebhook(req, body)
  if (!isValid) {
    console.error('[PayPal Webhook] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const eventType = event.event_type as string
  const resource = event.resource as Record<string, unknown>

  console.log(`[PayPal Webhook] Event: ${eventType}`)

  try {
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.CREATED': {
        const subscriptionId = resource.id as string
        const subscriberEmail = (resource.subscriber as Record<string, unknown>)?.email_address as string
        
        if (subscriberEmail) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .update({
              user_type: 'subscription',
              subscription_id: subscriptionId,
              paypal_subscription_id: subscriptionId,
              paypal_status: 'ACTIVE',
              subscription_start_date: new Date().toISOString(),
              paypal_last_sync_at: new Date().toISOString()
            })
            .eq('email', subscriberEmail)
            .select('full_name')
            .single()
          console.log(`[PayPal Webhook] Activated subscription for: ${subscriberEmail}`)
          try {
            await sendSubscriptionConfirmEmail(subscriberEmail, profile?.full_name || 'חברה יקרה', 'monthly')
          } catch (emailErr) {
            console.error('[PayPal Webhook] Failed to send confirm email:', emailErr)
          }
        }
        break
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const subscriptionId = resource.id as string

        const { data: cancelledProfile } = await supabaseAdmin
          .from('profiles')
          .update({
            user_type: 'free',
            paypal_status: eventType.includes('CANCELLED') ? 'CANCELLED' : eventType.includes('SUSPENDED') ? 'SUSPENDED' : 'EXPIRED',
            paypal_cancellation_date: new Date().toISOString(),
            paypal_last_sync_at: new Date().toISOString()
          })
          .eq('paypal_subscription_id', subscriptionId)
          .select('email, full_name')
          .single()
        console.log(`[PayPal Webhook] Cancelled/Expired subscription: ${subscriptionId}`)
        if (cancelledProfile?.email) {
          try {
            await sendSubscriptionCancelEmail(cancelledProfile.email, cancelledProfile.full_name || 'חברה יקרה')
          } catch (emailErr) {
            console.error('[PayPal Webhook] Failed to send cancel email:', emailErr)
          }
        }
        break
      }

      case 'PAYMENT.SALE.COMPLETED': {
        const subscriptionId = (resource.billing_agreement_id as string) || null
        if (subscriptionId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              paypal_status: 'ACTIVE',
              paypal_last_sync_at: new Date().toISOString()
            })
            .eq('paypal_subscription_id', subscriptionId)
          console.log(`[PayPal Webhook] Payment confirmed for subscription: ${subscriptionId}`)
        }
        break
      }

      default:
        console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`)
    }
  } catch (err) {
    console.error('[PayPal Webhook] DB error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
