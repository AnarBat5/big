import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, GIF allowed' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Max file size is 5MB' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() ?? 'jpg';
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from('products')
    .upload(filename, file, { contentType: file.type, upsert: false, cacheControl: '31536000' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = admin.storage.from('products').getPublicUrl(filename);
  return NextResponse.json({ url: publicUrl });
}
