import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Захиалга хайх",
  description: "Захиалгын дугаар болон утасны дугаараараа захиалгынхаа байдлыг шалгана уу.",
};

export default function OrderTrackingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
