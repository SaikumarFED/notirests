import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const obj = payload.data;
    const attrs = obj.attributes;
    const customData = payload.meta.custom_data;

    const userId = customData?.user_id;

    if (!userId) {
      return NextResponse.json({ error: 'No user_id in custom data' }, { status: 400 });
    }

    // Handle subscription events
    if (eventName === 'subscription_created' || eventName === 'subscription_updated' || eventName === 'subscription_resumed') {
      const planName = attrs.product_name.toLowerCase().includes('pro') ? 'pro' : 
                       attrs.product_name.toLowerCase().includes('agency') ? 'agency' : 'free';

      await supabaseAdmin.from('profiles').update({
        ls_subscription_id: obj.id,
        ls_customer_id: String(attrs.customer_id),
        ls_variant_id: String(attrs.variant_id),
        ls_subscription_status: attrs.status,
        plan: planName,
      }).eq('id', userId);
    } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      await supabaseAdmin.from('profiles').update({
        ls_subscription_status: attrs.status,
        plan: 'free', // downgrade to free
      }).eq('id', userId);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
