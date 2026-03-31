import { createServerClient } from "@/lib/supabase/server";

export type ProductContext = {
  contextString: string;
  productCount: number;
  generatedAt: Date;
};

let cachedContext: ProductContext | null = null;
let cacheExpiry: Date | null = null;

export async function buildProductContext(): Promise<string> {
  if (cachedContext && cacheExpiry && new Date() < cacheExpiry) {
    return cachedContext.contextString;
  }

  const supabase = createServerClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      name, slug, description, price, compare_price,
      supplier, shipping_days_min, shipping_days_max,
      in_stock, tags,
      category:categories(name, slug),
      images:product_images(url, is_primary)
    `
    )
    .eq("in_stock", true)
    .order("is_featured", { ascending: false });

  if (!products || products.length === 0) {
    return "COURANR PRODUCT CATALOG — No products currently available.";
  }

  const contextString = `
COURANR PRODUCT CATALOG — ${new Date().toISOString()}
Total available products: ${products.length}

${products
  .map((p) => {
    const category = p.category as unknown as { name: string; slug: string } | null;
    const savings = p.compare_price ? `(was $${p.compare_price})` : "";
    return `
PRODUCT: ${p.name}
- Slug: ${p.slug}
- Price: $${p.price} ${savings}
- Category: ${category?.name ?? "Uncategorized"}
- Supplier: ${p.supplier} (US warehouse)
- Ships: ${p.shipping_days_min ?? 2}–${p.shipping_days_max ?? 8} business days
- Tags: ${(p.tags as string[])?.join(", ") ?? ""}
- Description: ${(p.description as string)?.slice(0, 150) ?? ""}...
`;
  })
  .join("")}
`;

  const cacheMinutes = parseInt(
    process.env.AI_CONTEXT_CACHE_MINUTES ?? "5",
    10
  );
  cachedContext = {
    contextString,
    productCount: products.length,
    generatedAt: new Date(),
  };
  cacheExpiry = new Date(Date.now() + cacheMinutes * 60 * 1000);

  return contextString;
}
