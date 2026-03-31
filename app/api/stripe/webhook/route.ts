import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type Stripe from "stripe";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = getSupabaseAdmin();

      // Parse items from metadata
      const cartItems: { id: string; qty: number }[] = JSON.parse(
        session.metadata?.product_ids ?? "[]"
      );

      // Fetch product details for order items
      const productIds = cartItems.map((i) => i.id);
      const { data: products } = await supabase
        .from("products")
        .select("id, name, price")
        .in("id", productIds);

      const productMap = new Map(
        (products ?? []).map((p) => [p.id, p])
      );

      // Calculate subtotal from validated prices
      let subtotal = 0;
      const orderItems = cartItems.map((item) => {
        const product = productMap.get(item.id);
        const unitPrice = product?.price ?? 0;
        const totalPrice = unitPrice * item.qty;
        subtotal += totalPrice;
        return {
          product_id: item.id,
          product_name: product?.name ?? "Unknown product",
          quantity: item.qty,
          unit_price: unitPrice,
          total_price: totalPrice,
        };
      });

      const shippingCost =
        (session.shipping_cost?.amount_total ?? 0) / 100;

      const shippingDetails = session.shipping_details;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          guest_email: session.customer_details?.email ?? null,
          status: "paid",
          stripe_session_id: session.id,
          stripe_payment_id: session.payment_intent as string,
          subtotal,
          shipping_cost: shippingCost,
          total: subtotal + shippingCost,
          shipping_name: shippingDetails?.name ?? null,
          shipping_address: shippingDetails?.address
            ? {
                line1: shippingDetails.address.line1,
                line2: shippingDetails.address.line2,
                city: shippingDetails.address.city,
                state: shippingDetails.address.state,
                zip: shippingDetails.address.postal_code,
                country: shippingDetails.address.country,
              }
            : null,
        })
        .select("id")
        .single();

      if (orderError) {
        console.error("Failed to create order:", orderError);
        return NextResponse.json({ received: true });
      }

      // Create order items
      const itemsWithOrderId = orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      await supabase.from("order_items").insert(itemsWithOrderId);

      // Send confirmation email
      const customerEmail = session.customer_details?.email;
      if (customerEmail && process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: process.env.FROM_EMAIL ?? "hello@couranr.com",
            to: customerEmail,
            subject: `Order Confirmed — Couranr #${order.id.slice(0, 8)}`,
            html: `
              <h1>Thank you for your order!</h1>
              <p>Hi ${session.customer_details?.name ?? "there"},</p>
              <p>Your order has been confirmed and is being processed. You'll receive a shipping notification once your items are on the way.</p>
              <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
              <p><strong>Total:</strong> $${(subtotal + shippingCost).toFixed(2)}</p>
              <p>Items will ship from our U.S. suppliers within 2–8 business days.</p>
              <p>— The Couranr Team</p>
            `,
          });
        } catch (emailErr) {
          console.error("Failed to send confirmation email:", emailErr);
        }
      }
    } catch (err) {
      console.error("Error processing webhook:", err);
    }
  }

  return NextResponse.json({ received: true });
}
