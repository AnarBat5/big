import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json([]);
  const { data, error } = await sb.from('wishlist_items').select('product_id').eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((r) => r.product_id));
}

export async function POST(request: Request) {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const productId = body?.productId;
  if (!productId || typeof productId !== 'string') {
    return NextResponse.json({ error: 'productId required' }, { status: 400 });
  }
  const { error } = await sb.from('wishlist_items').upsert({ user_id: user.id, product_id: productId });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });
  const { error } = await sb.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', productId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
