# Product Features Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Why EasyLaces?" product features section between HowItWorks and ProductSelector, displaying 6 icon cards + fit tip + video guide badge, fully translated in EN and EL.

**Architecture:** New `ProductFeatures.tsx` component following the same patterns as `HowItWorks.tsx` (Framer Motion animations, `useI18n()` hook, responsive grid). i18n keys added under `"features"` namespace. Header nav updated with new link.

**Tech Stack:** React, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, existing i18n system.

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `messages/en.json` | Add `features` i18n keys (EN) |
| Modify | `messages/el.json` | Add `features` i18n keys (EL) |
| Create | `components/ProductFeatures.tsx` | Feature cards grid + fit tip + video badge |
| Modify | `app/page.tsx` | Insert ProductFeatures between HowItWorks and ProductSelector |
| Modify | `components/Header.tsx` | Add "Features" nav item |

---

### Task 1: Add i18n translations

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/el.json`

- [ ] **Step 1: Add English translations**

In `messages/en.json`, add a `"features"` block after the `"howItWorks"` block:

```json
"features": {
  "title": "Why EasyLaces?",
  "subtitle": "Designed for comfort, built to last",
  "ecoTitle": "Eco-Friendly",
  "ecoDesc": "Made from recyclable, biodegradable PLA+ material — safe for everyday use.",
  "craftedTitle": "Precision-Crafted",
  "craftedDesc": "Each clip is individually crafted and hand-finished for consistent quality and a perfect fit.",
  "durableTitle": "Durable & Lightweight",
  "durableDesc": "Strong enough for daily wear, yet light and comfortable on any shoe.",
  "heatTitle": "Heat Resistant",
  "heatDesc": "Maintains shape and durability up to 60 °C (140 °F).",
  "fitTitle": "Universal Fit",
  "fitDesc": "Designed for laces 6–7 mm wide and up to 2 mm thick — fits most sneakers and sports shoes.",
  "safetyTitle": "Safety Tested",
  "safetyDesc": "Recommended for ages 14 and above.",
  "fitTip": "Tip: Some lace tips may be slightly thicker. Gently press with pliers for a smooth fit through the clip.",
  "videoGuide": "Watch how it works"
}
```

- [ ] **Step 2: Add Greek translations**

In `messages/el.json`, add a `"features"` block after the `"howItWorks"` block:

```json
"features": {
  "title": "Γιατί EasyLaces;",
  "subtitle": "Σχεδιασμένο για άνεση, κατασκευασμένο για να αντέχει",
  "ecoTitle": "Οικολογικό",
  "ecoDesc": "Κατασκευασμένο από ανακυκλώσιμο, βιοδιασπώμενο υλικό PLA+ — ασφαλές για καθημερινή χρήση.",
  "craftedTitle": "Κατασκευασμένο με Ακρίβεια",
  "craftedDesc": "Κάθε κλιπ κατασκευάζεται μεμονωμένα και φινιρίζεται στο χέρι για σταθερή ποιότητα και τέλεια εφαρμογή.",
  "durableTitle": "Ανθεκτικό & Ελαφρύ",
  "durableDesc": "Αρκετά ανθεκτικό για καθημερινή χρήση, αλλά ελαφρύ και άνετο σε κάθε παπούτσι.",
  "heatTitle": "Ανθεκτικό στη Θερμότητα",
  "heatDesc": "Διατηρεί το σχήμα και την αντοχή του έως 60 °C (140 °F).",
  "fitTitle": "Καθολική Εφαρμογή",
  "fitDesc": "Σχεδιασμένο για κορδόνια πλάτους 6–7 mm και πάχους έως 2 mm — ταιριάζει στα περισσότερα αθλητικά παπούτσια.",
  "safetyTitle": "Ελεγμένη Ασφάλεια",
  "safetyDesc": "Συνιστάται για ηλικίες 14 ετών και άνω.",
  "fitTip": "Συμβουλή: Μερικές άκρες κορδονιών μπορεί να είναι ελαφρώς πιο χοντρές. Πιέστε απαλά με πένσα για ομαλή εφαρμογή στο κλιπ.",
  "videoGuide": "Δείτε πώς λειτουργεί"
}
```

- [ ] **Step 3: Commit**

```bash
git add messages/en.json messages/el.json
git commit -m "feat: add product features i18n translations (EN + EL)"
```

---

### Task 2: Create ProductFeatures component

**Files:**
- Create: `components/ProductFeatures.tsx`

- [ ] **Step 1: Create the component**

Create `components/ProductFeatures.tsx` with a grid of 6 feature cards, a fit tip banner, and a video guide badge. Follow the same patterns as `HowItWorks.tsx`:
- `"use client"` directive
- `useI18n()` hook for translations
- Framer Motion `motion.div` with `whileInView` and staggered delays
- Lucide icons: `Leaf`, `Gem`, `Feather`, `Thermometer`, `Ruler`, `ShieldCheck`, `Lightbulb`, `Play`
- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Section id: `#features`
- Background: `bg-cream` (alternates from HowItWorks which uses `bg-cream-dark`)

