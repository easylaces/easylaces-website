import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { COLORS, PRICE } from "@/types";
import type { CheckoutRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { fullName, email, phone, color, quantity, pickupDate, notes, locale } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !color || !quantity || !pickupDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find color name
    const colorObj = COLORS.find((c) => c.id === color);
    const colorName = colorObj
      ? colorObj.name[locale || "en"]
      : color;

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `EasyLaces Clip - ${colorName}`,
              description: `Color: ${colorName} | Pickup: ${pickupDate} | Kings Avenue Mall, Paphos`,
            },
            unit_amount: Math.round(PRICE * 100), // Stripe expects cents
          },
          quantity: quantity,
        },
      ],
      metadata: {
        customer_name: fullName,
        customer_phone: phone,
        color: color,
        color_name: colorName,
        pickup_date: pickupDate,
        notes: notes || "",
        locale: locale || "en",
      },
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order-cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
