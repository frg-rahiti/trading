import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createAdminSupabase } from '../../../../lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
type LicenseType = 'STANDARD' | 'DEVELOPER';

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  try {
    const event = stripe.webhooks.constructEvent(await req.text(), signature, process.env.STRIPE_WEBHOOK_SECRET!);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const productId = session.metadata?.product_id;
      const licenseType: LicenseType = session.metadata?.license_type === 'DEVELOPER' ? 'DEVELOPER' : 'STANDARD';
      if (userId && productId) {
        const db = createAdminSupabase();
        const { data: existing } = await db.from('orders').select('id').eq('stripe_checkout_session_id', session.id).maybeSingle();
        if (!existing) {
          const { data: order, error: orderError } = await db.from('orders').insert({ user_id: userId, stripe_checkout_session_id: session.id, stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null, status: 'paid', total_cents: session.amount_total ?? 0, currency: session.currency ?? 'eur' }).select('id').single();
          if (orderError) throw orderError;
          const { error: itemError } = await db.from('order_items').insert({ order_id: order.id, product_id: productId, quantity: 1, unit_price_cents: session.amount_total ?? 0, license_type: licenseType });
          if (itemError) throw itemError;
          const key = `TT-${crypto.randomUUID().replaceAll('-', '').slice(0, 20).toUpperCase()}`;
          const { error: licenseError } = await db.from('licenses').insert({ user_id: userId, product_id: productId, order_id: order.id, license_key: key, license_type: licenseType, status: 'ACTIVE' });
          if (licenseError) throw licenseError;
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 }); }
}
