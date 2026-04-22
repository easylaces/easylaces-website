# Stelios Product Page Updates — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Stelios's product-page update batch — fix Stripe bundle-pricing bug, add home-delivery vs pickup flow (with €4 fee, free on 4x), add mixed-color support for multi-pack bundles, add a "Read more" modal with shipping info + product usage guide, and rework the location section from "visit us" to "pickup by arrangement".

**Architecture:** Next.js 14 app with client components and two API routes (Stripe checkout + webhook). All new copy flows through the existing `useI18n()` hook. No new libraries. Modal is a local React component with framer-motion animations, consistent with existing components. Pricing/shipping logic centralized in `types/index.ts` constants and applied both in the form (display) and the checkout route (source of truth for Stripe).

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, framer-motion, Stripe SDK, Resend (email), react 18.

**Spec reference:** `docs/superpowers/specs/2026-04-22-stelios-product-updates-design.md`

---

## File structure

| File | Role | Action |
|---|---|---|
| `types/index.ts` | Types + constants (bundles, colors, fulfillment mode, shipping fee) | Modify |
| `messages/en.json` | English i18n strings | Modify |
| `messages/el.json` | Greek i18n strings | Modify |
| `app/api/checkout/route.ts` | Stripe checkout session creator | Modify |
| `app/api/webhook/route.ts` | Stripe webhook → order email | Modify |
| `components/Header.tsx` | Top nav | Modify |
| `components/StoreLocation.tsx` | Location section (pickup info) | Modify |
| `components/ProductSelector.tsx` | Bundle cards + delivery info + modal trigger | Modify |
| `components/OrderForm.tsx` | Checkout form | Modify |
| `components/ShippingGuideModal.tsx` | Modal with shipping + usage tabs | Create |
| `public/images/IMG_3299.JPG` → `guide-step2-final.jpg` | Step 2 guide image | Rename |
| `public/images/IMG_3300.JPG` → `guide-step1-lace-routing.jpg` | Step 1 guide image | Rename |
| `public/images/aea0c0da-…JPG` → `guide-lace-specs.jpg` | Specs diagram | Rename |

### Verification strategy

The project has no test framework. Each task's verification step uses:
- `npm run build` — TypeScript compile + Next.js production build (catches type errors, dead i18n keys, broken imports).
- Manual browser smoke tests at `http://localhost:3000` (`npm run dev`).
- Stripe test-mode checkout runs for pricing-sensitive tasks.

---

## Task 1: Rename product-guide images

**Files:**
- Rename: `public/images/IMG_3300.JPG` → `public/images/guide-step1-lace-routing.jpg`
- Rename: `public/images/IMG_3299.JPG` → `public/images/guide-step2-final.jpg`
- Rename: `public/images/aea0c0da-0eb9-46cc-88a3-7aa83217eb76.JPG` → `public/images/guide-lace-specs.jpg`

- [ ] **Step 1: Rename images via git mv**

```bash
cd /Users/andrea/Desktop/Progect/EasyLaces
git mv public/images/IMG_3300.JPG public/images/guide-step1-lace-routing.jpg
git mv public/images/IMG_3299.JPG public/images/guide-step2-final.jpg
git mv public/images/aea0c0da-0eb9-46cc-88a3-7aa83217eb76.JPG public/images/guide-lace-specs.jpg
```

- [ ] **Step 2: Verify renames**

Run: `ls public/images/ | grep guide-`
Expected: 3 files listed (`guide-lace-specs.jpg`, `guide-step1-lace-routing.jpg`, `guide-step2-final.jpg`).

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: rename product guide images to meaningful names"
```

---

## Task 2: Fix Stripe bundle pricing bug

**Files:**
- Modify: `app/api/checkout/route.ts`

This task fixes the revenue bug in isolation. Fulfillment/shipping fee are added in a later task — do not couple them here. The checkout currently only supports pickup; keep that until the fulfillment toggle lands.

- [ ] **Step 1: Replace the Stripe line-items block**

In `app/api/checkout/route.ts`, locate the `stripe.checkout.sessions.create({...})` call and replace the `line_items` array. Before:

```ts
line_items: [
  {
    price_data: {
      currency: "eur",
      product_data: {
        name: `EasyLaces Clip - ${colorName}`,
        description: `Color: ${colorName} | Pickup: ${pickupDate} | Kings Avenue Mall, Paphos`,
      },
      unit_amount: Math.round(PRICE * 100),
    },
    quantity: quantity,
  },
],
```

After:

```ts
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
```

- [ ] **Step 2: Add bundle_quantity to metadata**

Inside the same `sessions.create({...})` call, update the `metadata` object. Before:

```ts
metadata: {
  customer_name: fullName,
  customer_phone: phone,
  color: color,
  color_name: colorName,
  pickup_date: pickupDate,
  notes: notes || "",
  locale: locale || "en",
},
```

After:

```ts
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
```

- [ ] **Step 3: Remove unused PRICE import**

At the top of `app/api/checkout/route.ts`, the import line is:

```ts
import { COLORS, BUNDLES, PRICE } from "@/types";
```

Change to:

```ts
import { COLORS, BUNDLES } from "@/types";
```

- [ ] **Step 4: Update webhook to read bundle_quantity**

In `app/api/webhook/route.ts`, locate the quantity extraction around line 39:

```ts
const quantity = session.line_items?.data?.[0]?.quantity || "N/A";
```

Replace with:

```ts
const quantity = meta.bundle_quantity || session.line_items?.data?.[0]?.quantity || "N/A";
```

(We still fall back to the line-item quantity for any orders placed before this deploy.)

Also, one row down the email still renders `${quantity}x pack` — leave that line as-is; the new value of `quantity` is the bundle size.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds. No TS errors.

- [ ] **Step 6: Manually test Stripe pricing (test mode)**

Run: `npm run dev`. In the browser at `http://localhost:3000`:

1. Scroll to the order form. Select a 2x bundle. Fill form. Submit.
2. On the Stripe-hosted checkout page, verify the line item shows `EasyLaces Clip Bundle — 2x pack (8 clips)` at €12.99.
3. Repeat for 3x (€18.99) and 4x (€24.99).

Expected: each bundle's Stripe total matches the UI total exactly.

- [ ] **Step 7: Commit**

