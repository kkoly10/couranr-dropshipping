import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ items: [] });
    }

    const { data, error } = await supabase
      .from("wishlists")
      .select(
        "*, product:products(*, images:product_images(*), category:categories(*))"
      )
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Wishlist fetch error:", error);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (err) {
    console.error("Wishlist GET error:", err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productId, currentPrice } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("wishlists").upsert(
      {
        user_id: session.user.id,
        product_id: productId,
        price_at_add: currentPrice,
      },
      { onConflict: "user_id,product_id" }
    );

    if (error) {
      console.error("Wishlist add error:", error);
      return NextResponse.json(
        { error: "Failed to add to wishlist" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Wishlist POST error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", session.user.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Wishlist remove error:", error);
      return NextResponse.json(
        { error: "Failed to remove from wishlist" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Wishlist DELETE error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
