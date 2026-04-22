# Stelios product page updates — design spec

**Date:** 2026-04-22
**Status:** Draft for review
**Source:** WhatsApp messages from Stelios dated 15–18 Apr 2026

## Context

Stelios (business owner) has requested a set of small but interconnected changes to the product page and order flow. A review of the code revealed one critical bug that must be fixed in the same batch. This spec covers all items.

## Goals

1. Fix a pricing bug so Stripe charges the bundle price, not full price × quantity.
2. Communicate shipping/delivery as the default fulfillment option, with in-store pickup as a "by arrangement" secondary option.
3. Support mixed-color orders for multi-pack bundles, while keeping the form "simple enough for a 5-year-old".
4. Surface shipping details and a product how-to guide via a "Read more" link.
5. Update site copy so Kings Avenue Mall is described as a pickup-by-arrangement point, not a storefront.

## Non-goals

- No visual redesign of the product page — Stelios is happy with the current look.
- No changes to the product photography, pricing tiers, or existing color palette.
- No refactor of the i18n framework or other unrelated code.

---

## 1. Pricing bug fix (blocker)

### Problem

`app/api/checkout/route.ts` sends Stripe `unit_amount: PRICE * 100` with `quantity: <quantity>`. This charges the customer the full €6.99 × quantity instead of the discounted bundle price shown in the UI.

| Bundle | UI shows | Stripe charges today | Overcharge |
|---|---|---|---|
| 1x | €6.99 | €6.99 | €0.00 |
| 2x | €12.99 | €13.98 | €0.99 |
| 3x | €18.99 | €20.97 | €1.98 |
| 4x | €24.99 | €27.96 | €2.97 |

The webhook email (`app/api/webhook/route.ts`) and the success page display `session.amount_total`, so they currently show the (incorrect) overcharged total. Fixing the checkout fixes them automatically.

### Fix

In `app/api/checkout/route.ts`:

- Compute `bundleAmountCents = Math.round(bundle.price * 100)`.
- Send Stripe a single line item with:
  - `unit_amount: bundleAmountCents`
  - `quantity: 1`
  - `product_data.name: "EasyLaces Clip Bundle — {bundle.quantity}x (×{bundle.quantity * 4} clips)"`
  - `product_data.description`: updated to include color (or color mix string — see §3) and delivery or pickup detail.
- Keep the bundle quantity in `metadata.bundle_quantity` so the webhook and success page can display it.

### Webhook update

Update `app/api/webhook/route.ts` to read `meta.bundle_quantity` (fallback to `session.line_items[0].quantity` for legacy rows) and display "3x pack" as before. Add a row for delivery vs pickup + address/date.

### Success page

`app/order-success/*` shows quantity and total — keep as-is; they read from the Stripe session, which will now be correct.

---

## 2. Delivery vs pickup toggle (user decision: option B)

### Form shape

In `components/OrderForm.tsx`, add a mandatory two-option toggle **at the top of the form** (above Full Name), styled as two large pill buttons:

```
Fulfillment *
[ 🚚 Home Delivery ]  [ 🏬 Pickup by arrangement ]
```

Selecting one reveals the matching fields below and hides the other set:

- **Delivery** → reveal: Address line 1, City, Postal code, Country (default "Cyprus"). Hide pickup date.
- **Pickup by arrangement** → reveal: Preferred pickup date (existing field). Hide address fields. Show a short note: *"We'll contact you on WhatsApp to confirm a pickup time at Kings Avenue Mall."*

