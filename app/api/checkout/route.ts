import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  COLORS,
  BUNDLES,
  SHIPPING_FEE,
  FREE_SHIPPING_BUNDLE,
} from "@/types";
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
    const {
      fullName,
      email,
      phone,
      color,
      colorMix,
      quantity,
      fulfillment,
      address,
      city,
      postalCode,
      pickupDate,
      notes,
      locale,
    } = body;

    // Base required fields
    if (!fullName || !email || !phone || !quantity || !fulfillment) {
      return NextResponse.json(
        { error: "Missing required fields", code: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    // Validate bundle
    const bundle = BUNDLES.find((b) => b.quantity === quantity);
    if (!bundle) {
      return NextResponse.json(
        { error: "Invalid quantity selected", code: "INVALID_QUANTITY" },
        { status: 400 }
      );
    }

    // Color vs color mix — conditional on quantity
    let colorLabel: string;
    if (quantity === 1) {
      const colorObj = COLORS.find((c) => c.id === color);
      if (!colorObj) {
        return NextResponse.json(
          { error: "Invalid color selected", code: "INVALID_COLOR" },
          { status: 400 }
        );
      }
      colorLabel = colorObj.name[locale || "en"];
    } else {
      const mix = (colorMix || "").trim();
      if (mix.length < 3) {
        return NextResponse.json(
          { error: "Color mix is required for multi-pack bundles", code: "MISSING_COLOR_MIX" },
          { status: 400 }
        );
      }
      if (mix.length > 300) {
        return NextResponse.json(
          { error: "Color mix is too long (max 300 characters)", code: "COLOR_MIX_TOO_LONG" },
          { status: 400 }
        );
      }
      colorLabel = mix;
    }

    // Fulfillment-specific validation
    if (fulfillment === "delivery") {
      if (!address?.trim() || !city?.trim() || !postalCode?.trim()) {
        return NextResponse.json(
          { error: "Missing delivery address fields", code: "MISSING_ADDRESS" },
          { status: 400 }
        );
      }
    } else if (fulfillment === "pickup") {
      if (!pickupDate) {
        return NextResponse.json(
          { error: "Pickup date is required", code: "MISSING_PICKUP_DATE" },
          { status: 400 }
        );
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
        return NextResponse.json(
          { error: "Pickup date must be in YYYY-MM-DD format", code: "INVALID_DATE_FORMAT" },
          { status: 400 }
        );
      }
      const minDate = getMinPickupDate();
      if (pickupDate < minDate) {
        return NextResponse.json(
          { error: "Pickup date must be at least 4 working days from today", code: "DATE_TOO_EARLY" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid fulfillment mode", code: "INVALID_FULFILLMENT" },
        { status: 400 }
      );
    }

    // Compute shipping
    const needsShippingFee =
      fulfillment === "delivery" && quantity !== FREE_SHIPPING_BUNDLE;

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `EasyLaces Clip Bundle — ${quantity}x pack (${quantity * 4} clips)`,
            description:
              fulfillment === "delivery"
                ? `Color: ${colorLabel} | Delivery to ${address}, ${city} ${postalCode}, Cyprus`
                : `Color: ${colorLabel} | Pickup: ${pickupDate} | Kings Avenue Mall, Paphos`,
          },
          unit_amount: Math.round(bundle.price * 100),
        },
        quantity: 1,
      },
    ];

    if (needsShippingFee) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Home Delivery (2–5 business days)",
          },
          unit_amount: Math.round(SHIPPING_FEE * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      metadata: {
        customer_name: fullName,
        customer_phone: phone,
        color_label: colorLabel,
        bundle_quantity: String(quantity),
        fulfillment,
        delivery_address:
          fulfillment === "delivery"
            ? `${address}, ${city} ${postalCode}, Cyprus`
            : "",
        pickup_date: fulfillment === "pickup" ? pickupDate : "",
        notes: (notes || "").slice(0, 500),
        locale: locale || "en",
      },
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order-cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

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
