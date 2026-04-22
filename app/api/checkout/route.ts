import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { COLORS, BUNDLES } from "@/types";
import type { CheckoutRequest } from "@/types";

function getMinPickupDate(): string {
  const date = new Date();
  let workingDays = 0;
  while (workingDays < 4) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) workingDays++;
  }
  return date.toISOString().split("T")[0];
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { fullName, email, phone, color, quantity, pickupDate, notes, locale } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !color || !quantity || !pickupDate) {
      return NextResponse.json(
        { error: "Missing required fields", code: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    // Validate pickup date is at least 4 working days from now
    const minDate = getMinPickupDate();
    if (pickupDate < minDate) {
      return NextResponse.json(
        { error: "Pickup date must be at least 4 working days from today", code: "DATE_TOO_EARLY" },
        { status: 400 }
      );
    }

    // Validate bundle exists
    const bundle = BUNDLES.find((b) => b.quantity === quantity);
    if (!bundle) {
      return NextResponse.json(
        { error: "Invalid quantity selected", code: "INVALID_QUANTITY" },
        { status: 400 }
      );
    }

    // Find color name
    const colorObj = COLORS.find((c) => c.id === color);
    if (!colorObj) {
      return NextResponse.json(
        { error: "Invalid color selected", code: "INVALID_COLOR" },
        { status: 400 }
      );
    }
    const colorName = colorObj.name[locale || "en"];

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
              name: `EasyLaces Clip Bundle — ${quantity}x pack (${quantity * 4} clips)`,
              description: `Color: ${colorName} | Pickup: ${pickupDate} | Kings Avenue Mall, Paphos`,
            },
            unit_amount: Math.round(bundle.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        customer_name: fullName,
        customer_phone: phone,
        color: color,
        color_name: colorName,
        bundle_quantity: String(quantity),
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

    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      const stripeCode = error.code || error.type;
      return NextResponse.json(
        {
          error: error.message,
          code: `STRIPE_${stripeCode?.toUpperCase() || "UNKNOWN"}`,
          type: error.type,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
