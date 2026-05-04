import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

async function getQPayToken(): Promise<string> {
  const res = await fetch('https://merchant.qpay.mn/v2/auth/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.QPAY_USERNAME}:${process.env.QPAY_PASSWORD}`
        ).toString('base64'),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('QPay auth failed');
  const { access_token } = await res.json();
  return access_token;
}

export async function POST(request: Request) {
  const { invoiceId, orderId } = await request.json();
  if (!invoiceId || !orderId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
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
      await admin
        .from('orders')
        .update({ status: 'Төлбөр хийгдсэн' })
        .eq('id', orderId);
    }

    return NextResponse.json({ paid, amount: data.paid_amount ?? 0 });
  } catch (err) {
    console.error('QPay check error:', err);
    return NextResponse.json({ paid: false });
  }
}
