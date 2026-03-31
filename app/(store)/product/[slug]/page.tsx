export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveDiscount, applyDiscount } from "@/lib/marketing/get-discount";
import ProductImageGallery from "@/components/store/ProductImageGallery";
import ProductGrid from "@/components/store/ProductGrid";
import Badge from "@/components/ui/Badge";
import SupplierBadge from "@/components/store/SupplierBadge";
import type { Product } from "@/types";
import styles from "./page.module.css";
import AddToCartSection from "./AddToCartSection";
import WishlistButton from "@/components/ai/WishlistButton";

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

  const promoDiscount = await getActiveDiscount(p.id, p.category_id ?? undefined);
  const promoPrice = promoDiscount > 0 ? applyDiscount(p.price, promoDiscount) : null;

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

            <div className={styles.nameRow}>
              <h1 className={styles.name}>{p.name}</h1>
              <WishlistButton productId={p.id} currentPrice={p.price} />
            </div>

            <div className={styles.pricing}>
              {promoPrice !== null ? (
                <>
                  <span className={styles.price}>{formatPrice(promoPrice)}</span>
                  <span className={styles.comparePrice}>
                    {formatPrice(p.price)}
                  </span>
                </>
              ) : (
                <>
                  <span className={styles.price}>{formatPrice(p.price)}</span>
                  {hasDiscount && (
                    <span className={styles.comparePrice}>
                      {formatPrice(p.compare_price!)}
                    </span>
                  )}
                </>
              )}
            </div>
            {promoDiscount > 0 && (
              <div className={styles.promoBadge}>
                {promoDiscount}% off — limited time
              </div>
            )}

            {p.description && (
              <div className={styles.description}>
                <p>{p.description}</p>
              </div>
            )}

            <AddToCartSection product={p} />

            <SupplierBadge
              supplier={p.supplier}
              shippingDaysMin={p.shipping_days_min}
              shippingDaysMax={p.shipping_days_max}
            />
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
