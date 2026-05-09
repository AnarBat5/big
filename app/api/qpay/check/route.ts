import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

async function getQPayToken(): Promise<string> {
  const user = process.env.QPAY_USERNAME;
  const pass = process.env.QPAY_PASSWORD;
  if (!user || !pass) throw new Error('QPay credentials not configured');

  const res = await fetch('https://merchant.qpay.mn/v2/auth/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('QPay auth failed');
  const { access_token } = await res.json();
  return access_token;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { invoiceId, orderId } = body;
  if (!invoiceId || !orderId) {
    return NextResponse.json({ error: 'Missing invoiceId or orderId' }, { status: 400 });
  }

  try {
    const token = await getQPayToken();
    const res = await fetch('https://merchant.qpay.mn/v2/payment/check', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ object_type: 'INVOICE', object_id: invoiceId }),
    });

    if (!res.ok) return NextResponse.json({ paid: false });

    const data = await res.json();
    const paid = (data.paid_amount ?? 0) > 0;

    if (paid) {
      const admin = createAdminClient();
      const { error } = await admin
        .from('orders')
        .update({ status: 'Төлбөр хийгдсэн' })
        .eq('id', orderId);
      if (error) console.error('Order status update failed:', error.message);
    }

    return NextResponse.json({ paid, amount: data.paid_amount ?? 0 });
  } catch (err) {
    console.error('QPay check error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ paid: false });
  }
}
