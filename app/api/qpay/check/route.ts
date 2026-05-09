import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { checkPayment } from '@/lib/qpay';
import { sendPaymentConfirmedEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { invoiceId, orderId } = body as { invoiceId?: string; orderId?: string };
  if (!invoiceId || !orderId) {
    return NextResponse.json({ error: 'Missing invoiceId or orderId' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify the invoice actually belongs to this order before paying it.
  const { data: order } = await admin
    .from('orders')
    .select('id,total,status,qpay_invoice_id,customer_email,customer_name')
    .eq('id', orderId)
    .maybeSingle();

  if (!order || order.qpay_invoice_id !== invoiceId) {
    return NextResponse.json({ paid: false });
  }

  const { paid, amount } = await checkPayment(invoiceId);
  if (!paid || amount < order.total) {
    return NextResponse.json({ paid: false, amount });
  }

  if (order.status === 'Хүлээгдэж буй') {
    await admin.from('orders').update({ status: 'Төлбөр хийгдсэн' }).eq('id', orderId);
    sendPaymentConfirmedEmail(order).catch((err) =>
      console.error('Payment email error:', err)
    );
  }

  return NextResponse.json({ paid: true, amount });
}
