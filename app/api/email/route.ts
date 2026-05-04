import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function formatMNT(amount: number) {
  return amount.toLocaleString('mn-MN') + '₮';
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ skipped: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { order, type } = await request.json();

  const itemsHtml = Array.isArray(order.items)
    ? order.items
        .map(
          (i: { product: { name: string; price: number }; qty: number }) =>
            `<tr>
              <td style="padding:8px 0;border-bottom:1px solid #e8ddd0">${i.product?.name ?? 'Бүтээгдэхүүн'}</td>
              <td style="padding:8px 0;border-bottom:1px solid #e8ddd0;text-align:center">${i.qty}</td>
              <td style="padding:8px 0;border-bottom:1px solid #e8ddd0;text-align:right">${formatMNT((i.product?.price ?? 0) * i.qty)}</td>
            </tr>`
        )
        .join('')
    : '';

  const baseStyle = `font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#3d2c1e;`;

  if (type === 'new_order') {
    await Promise.all([
      // Admin notification
      resend.emails.send({
        from: 'BIG Дэлгүүр <no-reply@baganuurig.mn>',
        to: [process.env.ADMIN_EMAIL!],
        subject: `🛍 Шинэ захиалга #${order.id}`,
        html: `<div style="${baseStyle}">
          <h2 style="color:#7c5c3a">Шинэ захиалга ирлээ</h2>
          <p>Захиалгын дугаар: <strong>#${order.id}</strong></p>
          <p>Үйлчлүүлэгч: <strong>${order.customer_name}</strong> — ${order.customer_phone}</p>
          <p>Хаяг: ${order.district}, ${order.address}</p>
          <p>Төлбөр: ${order.payment_method === 'qpay' ? 'QPay' : 'Бэлэн мөнгө'}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemsHtml}</table>
          <p style="font-size:18px">Нийт: <strong>${formatMNT(order.total)}</strong></p>
        </div>`,
      }),
      // Customer confirmation
      resend.emails.send({
        from: 'Baganuur Investment Group <no-reply@baganuurig.mn>',
        to: [order.customer_email],
        subject: `Захиалга баталгаажлаа — #${order.id}`,
        html: `<div style="${baseStyle}">
          <h1 style="color:#7c5c3a;font-size:28px">Баярлалаа, ${order.customer_name}!</h1>
          <p>Таны захиалга амжилттай хүлээн авлаа.</p>
          <p>Захиалгын дугаар: <strong>#${order.id}</strong></p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemsHtml}</table>
          <p>Хүргэлт: <strong>${formatMNT(order.shipping)}</strong></p>
          <p style="font-size:18px">Нийт: <strong>${formatMNT(order.total)}</strong></p>
          <p style="margin-top:24px;color:#8a7060">Манай ажилтан тантай удахгүй холбогдох болно.</p>
          <p>Холбогдох: <a href="tel:+97699999999">+976 9999-9999</a></p>
        </div>`,
      }),
    ]);
  }

  if (type === 'payment_confirmed') {
    await resend.emails.send({
      from: 'Baganuur Investment Group <no-reply@baganuurig.mn>',
      to: [order.customer_email],
      subject: `Төлбөр баталгаажлаа — #${order.id}`,
      html: `<div style="${baseStyle}">
        <h1 style="color:#7c5c3a;font-size:28px">Төлбөр амжилттай!</h1>
        <p>Захиалгын дугаар: <strong>#${order.id}</strong></p>
        <p>Таны ${formatMNT(order.total)}-ийн төлбөр хүлээн авлаа.</p>
        <p style="margin-top:16px">Манай ажилтан тантай удахгүй холбогдох болно.</p>
      </div>`,
    });
  }

  return NextResponse.json({ success: true });
}
