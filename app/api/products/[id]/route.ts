import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (user.email !== process.env.ADMIN_EMAIL) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { user };
}

function bust(id: string) {
  revalidateTag('products');
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath(`/product/${id}`);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const admin = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (body.name !== undefined)         updates.name = body.name;
  if (body.category !== undefined)     updates.category = body.category;
  if (body.categoryName !== undefined) updates.category_name = body.categoryName;
  if (body.price !== undefined)        updates.price = body.price;
  if (body.images !== undefined)       updates.images = body.images;
  if (body.description !== undefined)  updates.description = body.description;
  if (body.material !== undefined)     updates.material = body.material;
  if (body.dimensions !== undefined)   updates.dimensions = body.dimensions;
  if (body.inStock !== undefined)      updates.in_stock = body.inStock;
  if (body.featured !== undefined)     updates.featured = body.featured;

  const { data, error } = await admin
    .from('products')
    .update(updates)
    .eq('id', params.id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  bust(params.id);
  return NextResponse.json(data[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const admin = createAdminClient();
  const { error } = await admin.from('products').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  bust(params.id);
  return NextResponse.json({ success: true });
}
