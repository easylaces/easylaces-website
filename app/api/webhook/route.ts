import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const colorName = meta.color_name || "N/A";
    const pickupDate = meta.pickup_date || "N/A";
    const notes = meta.notes || "None";
    const quantity = meta.bundle_quantity || session.line_items?.data?.[0]?.quantity || "N/A";
    const total = session.amount_total
      ? `€${(session.amount_total / 100).toFixed(2)}`
      : "N/A";

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
                <td style="padding: 12px 0; color: #555;">${customerName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Email</td>
                <td style="padding: 12px 0; color: #555;">${customerEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Phone / WhatsApp</td>
                <td style="padding: 12px 0; color: #555;">${customerPhone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Color</td>
                <td style="padding: 12px 0; color: #555;">${colorName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Quantity</td>
                <td style="padding: 12px 0; color: #555;">${quantity}x pack</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Total Paid</td>
                <td style="padding: 12px 0; color: #2563EB; font-weight: bold; font-size: 18px;">${total}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Pickup Date</td>
                <td style="padding: 12px 0; color: #555;">${pickupDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #333;">Notes</td>
                <td style="padding: 12px 0; color: #555;">${notes}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 15px; background-color: #f0f7ff; border-radius: 8px;">
              <p style="margin: 0; color: #333; font-size: 14px;">
                <strong>Pickup Location:</strong> Kings Avenue Mall, Paphos, Cyprus
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