```bash
git add app/api/checkout/route.ts app/api/webhook/route.ts
git commit -m "fix: use bundle price as Stripe unit_amount instead of PRICE x quantity"
```

---

## Task 3: Add new i18n strings (English)

**Files:**
- Modify: `messages/en.json`

TypeScript derives the `TranslationKey` union from `en.json` (`lib/i18n.tsx:10-22`). Adding keys here first is required; `el.json` gets mirrored in the next task.

- [ ] **Step 1: Update existing keys in en.json**

Open `messages/en.json` and apply these edits:

In `meta.description`, replace the whole value with:

```
"Home delivery across Cyprus in 2–5 business days. Pickup at Kings Avenue Mall, Paphos by arrangement."
```

In `hero.subheadline`, replace:

```
"Delivered across Cyprus in 2–5 business days, or pickup at Kings Avenue Mall by arrangement."
```

In `header`, rename the key `findUs` → `pickup` with value:

```
"Pickup"
```

(remove the old `findUs` entry)

In `features.fitDesc`, replace the whole value with:

```
"Designed for laces 5–6 mm wide and up to 2 mm thick — fits most sneakers and sports shoes."
```

In `location.title`, replace with:

```
"Pickup by Arrangement"
```

In `location.subtitle`, replace with:

```
"Available at Kings Avenue Mall, Paphos — by arrangement only."
```

Remove the keys `location.hours`, `location.monSat`, `location.sun` (they will no longer be referenced).

In `order.pickupNote`, replace with:

```
"Pickup at Kings Avenue Mall is by arrangement on WhatsApp."
```

- [ ] **Step 2: Add new `location` keys**

Inside the `"location": { ... }` block, add:

```json
"notAStore": "We are not a physical store. Pickup is arranged on request — message us on WhatsApp to set a time."
```

- [ ] **Step 3: Add new `order` keys for fulfillment toggle + address + color mix**

Inside the `"order": { ... }` block, add:

```json
"fulfillmentLabel": "How would you like to receive your order?",
"deliveryOption": "Home Delivery",
"deliveryOptionDesc": "2–5 business days (Cyprus)",
"pickupOption": "Pickup by arrangement",
"pickupOptionDesc": "Kings Avenue Mall, Paphos",
"addressLabel": "Delivery Address",
"addressPlaceholder": "Street name and number",
"cityLabel": "City",
"postalCodeLabel": "Postal Code",
"countryLabel": "Country",
"pickupConfirmNote": "We'll contact you on WhatsApp to confirm a pickup time.",
"colorMixLabel": "Choose your colors",
"colorMixPlaceholder": "e.g. 2 Black, 1 Grey, 1 White",
"colorMixHelper": "Tell us how many packs of each color you want (total: {count} packs).",
"shippingFeeLabel": "Shipping",
"freeShippingChip": "FREE shipping with 4x",
"addressRequired": "Please enter a delivery address",
"cityRequired": "Please enter a city",
"postalCodeRequired": "Please enter a postal code",
"colorMixRequired": "Please describe your color selection",
"colorMixTooShort": "Please give a bit more detail (at least 3 characters)"
```

- [ ] **Step 4: Add new `product` keys for delivery info block**

Inside the `"product": { ... }` block, add:

```json
"deliveryInfo": "🚚 Home Delivery (2–5 business days) — €4.00",
"freeShippingBadge": "FREE SHIPPING",
"readMore": "Read more"
```

- [ ] **Step 5: Add the `modal` top-level block**

After the `"whatsapp"` block (or anywhere at the top level — JSON order does not matter), add:

