"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/store/QuantitySelector";
import type { Product } from "@/types";
import styles from "./page.module.css";

export default function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={styles.addToCart}>
      <QuantitySelector value={quantity} onChange={setQuantity} />
      <Button variant="primary" fullWidth>
        Add to Cart
      </Button>
    </div>
  );
}
