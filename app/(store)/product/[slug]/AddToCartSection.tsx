"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/store/QuantitySelector";
import PriceAlert from "@/components/ai/PriceAlert";
import type { Product } from "@/types";
import styles from "./page.module.css";

export default function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(product, quantity);
    setQuantity(1);
  }

  return (
    <div className={styles.addToCart}>
      <QuantitySelector value={quantity} onChange={setQuantity} />
      <Button variant="primary" fullWidth onClick={handleAddToCart}>
        Add to Cart
      </Button>
      <PriceAlert productId={product.id} currentPrice={product.price} />
    </div>
  );
}