```json
"modal": {
  "title": "Shipping & Usage Guide",
  "close": "Close",
  "tabShipping": "Shipping info",
  "tabHowTo": "How to use it",
  "shippingBullet1": "🚚 Home Delivery: 2–5 business days.",
  "shippingBullet2": "€4.00 flat fee for all orders. Free with the 4x bundle.",
  "shippingBullet3": "Delivery across Cyprus only.",
  "shippingBullet4": "🏬 Pickup by arrangement: available at Kings Avenue Mall, Paphos. Choose 'Pickup' at checkout and we'll confirm a time on WhatsApp.",
  "shippingBullet5": "Questions? WhatsApp us: +357 97 661 053.",
  "step1Title": "Step 1 — Lace it up",
  "step1Desc": "Thread your laces through the clip following the arrows.",
  "step2Title": "Step 2 — Done!",
  "step2Desc": "Once threaded, the clip holds your laces in place — no knots needed.",
  "fitTitle": "Fits your laces",
  "fitDesc": "Works with laces 5–6 mm wide and up to 2 mm thick. If needed, gently flatten the plastic tip with pliers for an easier fit."
}
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build succeeds. (TypeScript validates JSON shape via `Messages = typeof en`.)

- [ ] **Step 7: Commit**

```bash
git add messages/en.json
git commit -m "feat(i18n): add English copy for fulfillment, color mix, and guide modal"
```

---

## Task 4: Mirror new i18n strings to Greek

**Files:**
- Modify: `messages/el.json`

`el.json` must match the shape of `en.json` exactly or `getNestedValue` will return raw keys as fallback. Same edits, translated.

- [ ] **Step 1: Update existing keys in el.json**

In `messages/el.json`:

`meta.description`:
```
"Παράδοση στο σπίτι σε όλη την Κύπρο σε 2–5 εργάσιμες ημέρες. Παραλαβή από το Kings Avenue Mall, Πάφος, κατόπιν συνεννόησης."
```

`hero.subheadline`:
```
"Παράδοση σε όλη την Κύπρο σε 2–5 εργάσιμες ημέρες, ή παραλαβή από το Kings Avenue Mall κατόπιν συνεννόησης."
```

In `header`, rename `findUs` → `pickup` with value:
```
"Παραλαβή"
```

`features.fitDesc`:
```
"Σχεδιασμένο για κορδόνια πλάτους 5–6 mm και πάχους έως 2 mm — ταιριάζει στα περισσότερα αθλητικά παπούτσια."
```

`location.title`:
```
"Παραλαβή Κατόπιν Συνεννόησης"
```

`location.subtitle`:
```
"Διαθέσιμο στο Kings Avenue Mall, Πάφος — κατόπιν συνεννόησης."
```

Remove `location.hours`, `location.monSat`, `location.sun`.

`order.pickupNote`:
```
"Η παραλαβή από το Kings Avenue Mall γίνεται κατόπιν συνεννόησης μέσω WhatsApp."
```

- [ ] **Step 2: Add new `location.notAStore` key**

```json
"notAStore": "Δεν είμαστε φυσικό κατάστημα. Η παραλαβή γίνεται κατόπιν αιτήματος — γράψτε μας στο WhatsApp για να κλείσουμε ραντεβού."
```

- [ ] **Step 3: Add new `order` keys**

```json
"fulfillmentLabel": "Πώς θέλεις να λάβεις την παραγγελία σου;",
"deliveryOption": "Παράδοση στο Σπίτι",
"deliveryOptionDesc": "2–5 εργάσιμες ημέρες (Κύπρος)",
"pickupOption": "Παραλαβή κατόπιν συνεννόησης",
"pickupOptionDesc": "Kings Avenue Mall, Πάφος",
"addressLabel": "Διεύθυνση Παράδοσης",
"addressPlaceholder": "Οδός και αριθμός",
"cityLabel": "Πόλη",
"postalCodeLabel": "Ταχ. Κώδικας",
"countryLabel": "Χώρα",
"pickupConfirmNote": "Θα επικοινωνήσουμε μαζί σου μέσω WhatsApp για να κλείσουμε ώρα παραλαβής.",
"colorMixLabel": "Επίλεξε τα χρώματά σου",
"colorMixPlaceholder": "π.χ. 2 Μαύρο, 1 Γκρι, 1 Λευκό",
"colorMixHelper": "Πες μας πόσα πακέτα θέλεις από κάθε χρώμα (σύνολο: {count} πακέτα).",
"shippingFeeLabel": "Μεταφορικά",
"freeShippingChip": "ΔΩΡΕΑΝ μεταφορικά με 4x",
"addressRequired": "Παρακαλώ εισάγετε διεύθυνση παράδοσης",
"cityRequired": "Παρακαλώ εισάγετε πόλη",
"postalCodeRequired": "Παρακαλώ εισάγετε ταχ. κώδικα",
"colorMixRequired": "Παρακαλώ περιγράψτε την επιλογή χρωμάτων",
"colorMixTooShort": "Παρακαλώ δώστε λίγες ακόμα λεπτομέρειες (τουλάχιστον 3 χαρακτήρες)"
```

- [ ] **Step 4: Add new `product` keys**

```json
"deliveryInfo": "🚚 Παράδοση στο σπίτι (2–5 εργάσιμες ημέρες) — €4.00",
"freeShippingBadge": "ΔΩΡΕΑΝ ΜΕΤΑΦΟΡΙΚΑ",
"readMore": "Μάθε περισσότερα"
```

- [ ] **Step 5: Add the `modal` top-level block**

```json
"modal": {
  "title": "Οδηγός Αποστολής & Χρήσης",
  "close": "Κλείσιμο",
  "tabShipping": "Πληροφορίες αποστολής",
  "tabHowTo": "Πώς να το χρησιμοποιήσεις",
  "shippingBullet1": "🚚 Παράδοση στο σπίτι: 2–5 εργάσιμες ημέρες.",
  "shippingBullet2": "Σταθερή χρέωση €4.00 για όλες τις παραγγελίες. Δωρεάν με το πακέτο 4x.",
  "shippingBullet3": "Παράδοση μόνο εντός Κύπρου.",
  "shippingBullet4": "🏬 Παραλαβή κατόπιν συνεννόησης: διαθέσιμη στο Kings Avenue Mall, Πάφος. Επίλεξε «Παραλαβή» στο ταμείο και θα κλείσουμε ώρα μέσω WhatsApp.",
  "shippingBullet5": "Απορίες; WhatsApp: +357 97 661 053.",
  "step1Title": "Βήμα 1 — Πέρνα τα κορδόνια",
  "step1Desc": "Πέρασε τα κορδόνια μέσα από το κλιπ ακολουθώντας τα βελάκια.",
  "step2Title": "Βήμα 2 — Έτοιμο!",
  "step2Desc": "Μόλις περαστούν, το κλιπ κρατάει τα κορδόνια στη θέση τους — χωρίς κόμπους.",
  "fitTitle": "Ταιριάζει στα κορδόνια σου",
  "fitDesc": "Λειτουργεί με κορδόνια πλάτους 5–6 mm και πάχους έως 2 mm. Αν χρειαστεί, πίεσε απαλά την πλαστική άκρη με πένσα για καλύτερη εφαρμογή."
}
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add messages/el.json
git commit -m "feat(i18n): add Greek copy for fulfillment, color mix, and guide modal"
```

---

## Task 5: Extend types (FulfillmentMode, OrderFormData, SHIPPING_FEE)

**Files:**
- Modify: `types/index.ts`

- [ ] **Step 1: Add FulfillmentMode and extend OrderFormData**

Open `types/index.ts`. Replace the existing `OrderFormData` interface block (lines 18-26) with:

```ts
export type FulfillmentMode = "delivery" | "pickup";

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  color: string;       // used when quantity === 1
  colorMix: string;    // used when quantity >= 2
  quantity: number;
  fulfillment: FulfillmentMode;
  // delivery-only (optional at the type level; validated based on fulfillment):
  address: string;
  city: string;
  postalCode: string;
  // pickup-only:
  pickupDate: string;
  notes: string;
}
```

(All fields are required strings in the type; validation handles which must be non-empty.)

- [ ] **Step 2: Add SHIPPING_FEE constant**

At the bottom of the file, after the `WHATSAPP_NUMBER` line, add:

```ts
export const SHIPPING_FEE = 4.0;
export const FREE_SHIPPING_BUNDLE = 4; // quantity at which shipping becomes free
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build fails with errors in `components/OrderForm.tsx` and `app/api/checkout/route.ts` referencing the old shape (missing fields). This is expected — subsequent tasks fix those files. Confirm all errors are about `OrderFormData` missing fields and nothing else.

- [ ] **Step 4: Commit**

```bash
git add types/index.ts
git commit -m "feat(types): add FulfillmentMode, colorMix, address fields, shipping constants"
```

---

