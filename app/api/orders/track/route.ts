import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id')?.trim().toUpperCase();
  const phone   = searchParams.get('phone')?.trim();

  if (!orderId || !phone) {
    return NextResponse.json({ error: 'Захиалгын дугаар болон утасны дугаар шаардлагатай' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('orders')
    .select('id, status, created_at, customer_name, items, subtotal, shipping, total, district, address')
    .eq('id', orderId)
    .eq('customer_phone', phone)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Захиалга олдсонгүй. Дугаар болон утасны дугаараа шалгана уу.' }, { status: 404 });
  }

  return NextResponse.json(data);
}
