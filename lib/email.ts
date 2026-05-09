import { Resend } from "resend";

type OrderItem = { product: { name: string; price: number }; qty: number };
type FullOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  district: string;
  address: string;
  payment_method: string;
  items: OrderItem[];
  shipping: number;
  total: number;
};
type PaymentEmailOrder = Pick<FullOrder, "id" | "customer_email" | "customer_name" | "total">;

const formatMNT = (n: number) => n.toLocaleString("mn-MN") + "₮";
const baseStyle = "font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#3d2c1e;";

function itemsTable(items: OrderItem[]): string {
  if (!Array.isArray(items)) return "";
  return items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e8ddd0">${i.product?.name ?? "Бүтээгдэхүүн"}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e8ddd0;text-align:center">${i.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e8ddd0;text-align:right">${formatMNT((i.product?.price ?? 0) * i.qty)}</td>
        </tr>`
    )
    .join("");
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM_NAME = process.env.EMAIL_FROM_NAME ?? "Baganuur Investment Group";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "no-reply@baganuurig.mn";
const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;

export async function sendNewOrderEmails(order: FullOrder): Promise<void> {
  const resend = getResend();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail) return;

  const items = itemsTable(order.items);
  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: [adminEmail],
      subject: `Шинэ захиалга #${order.id}`,
      html: `<div style="${baseStyle}">
        <h2 style="color:#7c5c3a">Шинэ захиалга ирлээ</h2>
        <p>Захиалгын дугаар: <strong>#${order.id}</strong></p>
        <p>Үйлчлүүлэгч: <strong>${order.customer_name}</strong> — ${order.customer_phone}</p>
        <p>Хаяг: ${order.district}, ${order.address}</p>
        <p>Төлбөр: ${order.payment_method === "qpay" ? "QPay" : order.payment_method === "bank" ? "Банкны шилжүүлэг" : "Бэлэн мөнгө"}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">${items}</table>
        <p style="font-size:18px">Нийт: <strong>${formatMNT(order.total)}</strong></p>
      </div>`,
    }),
    resend.emails.send({
      from: FROM,
      to: [order.customer_email],
      subject: `Захиалга баталгаажлаа — #${order.id}`,
      html: `<div style="${baseStyle}">
        <h1 style="color:#7c5c3a;font-size:28px">Баярлалаа, ${order.customer_name}!</h1>
        <p>Таны захиалга амжилттай хүлээн авлаа.</p>
        <p>Захиалгын дугаар: <strong>#${order.id}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">${items}</table>
        <p>Хүргэлт: <strong>${formatMNT(order.shipping)}</strong></p>
        <p style="font-size:18px">Нийт: <strong>${formatMNT(order.total)}</strong></p>
        <p style="margin-top:24px;color:#8a7060">Манай ажилтан тантай удахгүй холбогдох болно.</p>
      </div>`,
    }),
  ]);
}

export async function sendPaymentConfirmedEmail(order: PaymentEmailOrder): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
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

export async function sendContactEmail(args: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  const resend = getResend();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail) return;
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  await resend.emails.send({
    from: FROM,
    to: [adminEmail],
    replyTo: args.email,
    subject: `Шинэ зурвас — ${args.name}`,
    html: `<div style="${baseStyle}">
      <h2 style="color:#7c5c3a">Шинэ холбоо барих зурвас</h2>
      <p><strong>Нэр:</strong> ${escape(args.name)}</p>
      <p><strong>Имэйл:</strong> ${escape(args.email)}</p>
      ${args.phone ? `<p><strong>Утас:</strong> ${escape(args.phone)}</p>` : ""}
      <p style="margin-top:16px;white-space:pre-wrap;border-left:3px solid #7c5c3a;padding-left:12px">${escape(args.message)}</p>
    </div>`,
  });
}