```tsx
"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Leaf,
  Gem,
  Feather,
  Thermometer,
  Ruler,
  ShieldCheck,
  Lightbulb,
  Play,
} from "lucide-react";

const features = [
  { icon: Leaf, titleKey: "ecoTitle", descKey: "ecoDesc" },
  { icon: Gem, titleKey: "craftedTitle", descKey: "craftedDesc" },
  { icon: Feather, titleKey: "durableTitle", descKey: "durableDesc" },
  { icon: Thermometer, titleKey: "heatTitle", descKey: "heatDesc" },
  { icon: Ruler, titleKey: "fitTitle", descKey: "fitDesc" },
  { icon: ShieldCheck, titleKey: "safetyTitle", descKey: "safetyDesc" },
] as const;

export default function ProductFeatures() {
  const { t } = useI18n();

  return (
    <section id="features" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent">
            {t("features.subtitle")}
          </span>
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">
            {t("features.title")}
          </h2>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-cream-dark bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/15">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-primary">
                  {t(`features.${feature.titleKey}` as Parameters<typeof t>[0])}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {t(`features.${feature.descKey}` as Parameters<typeof t>[0])}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Fit tip banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 sm:items-center"
        >
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent sm:mt-0" />
          <p className="text-sm leading-relaxed text-gray-600">
            {t("features.fitTip")}
          </p>
        </motion.div>

        {/* Video guide badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 flex justify-center"
        >
          <button className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-5 py-2.5 text-sm font-medium text-accent shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Play className="h-4 w-4" />
            {t("features.videoGuide")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ProductFeatures.tsx
git commit -m "feat: add ProductFeatures component with icon cards grid"
```

---

### Task 3: Wire up component and navigation

**Files:**
- Modify: `app/page.tsx:1-33`
- Modify: `components/Header.tsx:9-15`

- [ ] **Step 1: Add ProductFeatures to page.tsx**

In `app/page.tsx`, add the import and place `<ProductFeatures />` between `<HowItWorks />` and the section divider before `<ProductSelector />`:

```tsx
import ProductFeatures from "@/components/ProductFeatures";
```

Insert after `<HowItWorks />`:
```tsx
<HowItWorks />
<ProductFeatures />
<div className="section-divider mx-auto max-w-3xl" />
<ProductSelector />
```

- [ ] **Step 2: Add "Features" to Header navigation**

In `components/Header.tsx`, update `NAV_ITEMS` to include the features link after howItWorks:

```tsx
const NAV_ITEMS = [
  { key: "howItWorks", href: "#how-it-works" },
  { key: "features", href: "#features" },
  { key: "colors", href: "#colors" },
  { key: "reviews", href: "#reviews" },
  { key: "findUs", href: "#find-us" },
  { key: "order", href: "#order" },
] as const;
```

Also add the header translation keys. In `messages/en.json` under `"header"`:
```json
"features": "Features"
```

In `messages/el.json` under `"header"`:
```json
"features": "Χαρακτηριστικά"
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx components/Header.tsx messages/en.json messages/el.json
git commit -m "feat: wire ProductFeatures into page layout and header nav"
```

---

### Task 4: Visual verification

- [ ] **Step 1: Start dev server and verify**

```bash
npm run dev
```

Open browser and verify:
- Section appears between HowItWorks and ProductSelector
- 6 cards render in 3-col grid (desktop), 2-col (tablet), 1-col (mobile)
- Icons, titles, descriptions all display correctly
- Fit tip banner shows below cards
- Video guide button renders below fit tip
- Scroll animations work (cards fade in on scroll)
- Header "Features" link scrolls to the section
- Language toggle switches all feature text to Greek
- Mobile menu includes "Features" link