## Task 6: Update Header — rename findUs → pickup

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Update the NAV_ITEMS array**

In `components/Header.tsx` lines 9-16, change:

```ts
{ key: "findUs", href: "#find-us" },
```

to:

```ts
{ key: "pickup", href: "#find-us" },
```

(The section id `#find-us` stays the same — we keep the anchor so deep links from elsewhere don't break.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds (TS validates that `header.pickup` exists in en.json from Task 3).

- [ ] **Step 3: Manually verify**

Run `npm run dev`. Open `http://localhost:3000`. Nav link reads "Pickup" (EN) / "Παραλαβή" (EL) and scrolls to the location section.

- [ ] **Step 4: Commit**

```bash
git add components/Header.tsx
git commit -m "feat(nav): rename 'Find Us' to 'Pickup' in header"
```

---

## Task 7: Update StoreLocation — pickup-by-arrangement messaging

**Files:**
- Modify: `components/StoreLocation.tsx`

- [ ] **Step 1: Remove the Hours block and add "not a store" note**

In `components/StoreLocation.tsx`, locate the "Hours" block at lines 74-88 and delete it entirely (the whole `<div>` containing the Clock icon with hours info).

Immediately above the WhatsApp CTA link (line 109, `<a href="https://wa.me/...">`), insert a new info block:

```tsx
{/* "Not a physical store" note */}
<div className="rounded-xl border border-accent/15 bg-accent/[0.04] p-4">
  <p className="text-sm leading-relaxed text-gray-700">
    {t("location.notAStore")}
  </p>
</div>
```

- [ ] **Step 2: Verify no stray imports**

After removing the hours block, the `Clock` icon import on line 5 may be unused. Check if `Clock` is still referenced elsewhere in the file. If not, remove it from the import:

```tsx
import { MapPin, Phone, MessageCircle } from "lucide-react";
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds. No unused-import ESLint warnings.

- [ ] **Step 4: Manual smoke test**

`npm run dev` → check the `#find-us` section. It should show: title "Pickup by Arrangement", subtitle "Available at Kings Avenue Mall, Paphos — by arrangement only.", map, address, phone, "not a store" note, WhatsApp button. No opening hours. Toggle to Greek and verify Greek strings render.

- [ ] **Step 5: Commit**

```bash
git add components/StoreLocation.tsx
git commit -m "feat(location): replace storefront framing with pickup-by-arrangement"
```

---

## Task 8: Create ShippingGuideModal component

**Files:**
- Create: `components/ShippingGuideModal.tsx`

Uses the 3 renamed guide images, the `modal.*` i18n block, and framer-motion for animations consistent with the rest of the site.

- [ ] **Step 1: Create the modal component**

Create `components/ShippingGuideModal.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, BookOpen } from "lucide-react";
import Image from "next/image";

interface ShippingGuideModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "shipping" | "howTo";

export default function ShippingGuideModal({ open, onClose }: ShippingGuideModalProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>("shipping");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shipping-guide-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-cream shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-dark px-6 py-4">
              <h3
                id="shipping-guide-title"
                className="text-xl font-bold text-primary"
              >
                {t("modal.title")}
              </h3>
              <button
                onClick={onClose}
                aria-label={t("modal.close")}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-cream-dark">
              <button
                onClick={() => setActiveTab("shipping")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === "shipping"
                    ? "border-b-2 border-accent text-accent"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <Truck className="h-4 w-4" />
                {t("modal.tabShipping")}
              </button>
              <button
                onClick={() => setActiveTab("howTo")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === "howTo"
                    ? "border-b-2 border-accent text-accent"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {t("modal.tabHowTo")}
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5">
              {activeTab === "shipping" ? (
                <ul className="space-y-3 text-base leading-relaxed text-gray-700">
                  <li>{t("modal.shippingBullet1")}</li>
                  <li>{t("modal.shippingBullet2")}</li>
                  <li>{t("modal.shippingBullet3")}</li>
                  <li>{t("modal.shippingBullet4")}</li>
                  <li>{t("modal.shippingBullet5")}</li>
                </ul>
              ) : (
                <div className="space-y-6">
                  <GuideStep
                    src="/images/guide-step1-lace-routing.jpg"
                    title={t("modal.step1Title")}
                    desc={t("modal.step1Desc")}
                  />
                  <GuideStep
                    src="/images/guide-step2-final.jpg"
                    title={t("modal.step2Title")}
                    desc={t("modal.step2Desc")}
                  />
                  <GuideStep
                    src="/images/guide-lace-specs.jpg"
                    title={t("modal.fitTitle")}
                    desc={t("modal.fitDesc")}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GuideStep({ src, title, desc }: { src: string; title: string; desc: string }) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
        <Image
          src={src}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 640px"
        />
      </div>
      <div>
        <h4 className="text-base font-semibold text-primary">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds. The component is unused at this point, but imports must type-check.

- [ ] **Step 3: Commit**

```bash
git add components/ShippingGuideModal.tsx
git commit -m "feat(modal): add shipping info + usage guide modal component"
```

---

## Task 9: Wire modal + delivery info block + FREE SHIPPING chip in ProductSelector

**Files:**
- Modify: `components/ProductSelector.tsx`

- [ ] **Step 1: Add imports and state**

At the top of `components/ProductSelector.tsx`, update the imports. Change:

```tsx
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { BUNDLES, PRICE } from "@/types";
import Image from "next/image";
```

to:

```tsx
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Check, Star, Truck } from "lucide-react";
import { BUNDLES, PRICE, FREE_SHIPPING_BUNDLE } from "@/types";
import Image from "next/image";
import ShippingGuideModal from "./ShippingGuideModal";
```

Inside the `ProductSelector` component body, just below `const [activeImage, setActiveImage] = useState(0);`, add:

```tsx
const [guideOpen, setGuideOpen] = useState(false);
```

- [ ] **Step 2: Add FREE SHIPPING chip inside the 4x bundle card**

In `components/ProductSelector.tsx`, locate the bundle card's left-column section where the `hasSavings` badge renders. Inside the `<div>` that contains the bundle quantity + clips/pairs info, right below the `{hasSavings && <p>...</p>}` block, insert a conditional free-shipping chip:

```tsx
{bundle.quantity === FREE_SHIPPING_BUNDLE && (
  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
    <Truck className="h-3 w-3" />
    {t("product.freeShippingBadge")}
  </span>
)}
```

Concretely, the details block inside the bundle card should look like:

```tsx
<div>
  <p className="text-base font-semibold text-primary">
    {clips} {t("product.clipsCount")} · {pairs} {t("product.pairsCount")}
  </p>
  {hasSavings && (
    <p className={`text-sm font-bold ${
      bundle.bestSeller ? "text-green-600" : "text-green-600"
    }`}>
      {t("product.save")} €{savings.toFixed(2)} ({savingsPercent}%)
    </p>
  )}
  {bundle.quantity === FREE_SHIPPING_BUNDLE && (
    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
      <Truck className="h-3 w-3" />
      {t("product.freeShippingBadge")}
    </span>
  )}
