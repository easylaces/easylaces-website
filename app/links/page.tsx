import type { Metadata } from "next";
import Image from "next/image";
import { Instagram, MessageCircle, ShoppingBag } from "lucide-react";
import Logo from "@/components/Logo";
import { LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "EasyLacesCY — Links",
  robots: "noindex",
};


const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.64 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.36V9.18a8.16 8.16 0 0 0 3.85.97V6.69Z" />
  </svg>
);

const BUTTONS = [
  { label: "Shop", note: "€6.99 per pack of 4 clips", href: LINKS.shop, Icon: ShoppingBag, primary: true },
  { label: "Instagram", note: "Follow us", href: LINKS.instagram, Icon: Instagram },
  { label: "TikTok", note: "Watch it in action", href: LINKS.tiktok, Icon: TikTokIcon },
  { label: "WhatsApp", note: "Ask us anything", href: LINKS.whatsapp, Icon: MessageCircle },
];

export default function LinksPage() {
  return (
    <main className="relative isolate flex min-h-[100svh] flex-col px-5 pb-10 pt-10">
      {/* Photo: Unsplash 1553808373-92b0bcc3af65 (Unsplash License) */}
      <Image src="/images/links-bg.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[50%_40%]" />
      {/* Scrim: dark behind the type and buttons, clear over the shoes at the bottom */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/5 to-black/80" />

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        <header className="links-rise">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className={`font-display text-lg font-semibold text-white`} style={{ fontStretch: "125%" }}>
              EasyLacesCY
            </span>
          </div>
          <h1
            className={`font-display mt-8 text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.01em] text-white`}
            style={{ fontStretch: "145%" }}
          >
            Never tie your shoes again.
          </h1>
          <p lang="el" className="mt-3 text-base text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
            Μην δέσεις ξανά τα παπούτσια σου.
          </p>
        </header>

        <nav className="mt-auto flex flex-col gap-3 pt-9" aria-label="EasyLacesCY links">
          {BUTTONS.map(({ label, note, href, Icon, primary }, i) => {
            const external = href.startsWith("http");
            return (
              <a
                key={label}
                href={href}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className={`links-rise group flex items-center gap-4 rounded-[1.25rem] p-3 pr-5 outline-none transition-transform active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-white/60 ${
                  primary ? "bg-accent text-white" : "bg-white text-primary"
                }`}
                style={{ animationDelay: `${120 + i * 70}ms` }}
              >
                {/* Eyelet: the icon sits in a ring, like a lace hole */}
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-2 ${
                    primary ? "bg-white/15 ring-white/40" : "bg-cream ring-cream-dark"
                  }`}
                >
                  <Icon className="h-[22px] w-[22px]" />
                </span>
                <span className="flex flex-col">
                  <span className={`font-display text-xl font-bold leading-tight`} style={{ fontStretch: "125%" }}>
                    {label}
                  </span>
                  <span className={`text-sm ${primary ? "text-white/80" : "text-gray-500"}`}>{note}</span>
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
