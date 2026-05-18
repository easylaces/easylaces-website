import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    const customerName = meta.customer_name || "N/A";
    const customerEmail = session.customer_email || "N/A";
    const customerPhone = meta.customer_phone || "N/A";
    const colorLabel = meta.color_label || meta.color_name || "N/A";
    const bundleQuantity = meta.bundle_quantity || "N/A";
    const fulfillment = meta.fulfillment || "pickup";
    const deliveryAddress = meta.delivery_address || "";
    const pickupDate = meta.pickup_date || "";
    const notes = meta.notes || "None";
    const total = session.amount_total
      ? `€${(session.amount_total / 100).toFixed(2)}`
      : "N/A";

    const fulfillmentLabel =
      fulfillment === "delivery" ? "🚚 Home Delivery" : "🏬 Pickup by arrangement";
    const fulfillmentDetail =
      fulfillment === "delivery"
        ? deliveryAddress || "N/A"
        : pickupDate || "N/A";

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: process.env.ORDER_NOTIFICATION_EMAIL!,
        subject: `🛒 New EasyLaces Order — ${customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px;">
              New Order Received!
            </h1>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Customer Name</td>
                <td style="padding: 12px 0; color: #555;">${escapeHtml(customerName)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Email</td>
                <td style="padding: 12px 0; color: #555;">${escapeHtml(customerEmail)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Phone / WhatsApp</td>
                <td style="padding: 12px 0; color: #555;">${escapeHtml(customerPhone)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Colors</td>
                <td style="padding: 12px 0; color: #555;">${escapeHtml(colorLabel)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Bundle</td>
                <td style="padding: 12px 0; color: #555;">${escapeHtml(String(bundleQuantity))}x pack</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Total Paid</td>
                <td style="padding: 12px 0; color: #2563EB; font-weight: bold; font-size: 18px;">${total}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Fulfillment</td>
                <td style="padding: 12px 0; color: #555;">${fulfillmentLabel}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">${fulfillment === "delivery" ? "Delivery Address" : "Pickup Date"}</td>
                <td style="padding: 12px 0; color: #555;">${escapeHtml(fulfillmentDetail)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Notes</td>
                <td style="padding: 12px 0; color: #555;">${escapeHtml(notes)}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 15px; background-color: #f0f7ff; border-radius: 8px;">
              <p style="margin: 0; color: #333; font-size: 14px;">
                ${
                  fulfillment === "delivery"
                    ? "<strong>Action:</strong> Ship to the delivery address above within 4 days."
                    : "<strong>Action:</strong> Confirm pickup time with the customer on WhatsApp."
                }
              </p>
            </div>

            <p style="margin-top: 20px; color: #999; font-size: 12px;">
              This is an automated notification from EasyLaces.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send order notification email:", emailError);
    }
  }

  return NextResponse.json({ received: true });
}