</div>
```

- [ ] **Step 3: Add delivery info block + Read more trigger below bundles**

Immediately after the closing `</div>` of the bundle cards loop (after `{BUNDLES.map(...)}`), and BEFORE the feature-highlights block (`{/* Feature highlights */}`), insert:

```tsx
{/* Delivery info + guide modal trigger */}
<div className="mb-6 flex items-center justify-between rounded-xl border border-accent/15 bg-accent/[0.04] px-4 py-3">
  <p className="text-sm font-medium text-gray-700">
    {t("product.deliveryInfo")}
  </p>
  <button
    type="button"
    onClick={() => setGuideOpen(true)}
    className="shrink-0 text-sm font-semibold text-accent underline-offset-4 hover:underline"
  >
    {t("product.readMore")}
  </button>
</div>
```

- [ ] **Step 4: Render the modal**

At the very end of the component's JSX, right before the final `</section>`, add:

```tsx
<ShippingGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Manual smoke test**

`npm run dev`. In the browser:

1. Scroll to the "Bundle & Save" section. The 4x card shows a small "FREE SHIPPING" chip next to the savings text.
2. Below the bundle list there's a teal-tinted row "🚚 Home Delivery (2–5 business days) — €4.00" with a "Read more" link on the right.
3. Click "Read more" → modal opens, centered, backdrop darkens.
4. Click "Shipping info" vs "How to use it" tabs — content switches.
5. On "How to use it", the 3 guide images load correctly.
6. Press Esc → modal closes. Click backdrop → modal closes. Click X → modal closes.
7. Toggle language to Greek → all modal strings render in Greek.

- [ ] **Step 7: Commit**

```bash
git add components/ProductSelector.tsx
git commit -m "feat(product): add free-shipping chip, delivery info, and guide modal trigger"
```

---

## Task 10: Rewrite OrderForm — fulfillment toggle + conditional fields + color mix

**Files:**
- Modify: `components/OrderForm.tsx`

This is the largest task. We rewrite the form body.

- [ ] **Step 1: Replace imports and initial state**

In `components/OrderForm.tsx`, replace lines 1-24 with:

```tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  Truck,
  Store,
} from "lucide-react";
import {
  COLORS,
  BUNDLES,
  SHIPPING_FEE,
  FREE_SHIPPING_BUNDLE,
} from "@/types";
import type { OrderFormData, FulfillmentMode } from "@/types";

export default function OrderForm() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState<OrderFormData>({
    fullName: "",
    email: "",
    phone: "",
    color: COLORS[0].id,
    colorMix: "",
    quantity: 1,
    fulfillment: "delivery",
    address: "",
    city: "",
    postalCode: "",
    pickupDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
```

- [ ] **Step 2: Remove dead color-event listener and keep bundle listener**

The original file has two `useEffect` blocks listening for custom events. The `easylaces-select-color` event is no longer fired anywhere (ProductSelector no longer has per-color swatches). Delete the first `useEffect` (the color listener at lines 26-35 of the original). Keep the bundle listener.

Just below the form state initializer, you should have ONLY:

```tsx
  // Listen for bundle selection from ProductSelector
  useEffect(() => {
    const handler = (e: Event) => {
      const quantity = (e as CustomEvent).detail;
      if (quantity) {
        setForm((prev) => ({ ...prev, quantity }));
      }
    };
    window.addEventListener("easylaces-select-bundle", handler);
    return () => window.removeEventListener("easylaces-select-bundle", handler);
  }, []);
```

- [ ] **Step 3: Compute totals with shipping fee**

Below the `minDate` logic, replace the `bundle`/`total` lines. Before:

```tsx
const bundle = BUNDLES.find((b) => b.quantity === form.quantity);
const total = bundle ? bundle.price.toFixed(2) : (form.quantity * BUNDLES[0].price).toFixed(2);
```

After:

```tsx
const bundle = BUNDLES.find((b) => b.quantity === form.quantity) || BUNDLES[0];
const shippingFee =
  form.fulfillment === "delivery" && form.quantity !== FREE_SHIPPING_BUNDLE
    ? SHIPPING_FEE
    : 0;
const subtotal = bundle.price;
const total = (subtotal + shippingFee).toFixed(2);
const isFreeShipping =
  form.fulfillment === "delivery" && form.quantity === FREE_SHIPPING_BUNDLE;
```

- [ ] **Step 4: Rewrite validate() for conditional rules**

Replace the entire `validate()` function (original lines 65-88) with:

