import { NextResponse } from "next/server";
import {
  getProductsWithNoRecentSales,
  applyProductDiscount,
} from "@/lib/marketing/levers";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await getProductsWithNoRecentSales(30);
    let discounted = 0;

    for (const product of products) {
      if (product.margin > 45) {
        await applyProductDiscount(product.id, 15);
        discounted++;
      } else if (product.margin > 35) {
        await applyProductDiscount(product.id, 8);
        discounted++;
      }
    }

    return NextResponse.json({ success: true, discounted });
  } catch (error) {
    console.error("Marketing clearance error:", error);
    return NextResponse.json(
      { error: "Failed to run clearance" },
      { status: 500 }
    );
  }
}
