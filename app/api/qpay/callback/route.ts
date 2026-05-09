import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { checkPayment } from '@/lib/qpay';
import { sendPaymentConfirmedEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// QPay calls this endpoint after a successful payment.
// We don't trust the call alone — we verify with QPay's API before
// flipping the order status (otherwise anyone could spoof payments).
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

  const admin = createAdminClient();

  const { data: order, error: fetchErr } = await admin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (fetchErr || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (!order.qpay_invoice_id) {
    return NextResponse.json({ error: 'Order has no QPay invoice' }, { status: 400 });
  }

  // Re-verify with QPay
  const { paid, amount } = await checkPayment(order.qpay_invoice_id);
  if (!paid || amount < order.total) {
    return NextResponse.json({ paid: false }, { status: 200 });
  }

  // Idempotent: only update + email when status is still pending
  if (order.status === 'Хүлээгдэж буй') {
    const { error: updateErr } = await admin
      .from('orders')
      .update({ status: 'Төлбөр хийгдсэн' })
      .eq('id', orderId);
    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    sendPaymentConfirmedEmail({ ...order, status: 'Төлбөр хийгдсэн' }).catch((err) =>
      console.error('Payment email error:', err)
    );
  }

  return NextResponse.json({ paid: true });
}

// Allow GET as well (some QPay configurations call back via GET)
export const GET = POST;
