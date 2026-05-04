import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from('orders')
    .update({ status: 'Төлбөр хийгдсэн' })
    .eq('id', orderId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fire email confirmation
  const { data: order } = await admin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (order && appUrl) {
    fetch(`${appUrl}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, type: 'payment_confirmed' }),
    }).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
