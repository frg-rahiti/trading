import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabase } from '../../../lib/supabase-server';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  return new Stripe(key);
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { productId } = await req.json() as { productId?: string };
    if (!productId) return NextResponse.json({ error: 'productId is required' }, { status: 400 });

    const { data: product, error } = await supabase
      .from('products')
      .select('id,slug,name,published,price_cents,currency,stripe_price_id')
      .eq('id', productId)
      .eq('published', true)
      .single();

    if (error || !product) return NextResponse.json({ error: 'Product unavailable' }, { status: 404 });
    if (!product.stripe_price_id || product.price_cents <= 0) {
      return NextResponse.json({ error: 'This product is not configured for checkout yet' }, { status: 409 });
    }

    const stripe = getStripe();
    const origin = new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      customer_email: user.email ?? undefined,
      metadata: { user_id: user.id, product_id: product.id },
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/products/${product.slug}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('Checkout creation failed:', e);
    const message = e instanceof Stripe.errors.StripeError
      ? `Stripe: ${e.message}`
      : e instanceof Error
        ? e.message
        : 'Checkout could not be created';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
