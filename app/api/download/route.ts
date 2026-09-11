import { NextResponse } from 'next/server';
import { createServerSupabase } from '../../../lib/supabase-server';
import { createAdminSupabase } from '../../../lib/supabase-admin';

type FileType = 'EX5' | 'MQ5' | 'PINE' | 'DOC';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const body = await req.json() as { versionId?: string; fileType?: FileType };
    const { versionId, fileType } = body;
    if (!versionId || !['EX5', 'MQ5', 'PINE', 'DOC'].includes(fileType ?? '')) {
      return NextResponse.json({ error: 'Invalid download request' }, { status: 400 });
    }

    const { data: version } = await supabase
      .from('product_versions')
      .select('id,product_id,ex5_path,mq5_path,pine_path,documentation_path')
      .eq('id', versionId)
      .single();

    if (!version) return NextResponse.json({ error: 'Version not found' }, { status: 404 });

    const { data: license } = await supabase
      .from('licenses')
      .select('id,license_type,status')
      .eq('user_id', user.id)
      .eq('product_id', version.product_id)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!license) return NextResponse.json({ error: 'No active license for this product' }, { status: 403 });
    if (fileType === 'MQ5' && license.license_type !== 'DEVELOPER') {
      return NextResponse.json({ error: 'Developer license required' }, { status: 403 });
    }

    const path =
      fileType === 'EX5' ? version.ex5_path :
      fileType === 'MQ5' ? version.mq5_path :
      fileType === 'PINE' ? version.pine_path :
      version.documentation_path;

    if (!path) return NextResponse.json({ error: 'File unavailable' }, { status: 404 });

    const admin = createAdminSupabase();
    const { data: signed, error } = await admin.storage
      .from('product-files')
      .createSignedUrl(path, 300);

    if (error || !signed?.signedUrl) {
      return NextResponse.json({ error: 'Could not create download link' }, { status: 500 });
    }

    await admin.from('downloads').insert({
      user_id: user.id,
      license_id: license.id,
      version_id: version.id,
      file_type: fileType,
    });

    return NextResponse.json({ url: signed.signedUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