```tsx
const validate = (): boolean => {
  const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

  if (!form.fullName.trim()) newErrors.fullName = t("order.required");
  if (!form.email.trim()) {
    newErrors.email = t("order.required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = t("order.invalidEmail");
  }
  if (!form.phone.trim()) {
    newErrors.phone = t("order.required");
  } else if (!/^[+]?[\d\s()-]{7,}$/.test(form.phone)) {
    newErrors.phone = t("order.invalidPhone");
  }

  // Color vs color mix — conditional on quantity
  if (form.quantity === 1) {
    if (!form.color) newErrors.color = t("order.selectColor");
  } else {
    const mix = form.colorMix.trim();
    if (!mix) {
      newErrors.colorMix = t("order.colorMixRequired");
    } else if (mix.length < 3) {
      newErrors.colorMix = t("order.colorMixTooShort");
    }
  }

  // Fulfillment-specific fields
  if (form.fulfillment === "delivery") {
    if (!form.address.trim()) newErrors.address = t("order.addressRequired");
    if (!form.city.trim()) newErrors.city = t("order.cityRequired");
    if (!form.postalCode.trim()) newErrors.postalCode = t("order.postalCodeRequired");
  } else {
    if (!form.pickupDate) {
      newErrors.pickupDate = t("order.required");
    } else if (form.pickupDate < minDate) {
      newErrors.pickupDate = t("order.dateTooEarly");
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

- [ ] **Step 5: Add a fulfillment-setter helper**

Above the `return (` of the component, add a small helper so the toggle buttons have a single place to set fulfillment mode:

```tsx
const setFulfillment = (mode: FulfillmentMode) => {
  setForm((prev) => ({ ...prev, fulfillment: mode }));
  setErrors((prev) => {
    const next = { ...prev };
    delete next.address;
    delete next.city;
    delete next.postalCode;
    delete next.pickupDate;
    return next;
  });
};
```

- [ ] **Step 6: Add fulfillment toggle block at the top of the form**

In the JSX, immediately inside the `<form onSubmit={handleSubmit} ...>` opening tag and BEFORE the Full Name field (the first `<div className="mb-5">`), insert:

```tsx
{/* Fulfillment toggle */}
<div className="mb-6">
  <label className="mb-2 block text-base font-medium text-primary">
    {t("order.fulfillmentLabel")} *
  </label>
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <button
      type="button"
      onClick={() => setFulfillment("delivery")}
      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
        form.fulfillment === "delivery"
          ? "border-accent bg-accent/[0.06] shadow-sm"
          : "border-gray-200 bg-white/70 hover:border-accent/50"
      }`}
    >
      <Truck className={`h-6 w-6 shrink-0 ${form.fulfillment === "delivery" ? "text-accent" : "text-gray-400"}`} />
      <div>
        <p className="text-sm font-semibold text-primary">{t("order.deliveryOption")}</p>
        <p className="text-xs text-gray-500">{t("order.deliveryOptionDesc")}</p>
      </div>
    </button>
    <button
      type="button"
      onClick={() => setFulfillment("pickup")}
      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
        form.fulfillment === "pickup"
          ? "border-accent bg-accent/[0.06] shadow-sm"
          : "border-gray-200 bg-white/70 hover:border-accent/50"
      }`}
    >
      <Store className={`h-6 w-6 shrink-0 ${form.fulfillment === "pickup" ? "text-accent" : "text-gray-400"}`} />
      <div>
        <p className="text-sm font-semibold text-primary">{t("order.pickupOption")}</p>
        <p className="text-xs text-gray-500">{t("order.pickupOptionDesc")}</p>
      </div>
    </button>
  </div>
</div>
```

- [ ] **Step 7: Move color selection BELOW quantity and make it quantity-aware**

In the JSX, find and DELETE the entire existing "Color Selection" block (original lines 228-275).

Then locate the Quantity block and, immediately AFTER its closing `</div>`, insert a new color block that swaps UI based on quantity:

```tsx
{/* Color Selection (1x) or Mix (2x+) */}
<div className="mb-5">
  {form.quantity === 1 ? (
    <>
      <label className="mb-2 block text-base font-medium text-primary">
        {t("order.color")} *
      </label>
      <div className="flex flex-wrap gap-3">
        {COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, color: color.id }))
            }
            className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
              form.color === color.id
                ? "border-accent scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name[locale]}
          >
            {form.color === color.id && (
              <Check
                className="h-4 w-4"
                style={{
                  color:
                    color.id === "white" ? "#1A1A1A" : "#FFFFFF",
                }}
              />
            )}
            {color.id === "white" && (
              <span className="absolute inset-0 rounded-full border border-gray-200" />
            )}
          </button>
        ))}
      </div>
      {form.color && (
        <p className="mt-2 text-sm text-gray-500">
          {COLORS.find((c) => c.id === form.color)?.name[locale]}
        </p>
      )}
      {errors.color && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="h-3 w-3" />
          {errors.color}
        </p>
      )}
    </>
  ) : (
    <>
      <label className="mb-2 block text-base font-medium text-primary">
        {t("order.colorMixLabel")} *
      </label>
      <input
        type="text"
        value={form.colorMix}
        maxLength={200}
        placeholder={t("order.colorMixPlaceholder")}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, colorMix: e.target.value }))
        }
        className={inputClass("colorMix")}
      />
      <p className="mt-1 text-xs text-gray-500">
        {t("order.colorMixHelper").replace("{count}", String(form.quantity))}
      </p>
      {errors.colorMix && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="h-3 w-3" />
          {errors.colorMix}
        </p>
      )}
    </>
  )}
