import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

function generateOrderId() {
  return 'BG' + (Math.floor(Math.random() * 90000) + 10000);
}

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
  const body = await request.json();
  const admin = createAdminClient();
  const orderId = generateOrderId();

  // ── QPay invoice creation ────────────────────────────────────
  let qpayInvoiceId: string | null = null;
  let qpayQrText: string | null = null;
  let qpayUrls: unknown[] = [];

  if (body.payment === 'qpay' && process.env.QPAY_USERNAME) {
    try {
      const token = await getQPayToken();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
      const invoiceRes = await fetch('https://merchant.qpay.mn/v2/invoice', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice_code: process.env.QPAY_INVOICE_CODE,
          sender_invoice_no: orderId,
          invoice_receiver_code: body.customer.phone,
          invoice_description: `Baganuur Investment Group #${orderId}`,
          amount: body.total,
          callback_url: `${appUrl}/api/qpay/callback?orderId=${orderId}`,
        }),
      });
      if (invoiceRes.ok) {
        const inv = await invoiceRes.json();
        qpayInvoiceId = inv.invoice_id ?? null;
        qpayQrText = inv.qr_text ?? null;
        qpayUrls = inv.urls ?? [];
      }
    } catch (err) {
      console.error('QPay invoice error:', err);
    }
  }

  // ── Save order to Supabase ────────────────────────────────────
  const { data, error } = await admin
    .from('orders')
    .insert({
      id: orderId,
      customer_name: body.customer.name,
      customer_phone: body.customer.phone,
      customer_email: body.customer.email,
      district: body.address.district,
      address: body.address.detail,
      note: body.address.note ?? '',
      payment_method: body.payment,
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping,
      total: body.total,
      qpay_invoice_id: qpayInvoiceId,
      qpay_qr_text: qpayQrText,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // ── Send emails (fire-and-forget) ─────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    fetch(`${appUrl}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: data, type: 'new_order' }),
    }).catch(console.error);
  }

  return NextResponse.json(
    { orderId, qpayInvoiceId, qpayQrText, qpayUrls },
    { status: 201 }
  );
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
