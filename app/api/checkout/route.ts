import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabase } from '../../../lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      customer_email: user.email ?? undefined,
      metadata: { user_id: user.id, product_id: product.id },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Checkout could not be created' }, { status: 500 });
  }
}
