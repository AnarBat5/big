import type { Metadata } from "next";
import { getProductById } from "@/lib/server/products";
import { formatPrice } from "@/lib/products";

export const revalidate = 60;

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) {
    return {
      title: "Бүтээгдэхүүн олдсонгүй",
      robots: { index: false, follow: false },
    };
  }
  const title = product.name;
  const description = `${product.categoryName} — ${product.material}. ${formatPrice(product.price)}. ${product.description}`.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: product.images.slice(0, 1).map((url) => ({ url })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  // JSON-LD product schema for Google
  const jsonLd = product && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    category: product.categoryName,
    brand: { "@type": "Brand", name: "Baganuur Investment Group" },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/product/${product.id}`,
      priceCurrency: "MNT",
      price: product.price,
      availability:
        product.inStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
