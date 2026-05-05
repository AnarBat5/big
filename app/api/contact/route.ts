import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

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
  const { error } = await admin
    .from('messages')
    .insert({ name, email, phone, message });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fire-and-forget admin notification
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    resend.emails
      .send({
        from: 'BIG Холбогдох <no-reply@baganuurig.mn>',
        to: [process.env.ADMIN_EMAIL],
        replyTo: email,
        subject: `Шинэ зурвас — ${name}`,
        html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#3d2c1e">
          <h2 style="color:#7c5c3a">Шинэ холбоо барих зурвас</h2>
          <p><strong>Нэр:</strong> ${escapeHtml(name)}</p>
          <p><strong>Имэйл:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p><strong>Утас:</strong> ${escapeHtml(phone)}</p>` : ''}
          <p style="margin-top:16px;white-space:pre-wrap;border-left:3px solid #7c5c3a;padding-left:12px">${escapeHtml(message)}</p>
        </div>`,
      })
      .catch((err) => console.error('Contact email error:', err?.message ?? err));
  }

  return NextResponse.json({ success: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
