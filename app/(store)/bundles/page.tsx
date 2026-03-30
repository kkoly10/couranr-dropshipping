export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase/server";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Bundles & Kits | Couranr",
  description:
    "Save with curated desk setup and home organization bundles. Everything you need in one kit, shipped from the U.S.",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default async function BundlesPage() {
  const supabase = createServerClient();

  const { data: bundles } = await supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)")
    .eq("is_bundle", true)
    .eq("in_stock", true)
    .order("sort_order");

  const bundleList = (bundles as Product[]) ?? [];

  // Fetch bundle items for each bundle
  const bundleItems: Record<string, { product_name: string; quantity: number }[]> = {};
  if (bundleList.length > 0) {
    const { data: items } = await supabase
      .from("bundle_items")
      .select("bundle_id, quantity, product:products(name)")
      .in("bundle_id", bundleList.map((b) => b.id));

    if (items) {
      for (const item of items as unknown as { bundle_id: string; quantity: number; product: { name: string } | null }[]) {
        if (!bundleItems[item.bundle_id]) bundleItems[item.bundle_id] = [];
        bundleItems[item.bundle_id].push({
          product_name: item.product?.name ?? "Unknown product",
          quantity: item.quantity,
        });
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Bundles &amp; Kits</h1>
        <p className={styles.subtitle}>
          Curated sets designed to work together. Bundle and save on everything
          you need for your desk or home.
        </p>

        {bundleList.length === 0 ? (
          <p className={styles.empty}>No bundles available right now. Check back soon!</p>
        ) : (
          <div className={styles.grid}>
            {bundleList.map((bundle) => {
              const primaryImage = bundle.images.find((img) => img.is_primary) ?? bundle.images[0];
              const hasDiscount = bundle.compare_price && bundle.compare_price > bundle.price;
              const items = bundleItems[bundle.id] ?? [];

              return (
                <Link
                  key={bundle.id}
                  href={`/product/${bundle.slug}`}
                  className={styles.card}
                >
                  <div className={styles.imageWrapper}>
                    {primaryImage && (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt_text ?? bundle.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={styles.image}
                      />
                    )}
                    {hasDiscount && (
                      <div className={styles.badge}>
                        <Badge variant="sale">Save {formatPrice(bundle.compare_price! - bundle.price)}</Badge>
                      </div>
                    )}
                  </div>
                  <div className={styles.info}>
                    <h2 className={styles.name}>{bundle.name}</h2>
                    <div className={styles.pricing}>
                      <span className={styles.price}>{formatPrice(bundle.price)}</span>
                      {hasDiscount && (
                        <span className={styles.comparePrice}>
                          {formatPrice(bundle.compare_price!)}
                        </span>
                      )}
                    </div>
                    {bundle.description && (
                      <p className={styles.desc}>{bundle.description}</p>
                    )}
                    {items.length > 0 && (
                      <div className={styles.includes}>
                        <span className={styles.includesLabel}>What&apos;s included:</span>
                        <ul className={styles.includesList}>
                          {items.map((item, i) => (
                            <li key={i}>
                              {item.quantity > 1 ? `${item.quantity}x ` : ""}
                              {item.product_name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
