import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { createInvoice, isQPayConfigured } from '@/lib/qpay';
import { sendNewOrderEmails } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PHONE_RE = /^\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PAYMENTS = new Set(['qpay', 'cod', 'bank']);

function generateOrderId(): string {
  return 'BG' + (Math.floor(Math.random() * 90000) + 10000);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  // Validate
  const name  = String(body.customer?.name  ?? '').trim();
  const phone = String(body.customer?.phone ?? '').replace(/\s/g, '');
  const email = String(body.customer?.email ?? '').trim();
  if (!name || !PHONE_RE.test(phone) || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid customer info' }, { status: 400 });
  }
  if (!body.address?.district || !body.address?.detail) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Order must have items' }, { status: 400 });
  }
  if (typeof body.total !== 'number' || body.total <= 0) {
    return NextResponse.json({ error: 'Invalid total' }, { status: 400 });
  }
  const payment = String(body.payment ?? 'cod');
  if (!VALID_PAYMENTS.has(payment)) {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
  }

  const admin = createAdminClient();
  const orderId = generateOrderId();

  // Create QPay invoice if requested
  let qpayInvoiceId: string | null = null;
  let qpayQrText: string | null = null;
  let qpayUrls: { name: string; description: string; logo: string; link: string }[] = [];

  if (payment === 'qpay' && isQPayConfigured()) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const invoice = await createInvoice({
      orderId,
      amount: body.total,
      receiverPhone: phone,
      description: `Baganuur Investment Group #${orderId}`,
      callbackUrl: `${appUrl}/api/qpay/callback?orderId=${orderId}`,
    });
    if (invoice) {
      qpayInvoiceId = invoice.invoice_id;
      qpayQrText = invoice.qr_text;
      qpayUrls = invoice.urls;
    }
  }

  // Persist order
  const { data, error } = await admin
    .from('orders')
    .insert({
      id: orderId,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      district: body.address.district,
      address: body.address.detail,
      note: body.address.note ?? '',
      payment_method: payment,
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

  // Decrement stock atomically (per item, via RPC)
  for (const item of body.items) {
    if (!item?.product?.id) continue;
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty <= 0) continue;
    const { error: rpcErr } = await admin.rpc('decrement_stock', {
      product_id: item.product.id,
      amount: qty,
    });
    if (rpcErr) console.error(`Stock decrement failed for ${item.product.id}:`, rpcErr.message);
  }

  // Send emails directly (don't waste a Vercel invocation on self-HTTP)
  sendNewOrderEmails(data).catch((err) =>
    console.error('Email send failed:', err instanceof Error ? err.message : err)
  );

  return NextResponse.json(
    { orderId, qpayInvoiceId, qpayQrText, qpayUrls },
    { status: 201 }
  );
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
