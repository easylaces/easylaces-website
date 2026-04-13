# Product Features Section — Design Spec

## Overview

Add a new "Product Features" section to the homepage, positioned between HowItWorks and ProductSelector. Displays product characteristics in a grid of icon cards without revealing manufacturing process details (no 3D printing references).

## Position in Page

`Hero → HowItWorks → **ProductFeatures (NEW)** → ProductSelector → Reviews → StoreLocation → OrderForm`

## Section Title

- EN: "Why EasyLaces?"
- EL: "Γιατί EasyLaces;"

## Layout

- Responsive grid: 3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- Each card: Lucide icon + title + short description
- Style: consistent with existing site (cream background, soft borders, Framer Motion scroll-triggered animations)
- Section ID: `#features`

## Feature Cards (6 total)

### 1. Eco-Friendly
- **Icon:** Leaf
- **EN:** Made from recyclable, biodegradable PLA+ material — safe for everyday use.
- **EL:** Κατασκευασμένο από ανακυκλώσιμο, βιοδιασπώμενο υλικό PLA+ — ασφαλές για καθημερινή χρήση.

### 2. Precision-Crafted
- **Icon:** Gem (or similar quality icon)
- **EN:** Each clip is individually crafted and hand-finished for consistent quality and a perfect fit.
- **EL:** Κάθε κλιπ κατασκευάζεται μεμονωμένα και φινιρίζεται στο χέρι για σταθερή ποιότητα και τέλεια εφαρμογή.

### 3. Durable & Lightweight
- **Icon:** Feather
- **EN:** Strong enough for daily wear, yet light and comfortable on any shoe.
- **EL:** Αρκετά ανθεκτικό για καθημερινή χρήση, αλλά ελαφρύ και άνετο σε κάθε παπούτσι.

### 4. Heat Resistant
- **Icon:** Thermometer
- **EN:** Maintains shape and durability up to 60 °C (140 °F).
- **EL:** Διατηρεί το σχήμα και την αντοχή του έως 60 °C (140 °F).

### 5. Universal Fit
- **Icon:** Ruler
- **EN:** Designed for laces 6–7 mm wide and up to 2 mm thick — fits most sneakers and sports shoes.
- **EL:** Σχεδιασμένο για κορδόνια πλάτους 6–7 mm και πάχους έως 2 mm — ταιριάζει στα περισσότερα αθλητικά παπούτσια.

### 6. Safety Tested
- **Icon:** ShieldCheck
- **EN:** Recommended for ages 14 and above.
- **EL:** Συνιστάται για ηλικίες 14 ετών και άνω.

## Additional Elements (below grid)

### Fit Tip (info banner)
- **EN:** "Tip: Some lace tips may be slightly thicker. Gently press with pliers for a smooth fit through the clip."
- **EL:** "Συμβουλή: Μερικές άκρες κορδονιών μπορεί να είναι ελαφρώς πιο χοντρές. Πιέστε απαλά με πένσα για ομαλή εφαρμογή στο κλιπ."

### Video Guide (link/badge)
- **EN:** "Watch how it works" — placeholder link (to be connected when video is ready)
- **EL:** "Δείτε πώς λειτουργεί"
- Renders as a clickable badge/button below the fit tip

## Technical Details

- **New component:** `components/ProductFeatures.tsx`
- **i18n keys:** nested under `"features"` in `messages/en.json` and `messages/el.json`
- **Animations:** Framer Motion `whileInView` with staggered card entry (consistent with HowItWorks)
- **Navigation:** Add "Features" link to Header nav pointing to `#features`

## Constraints

- No references to 3D printing or specific manufacturing processes
- Use "precision-crafted" terminology for production quality
- Bilingual: all text in EN + EL
