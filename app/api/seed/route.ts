import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { initialProducts } from '@/lib/products';

export const runtime = 'nodejs';

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (initialProducts.length === 0) {
    return NextResponse.json(
      { error: 'No initial products to seed. Edit lib/products.ts.' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const rows = initialProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    category_name: p.categoryName,
    price: p.price,
    images: p.images,
    description: p.description,
    material: p.material,
    dimensions: p.dimensions,
    in_stock: p.inStock,
    featured: p.featured ?? false,
  }));

  const { error } = await admin.from('products').upsert(rows, { onConflict: 'id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag('products');
  return NextResponse.json({ success: true, seeded: rows.length });
}
