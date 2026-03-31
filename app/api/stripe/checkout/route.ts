import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type CheckoutItem = {
  product_id: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: CheckoutItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate products exist in Supabase and get current prices
    const supabase = createServerComponentClient({ cookies });
    const productIds = items.map((item) => item.product_id);

    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price, in_stock")
      .in("id", productIds);

    if (error || !products) {
      return NextResponse.json(
        { error: "Failed to validate products" },
        { status: 500 }
      );
    }

    // Build a lookup map
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all items exist and are in stock
    const lineItems = [];
    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.product_id}` },
          { status: 400 }
        );
      }
      if (!product.in_stock) {
        return NextResponse.json(
          { error: `Product out of stock: ${product.name}` },
          { status: 400 }
        );
      }
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "afterpay_clearpay"],
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 8 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 599, currency: "usd" },
            display_name: "Standard shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 8 },
            },
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        product_ids: JSON.stringify(
          items.map((i) => ({ id: i.product_id, qty: i.quantity }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
