// QPay v2 helper. Returns null when QPay is not configured.

const BASE = "https://merchant.qpay.mn/v2";

export type QPayInvoice = {
  invoice_id: string;
  qr_text: string;
  urls: { name: string; description: string; logo: string; link: string }[];
};

export function isQPayConfigured(): boolean {
  return !!(
    process.env.QPAY_USERNAME &&
    process.env.QPAY_PASSWORD &&
    process.env.QPAY_INVOICE_CODE
  );
}

async function getToken(): Promise<string> {
  const user = process.env.QPAY_USERNAME!;
  const pass = process.env.QPAY_PASSWORD!;
  const res = await fetch(`${BASE}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${user}:${pass}`).toString("base64"),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`QPay auth failed (${res.status})`);
  const { access_token } = (await res.json()) as { access_token: string };
  if (!access_token) throw new Error("QPay token missing");
  return access_token;
}

export async function createInvoice(args: {
  orderId: string;
  amount: number;
  receiverPhone: string;
  description: string;
  callbackUrl: string;
}): Promise<QPayInvoice | null> {
  if (!isQPayConfigured()) return null;
  try {
    const token = await getToken();
    const res = await fetch(`${BASE}/invoice`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice_code: process.env.QPAY_INVOICE_CODE,
        sender_invoice_no: args.orderId,
        invoice_receiver_code: args.receiverPhone,
        invoice_description: args.description,
        amount: args.amount,
        callback_url: args.callbackUrl,
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<QPayInvoice>;
    if (!data.invoice_id || !data.qr_text) return null;
    return {
      invoice_id: data.invoice_id,
      qr_text: data.qr_text,
      urls: data.urls ?? [],
    };
  } catch (err) {
    console.error("QPay createInvoice error:", err);
    return null;
  }
}

export async function checkPayment(invoiceId: string): Promise<{ paid: boolean; amount: number }> {
  if (!isQPayConfigured()) return { paid: false, amount: 0 };
  try {
    const token = await getToken();
    const res = await fetch(`${BASE}/payment/check`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ object_type: "INVOICE", object_id: invoiceId }),
      cache: "no-store",
    });
    if (!res.ok) return { paid: false, amount: 0 };
    const data = (await res.json()) as { paid_amount?: number };
    const amount = data.paid_amount ?? 0;
    return { paid: amount > 0, amount };
  } catch (err) {
    console.error("QPay checkPayment error:", err);
    return { paid: false, amount: 0 };
  }
}
