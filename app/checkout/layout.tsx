import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Захиалга өгөх",
  description: "Захиалгаа бүртгүүлж, хүргэлтийн хаяг болон төлбөрийн мэдээллээ оруулна уу.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
