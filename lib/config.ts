export const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const QPAY_ENABLED =
  (process.env.NEXT_PUBLIC_QPAY_ENABLED ?? "").toLowerCase() === "true";
