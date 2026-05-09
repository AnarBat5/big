import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendContactEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || !message) {
    return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (message.length > 2000 || name.length > 200) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from('messages').insert({ name, email, phone, message });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fire-and-forget admin notification
  sendContactEmail({ name, email, phone, message }).catch((err) =>
    console.error('Contact email error:', err instanceof Error ? err.message : err)
  );

  return NextResponse.json({ success: true });
}
