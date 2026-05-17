import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
  return NextResponse.json({ user: { id: user.id, email: user.email }, profile: data });
}

export async function PATCH(request: Request) {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({} as Record<string, unknown>));
  const updates: Record<string, unknown> = {};
  if ('full_name' in body) updates.full_name = String(body.full_name ?? '');
  if ('phone' in body) updates.phone = String(body.phone ?? '');
  if ('email_marketing' in body) updates.email_marketing = !!body.email_marketing;
  const { error } = await sb.from('profiles').update(updates).eq('id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
