import { NextResponse } from 'next/server';
import { createServerSupabase } from '../../../../lib/supabase-server';
import { createAdminSupabase } from '../../../../lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/login', req.url), 303);
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') return NextResponse.redirect(new URL('/dashboard', req.url), 303);

    const form = await req.formData();
    const productId = String(form.get('productId') || '');
    const description = String(form.get('description') || '').trim();
    const price = Number(form.get('price'));
    const stripePriceId = String(form.get('stripePriceId') || '').trim() || null;
    const published = form.get('published') === 'on';
    if (!productId || !Number.isFinite(price) || price < 0) return NextResponse.json({ error: 'Invalid product update' }, { status: 400 });
    if (published && (price <= 0 || !stripePriceId)) return NextResponse.json({ error: 'A published product needs a positive price and a Stripe Price ID' }, { status: 400 });

    const db = createAdminSupabase();
    const { error } = await db.from('products').update({ description, price_cents: Math.round(price * 100), stripe_price_id: stripePriceId, published }).eq('id', productId);
    if (error) throw error;
    return NextResponse.redirect(new URL('/admin', req.url), 303);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Could not update product' }, { status: 500 });
  }
}
