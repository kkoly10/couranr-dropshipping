import ProductCard from "./ProductCard";
import type { Product } from "@/types";
import styles from "./ProductGrid.module.css";

export type ProductGridProps = {
  products: Product[];
  onAddToCart?: (product: Product) => void;
};

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
