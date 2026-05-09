import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
// Cache the products listing for 60s on the edge — drastically reduces
// Supabase round-trips while still letting admin updates appear quickly
// (admin actions also call revalidate on this path).
export const revalidate = 60;

function toFrontend(p: Record<string, unknown>) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    categoryName: p.category_name,
    price: p.price,
    images: p.images,
    description: p.description,
    material: p.material,
    dimensions: p.dimensions,
    inStock: p.in_stock,
    featured: p.featured,
  };
}

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json((data ?? []).map(toFrontend));
  } catch (err) {
    console.error('GET /api/products failed:', err instanceof Error ? err.message : err);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!body.name || typeof body.price !== 'number' || !body.category) {
    return NextResponse.json({ error: 'name, price and category are required' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from('products').insert({
    id: Date.now().toString(),
    name: body.name,
    category: body.category,
    category_name: body.categoryName ?? body.category,
    price: body.price,
    images: Array.isArray(body.images) ? body.images : [],
    description: body.description ?? '',
    material: body.material ?? '',
    dimensions: body.dimensions ?? '',
    in_stock: typeof body.inStock === 'number' ? body.inStock : 0,
    featured: body.featured ?? false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag('products');
  revalidatePath('/');
  revalidatePath('/shop');

  return NextResponse.json(toFrontend(data as Record<string, unknown>), { status: 201 });
}
