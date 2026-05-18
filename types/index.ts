export type Language = "en" | "el";

export interface ColorVariant {
  id: string;
  name: { en: string; el: string };
  hex: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: { en: string; el: string };
  verified: boolean;
  lang: Language;
}

export type FulfillmentMode = "delivery" | "pickup";

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  colors: string[];    // one color id per pack; length === quantity
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

export interface CheckoutRequest extends OrderFormData {
  locale: Language;
}

export interface CheckoutResponse {
  url: string;
}

export const COLORS: ColorVariant[] = [
  { id: "black", name: { en: "Black", el: "Μαύρο" }, hex: "#1A1A1A" },
  { id: "white", name: { en: "White", el: "Λευκό" }, hex: "#F5F5F5" },
  { id: "blue", name: { en: "Blue", el: "Μπλε" }, hex: "#2563EB" },
  { id: "grey", name: { en: "Grey", el: "Γκρι" }, hex: "#9CA3AF" },
];

export interface Bundle {
  quantity: number;
  price: number;
  bestSeller?: boolean;
}

export const BUNDLES: Bundle[] = [
  { quantity: 1, price: 6.99 },
  { quantity: 2, price: 12.99 },
  { quantity: 3, price: 18.99, bestSeller: true },
  { quantity: 4, price: 24.99 },
];

export const PRICE = 6.99;
export const CURRENCY = "EUR";
export const WHATSAPP_NUMBER = "35797661053";
export const SHIPPING_FEE = 4.0;
export const FREE_SHIPPING_BUNDLE = 4; // quantity at which shipping becomes free