</div>
```

- [ ] **Step 8: Add conditional delivery address block + hide pickup-date for delivery**

The original form has a Pickup Date block (original lines 314-333). Replace that block with a conditional that renders EITHER the address fields OR the pickup date, depending on `form.fulfillment`:

```tsx
{/* Delivery address (delivery) or Pickup date (pickup) */}
{form.fulfillment === "delivery" ? (
  <>
    <div className="mb-5">
      <label className="mb-2 block text-base font-medium text-primary">
        {t("order.addressLabel")} *
      </label>
      <input
        type="text"
        value={form.address}
        placeholder={t("order.addressPlaceholder")}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, address: e.target.value }))
        }
        className={inputClass("address")}
      />
      {errors.address && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="h-3 w-3" />
          {errors.address}
        </p>
      )}
    </div>
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-2 block text-base font-medium text-primary">
          {t("order.cityLabel")} *
        </label>
        <input
          type="text"
          value={form.city}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, city: e.target.value }))
          }
          className={inputClass("city")}
        />
        {errors.city && (
          <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3 w-3" />
            {errors.city}
          </p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-base font-medium text-primary">
          {t("order.postalCodeLabel")} *
        </label>
        <input
          type="text"
          value={form.postalCode}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, postalCode: e.target.value }))
          }
          className={inputClass("postalCode")}
        />
        {errors.postalCode && (
          <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3 w-3" />
            {errors.postalCode}
          </p>
        )}
      </div>
    </div>
    <div className="mb-5">
      <label className="mb-2 block text-base font-medium text-primary">
        {t("order.countryLabel")}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600">
        <span aria-hidden>🇨🇾</span>
        <span className="text-sm font-medium">Cyprus</span>
      </div>
    </div>
  </>
) : (
  <div className="mb-5">
    <label className="mb-2 block text-base font-medium text-primary">
      {t("order.pickupDate")} *
    </label>
    <input
      type="date"
      value={form.pickupDate}
      min={minDate}
      onChange={(e) =>
        setForm((prev) => ({ ...prev, pickupDate: e.target.value }))
      }
      className={inputClass("pickupDate")}
    />
    <p className="mt-1 text-xs text-gray-500">
      {t("order.pickupConfirmNote")}
    </p>
    {errors.pickupDate && (
      <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
        <AlertCircle className="h-3 w-3" />
        {errors.pickupDate}
      </p>
    )}
  </div>
)}
```

- [ ] **Step 9: Update totals display block with shipping fee line**

Locate the Total block (original lines 352-357). Replace with:

```tsx
{/* Subtotal / Shipping / Total */}
<div className="mb-6 space-y-2 rounded-xl border border-accent/10 bg-accent/[0.04] p-5">
  <div className="flex items-center justify-between text-sm text-gray-600">
    <span>{t("order.total")} ({form.quantity}x)</span>
    <span className="font-semibold text-primary">€{subtotal.toFixed(2)}</span>
  </div>
  {form.fulfillment === "delivery" && (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>{t("order.shippingFeeLabel")}</span>
      {isFreeShipping ? (
        <span className="font-semibold text-green-600">
          {t("order.freeShippingChip")}
        </span>
      ) : (
        <span className="font-semibold text-primary">€{shippingFee.toFixed(2)}</span>
      )}
    </div>
  )}
  <div className="flex items-center justify-between pt-2">
    <span className="text-lg font-semibold text-primary">
      {t("order.total")}
    </span>
    <span className="text-3xl font-extrabold text-accent">€{total}</span>
  </div>
</div>
```

- [ ] **Step 10: Submit button label uses the new total**

The existing submit button already renders `€{total}` — no change needed because `total` now includes shipping.

- [ ] **Step 11: Build**

Run: `npm run build`
Expected: build succeeds. Any remaining TS errors are server-side — they'll be fixed in Task 11.

- [ ] **Step 12: Manual smoke test**

`npm run dev`. Test all of the following:

1. Form loads with fulfillment = delivery selected, 1x bundle, no address filled yet.
2. Color swatches visible for 1x. Switch quantity to 2x — swatches disappear, text input appears. Placeholder shows "e.g. 2 Black, 1 Grey, 1 White". Helper text reads "total: 2 packs".
3. Switch back to 1x — text field disappears, swatches reappear. Mix field is cleared.
4. Click "Pickup by arrangement" toggle — address fields disappear, pickup date appears, pickup-confirm note renders under the date.
5. Back to "Home Delivery" — address fields return, pickup date hidden.
6. With delivery + 3x bundle: total shows subtotal €18.99, shipping €4.00, total €22.99.
7. With delivery + 4x bundle: total shows subtotal €24.99, shipping "FREE shipping with 4x", total €24.99.
8. With pickup + any bundle: no shipping line shown, total = subtotal.
9. Submit empty → shows required errors on all visible required fields only (not on hidden ones).
10. Toggle language to Greek and repeat the quantity 1↔2 color switch — Greek strings display.

- [ ] **Step 13: Commit**

```bash
git add components/OrderForm.tsx
git commit -m "feat(order): add fulfillment toggle, address fields, color mix text input"
```

---

## Task 11: Update checkout API route for fulfillment + mix + shipping fee

**Files:**
- Modify: `app/api/checkout/route.ts`

- [ ] **Step 1: Add imports and shipping-fee helper**

Replace the top of `app/api/checkout/route.ts` (imports + helper) with:

```ts
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
```

- [ ] **Step 2: Update CheckoutRequest to match extended OrderFormData**

Open `types/index.ts` and confirm `CheckoutRequest` is:

```ts
export interface CheckoutRequest extends OrderFormData {
  locale: Language;
}
```

It already extends `OrderFormData`, so new fields are automatic. No edit needed. Skip to Step 3.

- [ ] **Step 3: Rewrite the POST handler body**

Replace the entire `export async function POST(request: NextRequest) { ... }` function body (everything inside the function braces) with:

```ts
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
        notes: notes || "",
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
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds. No TS errors anywhere.

- [ ] **Step 5: Manual Stripe test-mode run**

`npm run dev`. For each combination below, complete the form and reach Stripe checkout, then verify the charge matches:

| Bundle | Fulfillment | Expected Stripe total |
|---|---|---|
| 1x | Delivery | €10.99 (6.99 + 4.00) |
| 2x | Delivery | €16.99 (12.99 + 4.00) |
| 3x | Delivery | €22.99 (18.99 + 4.00) |
| 4x | Delivery | €24.99 (free shipping) |
| 1x | Pickup | €6.99 |
| 3x | Pickup | €18.99 |

Also verify:
- Stripe line items show "EasyLaces Clip Bundle — Nx pack (N*4 clips)" and, for delivery with fee, a second "Home Delivery (2–5 business days)" line at €4.00.
- Form validation blocks submit when fields are missing (try blank address with delivery, blank mix with 2x).

- [ ] **Step 6: Commit**

```bash
git add app/api/checkout/route.ts
git commit -m "feat(checkout): add fulfillment-aware validation, shipping fee line item, metadata"
```

---

## Task 12: Update webhook email with new metadata

**Files:**
- Modify: `app/api/webhook/route.ts`

- [ ] **Step 1: Read new metadata fields**

In `app/api/webhook/route.ts`, replace the metadata extraction block (around lines 31-42). Before:

```ts
const meta = session.metadata || {};

const customerName = meta.customer_name || "N/A";
const customerEmail = session.customer_email || "N/A";
const customerPhone = meta.customer_phone || "N/A";
const colorName = meta.color_name || "N/A";
const pickupDate = meta.pickup_date || "N/A";
const notes = meta.notes || "None";
const quantity = session.line_items?.data?.[0]?.quantity || "N/A";
const total = session.amount_total
  ? `€${(session.amount_total / 100).toFixed(2)}`
  : "N/A";
```

