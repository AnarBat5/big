import { NextResponse } from 'next/server';
import { sendNewOrderEmails, sendPaymentConfirmedEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Internal helper endpoint kept for back-compat. New code calls
// the lib/email helpers directly to avoid extra Vercel invocations.
export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    return NextResponse.json({ skipped: true });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { order, type } = body as { order: Parameters<typeof sendNewOrderEmails>[0]; type: string };
  if (!order || !type) return NextResponse.json({ error: 'Missing order or type' }, { status: 400 });

  try {
    if (type === 'new_order') await sendNewOrderEmails(order);
    if (type === 'payment_confirmed') await sendPaymentConfirmedEmail(order);
  } catch (err) {
    console.error('Email send error:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ success: true });
}
