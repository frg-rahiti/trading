import { NextResponse } from 'next/server';
import { createServerSupabase } from '../../../../../lib/supabase-server';
import { createAdminSupabase } from '../../../../../lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/login', req.url), 303);
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') return NextResponse.redirect(new URL('/dashboard', req.url), 303);

    const form = await req.formData();
    const licenseId = String(form.get('licenseId') || '');
    if (!licenseId) return NextResponse.json({ error: 'licenseId is required' }, { status: 400 });
    const db = createAdminSupabase();
    const { error } = await db.from('licenses').update({ status: 'REVOKED' }).eq('id', licenseId);
    if (error) throw error;
    return NextResponse.redirect(new URL('/admin', req.url), 303);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Could not revoke license' }, { status: 500 });
  }
}
