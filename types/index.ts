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

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  color: string;
  quantity: number;
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
  { id: "red", name: { en: "Red", el: "Κόκκινο" }, hex: "#DC2626" },
  { id: "blue", name: { en: "Blue", el: "Μπλε" }, hex: "#2563EB" },
  { id: "navy", name: { en: "Navy", el: "Ναυτικό Μπλε" }, hex: "#1E3A5F" },
  { id: "grey", name: { en: "Grey", el: "Γκρι" }, hex: "#9CA3AF" },
];

export const PRICE = 5.99;
export const CURRENCY = "EUR";
export const WHATSAPP_NUMBER = "35797661053";
