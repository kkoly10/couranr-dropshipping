import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email, productId, currentPrice } = await req.json();

    if (!email || !productId || typeof currentPrice !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: email, productId, currentPrice" },
        { status: 400 }
      );
    }

    const targetPrice = Math.round(currentPrice * 0.9);
    const supabase = createServerClient();

    const { error } = await supabase.from("price_watches").insert({
      email,
      product_id: productId,
      target_price: targetPrice,
      current_price_at_watch: currentPrice,
      notified: false,
    });

    if (error) {
      console.error("Price watch insert error:", error);
      return NextResponse.json(
        { error: "Could not create price watch" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, targetPrice });
  } catch (err) {
    console.error("Price watch error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { email, productId } = await req.json();

    if (!email || !productId) {
      return NextResponse.json(
        { error: "Missing required fields: email, productId" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from("price_watches")
      .delete()
      .eq("email", email)
      .eq("product_id", productId);

    if (error) {
      console.error("Price watch delete error:", error);
      return NextResponse.json(
        { error: "Could not remove price watch" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Price watch delete error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
