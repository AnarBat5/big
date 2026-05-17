import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function requireUser() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { sb, user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { sb, user, error: null };
}

export async function GET() {
  const { sb, user, error } = await requireUser();
  if (error) return error;
  const { data, error: dbErr } = await sb!
    .from('addresses').select('*').eq('user_id', user!.id)
    .order('is_default', { ascending: false }).order('created_at', { ascending: false });
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const { sb, user, error } = await requireUser();
  if (error) return error;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { recipient, phone, district, detail } = body;
  if (!recipient || !phone || !district || !detail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (body.is_default) {
    await sb!.from('addresses').update({ is_default: false }).eq('user_id', user!.id);
  }
  const { data, error: dbErr } = await sb!.from('addresses').insert({
    user_id: user!.id,
    label:     String(body.label ?? ''),
    recipient: String(recipient),
    phone:     String(phone),
    district:  String(district),
    detail:    String(detail),
    is_default: !!body.is_default,
  }).select().single();
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const { sb, user, error } = await requireUser();
  if (error) return error;
  const url = new URL(request.url);
  const id = Number(url.searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const body = await request.json().catch(() => ({} as Record<string, unknown>));
  if (body.is_default === true) {
    await sb!.from('addresses').update({ is_default: false }).eq('user_id', user!.id);
  }
  const updates: Record<string, unknown> = {};
  ['label','recipient','phone','district','detail','is_default'].forEach((k) => {
    if (k in body) updates[k] = (body as Record<string, unknown>)[k];
  });
  const { error: dbErr } = await sb!.from('addresses').update(updates).eq('id', id).eq('user_id', user!.id);
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { sb, user, error } = await requireUser();
  if (error) return error;
  const url = new URL(request.url);
  const id = Number(url.searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error: dbErr } = await sb!.from('addresses').delete().eq('id', id).eq('user_id', user!.id);
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
