"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

export default function PurchaseTracker({
  value,
  transactionId,
}: {
  value: number;
  transactionId: string;
}) {
  useEffect(() => {
    trackPurchase({
      value,
      currency: "USD",
      transaction_id: transactionId,
    });
  }, [value, transactionId]);

  return null;
}
