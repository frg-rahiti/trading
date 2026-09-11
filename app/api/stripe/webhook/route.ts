import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createAdminSupabase } from '../../../../lib/supabase-admin';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  return new Stripe(key);
}

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET is not configured');

    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      webhookSecret,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const productId = session.metadata?.product_id;

      if (userId && productId) {
        const db = createAdminSupabase();
        const { data: existing } = await db
          .from('orders')
          .select('id')
          .eq('stripe_checkout_session_id', session.id)
          .maybeSingle();

        if (!existing) {
          const { data: order, error: orderError } = await db.from('orders').insert({
            user_id: userId,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            status: 'paid',
            total_cents: session.amount_total ?? 0,
            currency: session.currency ?? 'eur',
          }).select('id').single();

          if (orderError) throw orderError;

          const { error: itemError } = await db.from('order_items').insert({
            order_id: order.id,
            product_id: productId,
            quantity: 1,
            unit_price_cents: session.amount_total ?? 0,
          });
          if (itemError) throw itemError;

          const key = `TT-${crypto.randomUUID().replaceAll('-', '').slice(0, 20).toUpperCase()}`;
          const { error: licenseError } = await db.from('licenses').insert({
            user_id: userId,
            product_id: productId,
            order_id: order.id,
            license_key: key,
            status: 'ACTIVE',
          });
          if (licenseError) throw licenseError;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
}
