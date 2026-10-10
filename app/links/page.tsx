import type { Metadata } from "next";
import { Instagram, MessageCircle, ShoppingBag } from "lucide-react";
import Logo from "@/components/Logo";
import { LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "EasyLacesCY — Links",
  robots: "noindex",
};

const TikTokIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.64 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.36V9.18a8.16 8.16 0 0 0 3.85.97V6.69Z" />
  </svg>
);

const BUTTONS = [
  { label: "Shop", href: LINKS.shop, icon: <ShoppingBag className="h-6 w-6" />, className: "bg-accent hover:bg-accent/90" },
  { label: "Instagram", href: LINKS.instagram, icon: <Instagram className="h-6 w-6" />, className: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90" },
  { label: "TikTok", href: LINKS.tiktok, icon: <TikTokIcon />, className: "bg-black hover:bg-gray-800" },
  { label: "WhatsApp", href: LINKS.whatsapp, icon: <MessageCircle className="h-6 w-6" />, className: "bg-green-500 hover:bg-green-600" },
];

export default function LinksPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-cream via-cream to-surface px-4 py-12">
      <Logo size={72} />
      <h1 className="mt-4 text-3xl font-bold text-primary">EasyLacesCY</h1>
      <p className="mt-1 text-gray-500">Never tie your shoes again</p>

      <nav className="mt-10 flex w-full max-w-sm flex-col gap-4">
        {BUTTONS.map((b) => {
          const external = b.href.startsWith("http");
          return (
            <a
              key={b.label}
              href={b.href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className={`flex items-center justify-center gap-3 rounded-2xl px-6 py-5 text-xl font-semibold text-white shadow-md transition-all ${b.className}`}
            >
              {b.icon}
              {b.label}
            </a>
          );
        })}
      </nav>
    </main>
  );
}