After:

```ts
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
```

- [ ] **Step 2: Update the email HTML body**

Replace the `<table>...</table>` block (original lines 55-88) with:

```ts
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
    <td style="padding: 12px 0; font-weight: bold; color: #333;">Color / Mix</td>
    <td style="padding: 12px 0; color: #555;">${colorLabel}</td>
  </tr>
  <tr style="border-bottom: 1px solid #eee;">
    <td style="padding: 12px 0; font-weight: bold; color: #333;">Bundle</td>
    <td style="padding: 12px 0; color: #555;">${bundleQuantity}x pack</td>
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
    <td style="padding: 12px 0; color: #555;">${fulfillmentDetail}</td>
  </tr>
  <tr>
    <td style="padding: 12px 0; font-weight: bold; color: #333;">Notes</td>
    <td style="padding: 12px 0; color: #555;">${notes}</td>
  </tr>
</table>
```

- [ ] **Step 3: Update the footer note**

Replace the "Pickup Location" footer block (original lines 90-94). Before:

```ts
<div style="margin-top: 30px; padding: 15px; background-color: #f0f7ff; border-radius: 8px;">
  <p style="margin: 0; color: #333; font-size: 14px;">
    <strong>Pickup Location:</strong> Kings Avenue Mall, Paphos, Cyprus
  </p>
</div>
```

After:

```ts
<div style="margin-top: 30px; padding: 15px; background-color: #f0f7ff; border-radius: 8px;">
  <p style="margin: 0; color: #333; font-size: 14px;">
    ${
      fulfillment === "delivery"
        ? "<strong>Action:</strong> Ship to the delivery address above within 2–5 business days."
        : "<strong>Action:</strong> Confirm pickup time with the customer on WhatsApp."
    }
  </p>
</div>
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual webhook test**

Place a test order through Stripe test mode (using the dev server + Stripe CLI `stripe listen --forward-to localhost:3000/api/webhook`). Verify the email to `ORDER_NOTIFICATION_EMAIL` contains:
- Color/Mix row with the swatch name or mix string.
- Bundle row with "3x pack" etc.
- Fulfillment row with the right icon+label.
- Correct delivery address OR pickup date in the conditional row.
- Action note reflecting delivery vs pickup.

- [ ] **Step 6: Commit**

```bash
git add app/api/webhook/route.ts
git commit -m "feat(webhook): show fulfillment, color mix, and address in order email"
```

---

## Task 13: Full manual verification + build

**Files:**
- None (verification only)

- [ ] **Step 1: Clean build**

```bash
npm run build
```

Expected: succeeds with no TS errors, no missing-i18n-key warnings.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: no errors. Address any warnings introduced.

- [ ] **Step 3: End-to-end smoke test, English**

`npm run dev`. In English:
- Hero subheadline mentions delivery + pickup.
- ProductSelector: 4x card has FREE SHIPPING chip. Delivery info block + Read more renders.
- Modal opens, both tabs work, all 3 images load, Esc/backdrop/X all close it.
- Order form: fulfillment toggle at top, default delivery. Switch to pickup → address fields disappear, date field appears. Back to delivery → opposite.
- Color UI flips on 1↔2 quantity change; errors only show on visible fields.
- Totals: 4x+delivery = 24.99, 3x+delivery = 22.99, 1x+pickup = 6.99.
- Submit a full 3x delivery order in Stripe test mode. Confirm success redirect and webhook email.

- [ ] **Step 4: End-to-end smoke test, Greek**

Switch LanguageToggle to `EL`. Repeat steps from Step 3 quickly. All strings render in Greek, no raw keys like `order.fulfillmentLabel` show up.

- [ ] **Step 5: Mobile smoke test**

In devtools, switch to iPhone SE width (375px). Verify:
- Fulfillment toggle stacks vertically (single column).
- Delivery info block + Read more stays readable (may wrap, that's fine).
- Modal fits on screen with scrollable body.
- Address block (city/postal) stacks 1 column.

- [ ] **Step 6: Regression check**

- Existing "How It Works" section still renders.
- Language toggle still works.
- Reviews section still renders.
- Cookie banner still works.

- [ ] **Step 7: Final commit (if any cleanup)**

If the build/lint passed cleanly with no fixes needed, skip this step. Otherwise:

```bash
git add -A
git commit -m "chore: final polish after Stelios updates"
```

---

## Post-implementation

1. Mention on WhatsApp to Stelios: "Prices are now charged correctly, delivery €4 added (free on 4x), mixed-color orders supported, location rewritten. Please test a few orders in your Stripe dashboard."
2. Watch the first 2–3 real orders for any issues (wrong shipping fee, malformed mix strings, webhook email glitches).
3. Next-iteration candidates (do NOT implement now): address autocomplete, delivery zone selector for multi-country, Shopify-style live shipping cost calculator.

---

## Self-review

**Spec coverage check:**
- §1 Pricing bug fix → Task 2 ✓
- §2 Delivery/pickup toggle → Tasks 5, 10, 11 ✓
- §3 Color swatch/mix → Tasks 5, 10, 11 ✓
- §4 Read more modal → Tasks 3, 4, 8, 9 ✓
- §5 Location rewrite → Tasks 3, 4, 7 ✓
- §6 Header rename → Tasks 3, 4, 6 ✓
- Shipping fee logic (2 + 4 free) → Tasks 5, 10, 11 ✓
- Image rename → Task 1 ✓
- Webhook email update → Task 12 ✓
- fitDesc 5–6 mm update → Tasks 3, 4 ✓

**Placeholder scan:** no TBDs, no "similar to", no "handle edge cases". All code blocks are complete.

**Type consistency check:**
- `FulfillmentMode` defined in Task 5, used identically in Tasks 10 + 11.
- `OrderFormData.colorMix` defined in Task 5, used in Tasks 10 + 11.
- `SHIPPING_FEE`, `FREE_SHIPPING_BUNDLE` defined in Task 5, used in Tasks 9, 10, 11.
- Stripe metadata keys: `color_label`, `bundle_quantity`, `fulfillment`, `delivery_address`, `pickup_date` — set in Task 11, read in Task 12. Match.
- `setFulfillment` helper defined in Task 10 Step 5, used in Task 10 Step 6. Match.
