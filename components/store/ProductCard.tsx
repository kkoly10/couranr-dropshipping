"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types";
import styles from "./ProductCard.module.css";

export type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

function isNew(product: Product): boolean {
  const createdAt = (product as Product & { created_at?: string }).created_at;
  if (!createdAt) return false;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return new Date(createdAt).getTime() > thirtyDaysAgo;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0];
  const secondaryImage = product.images.find((img) => !img.is_primary && img.sort_order === 1);
  const isBestSeller = product.tags?.includes("bestseller");
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.imageWrapper}>
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`${styles.image} ${styles.imagePrimary}`}
          />
        )}
        {secondaryImage && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.alt_text ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`${styles.image} ${styles.imageSecondary}`}
          />
        )}

        {/* Badges */}
        <div className={styles.badges}>
          {hasDiscount ? (
            <Badge variant="sale">Sale</Badge>
          ) : (
            isNew(product) && <Badge variant="new">New</Badge>
          )}
          {isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
        </div>

        {/* Add to cart overlay */}
        {onAddToCart && (
          <button
            className={styles.addToCart}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
          >
            Add to Cart
          </button>
        )}
      </Link>

      <div className={styles.info}>
        {product.category && (
          <span className={styles.category}>{product.category.name}</span>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className={styles.comparePrice}>
              {formatPrice(product.compare_price!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
