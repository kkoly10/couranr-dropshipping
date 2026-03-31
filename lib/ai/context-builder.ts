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

  // Use select=* to avoid column-not-found errors — we don't know
  // the exact schema, so fetch everything and pick fields in JS
  const res = await fetch(`${supabaseUrl}/rest/v1/products?select=*`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("context-builder: Supabase fetch failed", res.status, body);
    return [];
  }

  const allProducts = await res.json();

  // Filter to in-stock products in JS (handles missing/null columns)
  const products = allProducts.filter(
    (p: Record<string, unknown>) => p.in_stock !== false
  );

  console.log("context-builder DB response:", {
    total: allProducts?.length,
    inStock: products?.length,
    first: products?.[0]?.name,
    columns: products?.[0] ? Object.keys(products[0]) : [],
  });

  return products;
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
    const savings = p.compare_price ? `(was $${p.compare_price})` : "";
    return `
PRODUCT: ${p.name}
- Slug: ${p.slug}
- Price: $${p.price} ${savings}
- Description: ${((p.description as string) ?? "").slice(0, 200)}
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
