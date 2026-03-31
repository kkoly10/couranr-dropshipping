"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/analytics";

export default function ViewContentTracker({
  name,
  id,
  price,
}: {
  name: string;
  id: string;
  price: number;
}) {
  useEffect(() => {
    trackViewContent({
      content_name: name,
      content_ids: [id],
      value: price,
      currency: "USD",
    });
  }, [name, id, price]);

  return null;
}
