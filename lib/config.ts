export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#E8DDC9"/>
      <text x="50%" y="50%" font-family="Georgia,serif" font-size="20" fill="#8B7355"
        text-anchor="middle" dominant-baseline="middle">Зураг алга</text>
    </svg>`
  );

export const QPAY_ENABLED =
  (process.env.NEXT_PUBLIC_QPAY_ENABLED ?? "").toLowerCase() === "true";