Default = `delivery` (it's the primary option now).

### Data model

Extend `OrderFormData` in `types/index.ts`:

```ts
export type FulfillmentMode = "delivery" | "pickup";

export interface OrderFormData {
  // existing fields...
  fulfillment: FulfillmentMode;
  // delivery-only:
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  // pickup-only (existing):
  pickupDate?: string;
  // shared:
  notes: string;
  // mixed-color string — see §3:
  colorMix?: string;
}
```

Pickup date becomes optional at the type level; validation is conditional on `fulfillment`.

### Pricing / shipping fee

Add a shipping cost constant in `types/index.ts`:

```ts
export const SHIPPING_FEE = 4.00;
```

Order total logic:

```
if (fulfillment === "delivery") {
  shippingFee = quantity === 4 ? 0 : SHIPPING_FEE;
} else {
  shippingFee = 0;
}
total = bundle.price + shippingFee;
```

Apply this total everywhere: the form's total display, the submit button label, and the Stripe checkout (shipping is sent as a second line item so it shows up on the receipt — *not* added to `unit_amount` of the product).

When `shippingFee > 0`, the Stripe session gets a second line item: `{ name: "Home Delivery (1–3 business days)", unit_amount: 400, quantity: 1 }`.

When `fulfillment === "delivery" && quantity === 4`, show a small green chip near the total: *"Shipping: FREE with 4x bundle"*.

### Validation

- `fulfillment` required (always).
- If delivery: `address`, `city`, `postalCode` required; `country` defaults to Cyprus and is editable.
- If pickup: `pickupDate` required and must be ≥ 4 working days from today (existing rule).
- Color/colorMix validation per §3.

### Server-side mirror

`app/api/checkout/route.ts` must re-validate the same conditional fields. If missing, return `MISSING_FIELDS` with the specific field name in the error.

---

## 3. Color selection + mixed colors (user decision: option A)

### Behavior

Move the color selection below the quantity selector (currently above it). The UI changes based on quantity:

- **Quantity = 1** → show the 4 color swatches as today. Single required pick.
- **Quantity ≥ 2** → hide swatches. Show a single text input:
  ```
  Choose your colors *
  [ placeholder: "e.g. 2 Black, 1 Grey, 1 White" ]
  ```
  Helper text below: *"Tell us how many packs of each color you want (total: {quantity} packs)."*

Switching quantity clears the other field automatically (e.g. going from 1x to 2x clears the single color pick; going from 3x back to 1x clears the text field).

### Data model

- `color`: used only when `quantity === 1`. Empty string otherwise.
- `colorMix`: used only when `quantity ≥ 2`. Empty string otherwise.

### Validation

- If `quantity === 1`: `color` required.
- If `quantity ≥ 2`: `colorMix` required, min length 3 characters, max length 200. No parsing — it's free-form text that the fulfillment team reads manually.

### Stripe / webhook propagation

- Product description and metadata include a single `color_label` field — either the swatch color name (e.g. "Black") or the raw mix string (e.g. "2 Black, 1 Grey, 1 White").
- Webhook email row labeled "Color / Mix" displays this.

### Event listener cleanup

`ProductSelector.tsx` dispatches `easylaces-select-color` when a color is clicked on the product card. That card no longer has color pickers (only bundle buttons). Remove the listener in `OrderForm.tsx` to avoid dead code. Keep `easylaces-select-bundle`.

---

## 4. "Read more" modal (user decision: option A — single modal, two sections)

### Trigger

Below the bundle list and above the "Add to Cart" button (actually: above the scroll-to-order buttons in `ProductSelector.tsx`), add a small info block:

```
🚚 Home Delivery (1–3 business days) — €4.00
[ Read more ]
```

Clicking "Read more" opens a modal.

The "FREE SHIPPING" label goes inside the 4x bundle card as a small teal chip next to the price.

### Modal content

Two tabs at the top: **Shipping info** | **How to use it**. Default = Shipping info.

**Shipping info tab:**

- "🚚 Home Delivery: 1–3 business days."
- "€4.00 flat fee for all orders. Free with the 4x bundle."
- "We ship anywhere in Cyprus. Contact us on WhatsApp for orders outside Cyprus."
- "🏬 Pickup by arrangement: available at Kings Avenue Mall, Paphos. Choose 'Pickup' at checkout and we'll confirm a time on WhatsApp."
- Returns/support line: "Questions? WhatsApp us: +357 97 661 053."

**How to use it tab:**

Three stacked image blocks with short captions:

1. **Step 1 — Lace it up**
   Image: `public/images/IMG_3300.JPG` (white laces, arrows show routing).
   Caption: "Thread your laces through the clip following the arrows."

2. **Step 2 — Done!**
   Image: `public/images/IMG_3299.JPG` (teal laces, same clip).
   Caption: "Once threaded, the clip holds your laces in place — no knots needed."

3. **Fits your laces**
   Image: `public/images/aea0c0da-0eb9-46cc-88a3-7aa83217eb76.JPG` (specs diagram).
   Caption: "Works with laces **5–6 mm wide** and up to **2 mm thick**. If needed, gently flatten the plastic tip with pliers for an easier fit."

### Image spec note

The new specs diagram says **5–6 mm wide**, but the current `features.fitDesc` in both locale files says **6–7 mm wide**. The spec diagram is the newer source of truth — update `features.fitDesc` to match ("5–6 mm wide"). Flag to Stelios if this was a typo in the diagram.

### Image housekeeping

Rename the uploaded images to meaningful filenames during implementation:

| Current filename | New filename |
|---|---|
| `IMG_3300.JPG` | `guide-step1-lace-routing.jpg` |
| `IMG_3299.JPG` | `guide-step2-final.jpg` |
| `aea0c0da-0eb9-46cc-88a3-7aa83217eb76.JPG` | `guide-lace-specs.jpg` |

### Modal implementation

- Client component `components/ShippingGuideModal.tsx`.
- Controlled by local state in `ProductSelector.tsx` (open/close + active tab).
- Uses framer-motion for fade/slide (consistent with existing animations).
- Closes on backdrop click, Esc key, and an × button.
- Trap focus inside the modal while open.
- Scrollable body on small screens; fixed max-height with `overflow-y: auto`.
- Accessible: `role="dialog"`, `aria-labelledby`, `aria-modal="true"`.

---

## 5. Location section: pickup-by-arrangement

### Changes to `components/StoreLocation.tsx`

- Section heading: change `location.title` from "Pick Up Your EasyLaces" to "Pickup by Arrangement" (EN) / "Παραλαβή Κατόπιν Συνεννόησης" (EL).
- Subtitle: change from "Visit us at Kings Avenue Mall" to "Available at Kings Avenue Mall, Paphos — by arrangement only."
- Remove the Opening Hours block (Mon–Sat / Sun). Store hours no longer apply; pickup is scheduled via WhatsApp.
- Keep: map embed, address, phone, WhatsApp CTA.
- Add one prominent line: *"We are not a physical store. Pickup is arranged on request — message us on WhatsApp to set a time."*

### Copy updates in `messages/en.json` + `messages/el.json`

- `location.title`, `location.subtitle` — per above.
- `meta.description`: replace "Available at Kings Avenue Mall, Paphos, Cyprus" with "Home delivery across Cyprus. Pickup at Kings Avenue Mall, Paphos by arrangement."
- `hero.subheadline`: update similarly (move from "Available at Kings Avenue Mall" to "Delivered across Cyprus in 1–3 days, or pickup at Kings Avenue Mall by arrangement").
- `order.pickupNote`: change from "In-store pickup only at Kings Avenue Mall, Paphos" to "Pickup at Kings Avenue Mall is by arrangement on WhatsApp."
- Remove unused keys: `location.hours`, `location.monSat`, `location.sun` (after confirming no other component reads them).

---

## 6. Header nav

`components/Header.tsx` has a nav link pointing to `#find-us` with label "Find Us". Change the label to "Pickup" (EN) / "Παραλαβή" (EL). Update `header.findUs` → rename to `header.pickup` and update the two locale files accordingly.

---

## Component-level changes summary

| File | Change |
|---|---|
| `types/index.ts` | Add `FulfillmentMode`, extend `OrderFormData`, add `SHIPPING_FEE` const. |
| `app/api/checkout/route.ts` | Use `bundle.price` as unit price; add shipping line item; validate conditional fields; propagate `fulfillment` + address/mix into metadata. |
| `app/api/webhook/route.ts` | Read new metadata fields; show color-mix, fulfillment, and address in email. |
| `components/ProductSelector.tsx` | Move/remove listeners for color events; add FREE SHIPPING chip on 4x; add delivery info block + "Read more" trigger before CTA. |
| `components/OrderForm.tsx` | Add fulfillment toggle, conditional fields, color-mix text input, conditional swatch/text UI, new validation, shipping fee in total. |
| `components/StoreLocation.tsx` | Rewrite copy; remove hours; add "by arrangement" messaging. |
| `components/Header.tsx` | Rename "Find Us" → "Pickup". |
| `components/ShippingGuideModal.tsx` | **New** — two-tab modal with shipping info + usage guide. |
| `messages/en.json`, `messages/el.json` | Update copy per §4, §5, §6; add new keys for modal, mix field, fulfillment toggle, free-shipping chip. |
| `public/images/` | Rename 3 new images to meaningful filenames. |

## Testing plan

Manual, in dev server:

1. **Pricing**: for each bundle 1x/2x/3x/4x, confirm Stripe test checkout charges the exact bundle price (+ €4 if delivery, + €0 if 4x delivery or pickup).
2. **Fulfillment toggle**: switch between delivery/pickup — correct fields show/hide, validation fires on the right ones only, total updates shipping fee correctly.
3. **Color mix**: switch quantity 1 ↔ 2 ↔ 3 ↔ 4 — UI flips swatches ↔ text input; previous value clears; validation flips accordingly.
4. **Modal**: opens on "Read more" click, tabs switch, closes on backdrop/Esc/×, images load.
5. **Mobile (iPhone SE width)**: fulfillment toggle wraps nicely, modal scrolls, images don't overflow.
6. **i18n**: switch to Greek — all new strings render in Greek.
7. **Webhook email**: place test orders, verify the email shows correct color/mix, fulfillment mode, address (if delivery), and pickup date (if pickup).
8. **Regression**: existing features (language toggle, cookie banner, reviews, scroll animations) unaffected.

## Out of scope / deferred

- A proper shipping-zones system (we use a flat €4 fee for Cyprus only; international handled via WhatsApp).
- A returns / refund policy page (can be added as a footer link later).
- Reworking the "How It Works" existing section — left as-is; the new usage guide lives in the modal.
- Moving pickup orders off the Stripe flow (still paid up-front for both modes).

## Open questions (for Stelios)

1. **Lace width in the spec image (5–6 mm) contradicts the current site copy (6–7 mm).** Which is right? I'll assume 5–6 mm until told otherwise.
2. **Delivery zone**: Cyprus-only confirmed? Or should the form allow other countries and we quote on WhatsApp?
3. **Shipping carrier / ETA wording**: keep "1–3 business days" as a hard promise? Or "usually 1–3 business days"?
