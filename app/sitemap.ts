import { MetadataRoute } from 'next';
import { initialProducts } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://baganuurig.mn';

  // Try to fetch products from API
  let products = initialProducts;
  try {
    const res = await fetch(`${base}/api/products`);
    if (res.ok) products = await res.json();
  } catch {}

  const productUrls = products.map((p: { id: string }) => ({
    url: `${base}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: base,            lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/shop`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...productUrls,
  ];
}
