export type ProductContext = {
  contextString: string;
  productCount: number;
  generatedAt: Date;
};

let cachedContext: ProductContext | null = null;
let cacheExpiry: Date | null = null;

async function fetchProducts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("context-builder: Missing SUPABASE_URL or SERVICE_ROLE_KEY");
    return [];
  }

  // Direct REST API call — works reliably in all server contexts
  // (API routes, server components, cron jobs)
  const params = new URLSearchParams({
    select:
      "name,slug,description,price,compare_price,supplier,shipping_days_min,shipping_days_max,in_stock,below_margin,tags,category:categories(name,slug),images:product_images(url,is_primary)",
    order: "is_featured.desc",
    or: "(in_stock.eq.true,in_stock.is.null)",
  });

  const res = await fetch(`${supabaseUrl}/rest/v1/products?${params}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("context-builder: Supabase fetch failed", res.status, await res.text());
    return [];
  }

  const products = await res.json();

  // Filter out below_margin products in JS (handles null gracefully)
  const filtered = products.filter(
    (p: Record<string, unknown>) => p.below_margin !== true
  );

  console.log("context-builder DB response:", {
    total: products?.length,
    filtered: filtered?.length,
    first: filtered?.[0]?.name,
  });

  return filtered;
}

export async function buildProductContext(): Promise<string> {
  if (cachedContext && cacheExpiry && new Date() < cacheExpiry) {
    return cachedContext.contextString;
  }

  const products = await fetchProducts();

  if (!products || products.length === 0) {
    return "COURANR PRODUCT CATALOG — No products currently available.";
  }

  const contextString = `
COURANR PRODUCT CATALOG — ${new Date().toISOString()}
Total available products: ${products.length}

${products
  .map((p: Record<string, unknown>) => {
    const category = p.category as { name: string; slug: string } | null;
    const savings = p.compare_price ? `(was $${p.compare_price})` : "";
    return `
PRODUCT: ${p.name}
- Slug: ${p.slug}
- Price: $${p.price} ${savings}
- Category: ${category?.name ?? "Uncategorized"}
- Supplier: ${p.supplier} (US warehouse)
- Ships: ${(p.shipping_days_min as number) ?? 2}–${(p.shipping_days_max as number) ?? 8} business days
- Tags: ${(p.tags as string[])?.join(", ") ?? ""}
- Description: ${((p.description as string) ?? "").slice(0, 150)}...
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
