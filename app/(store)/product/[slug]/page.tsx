export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import ProductImageGallery from "@/components/store/ProductImageGallery";
import ProductGrid from "@/components/store/ProductGrid";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types";
import styles from "./page.module.css";
import AddToCartSection from "./AddToCartSection";

type ProductPageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("slug", params.slug)
    .single();

  if (!product) return { title: "Product | Couranr" };

  const p = product as Product;
  return {
    title: p.meta_title ?? `${p.name} | Couranr`,
    description: p.meta_description ?? p.description ?? undefined,
    openGraph: {
      title: p.name,
      description: p.description ?? undefined,
      images: p.images?.[0] ? [p.images[0].url] : undefined,
      type: "website",
    },
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createServerClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)")
    .eq("slug", params.slug)
    .single();

  if (!product) notFound();

  const p = product as Product;

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)")
    .eq("category_id", p.category_id)
    .neq("id", p.id)
    .eq("in_stock", true)
    .limit(4);

  const hasDiscount = p.compare_price && p.compare_price > p.price;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.product}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <ProductImageGallery images={p.images} productName={p.name} />
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            {p.category && (
              <Badge variant="category">{p.category.name}</Badge>
            )}

            <h1 className={styles.name}>{p.name}</h1>

            <div className={styles.pricing}>
              <span className={styles.price}>{formatPrice(p.price)}</span>
              {hasDiscount && (
                <span className={styles.comparePrice}>
                  {formatPrice(p.compare_price!)}
                </span>
              )}
            </div>

            {p.description && (
              <div className={styles.description}>
                <p>{p.description}</p>
              </div>
            )}

            <AddToCartSection product={p} />

            <div className={styles.shipping}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Ships in 2–8 business days from the U.S.</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>You may also like</h2>
            <ProductGrid products={relatedProducts as Product[]} />
          </section>
        )}
      </div>
    </div>
  );
}
