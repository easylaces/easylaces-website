"use client";

import { useI18n } from "@/lib/i18n";
import { Link as LinkIcon, Instagram, Facebook } from "lucide-react";

const NAV_LINKS = [
  { key: "howItWorks", href: "#how-it-works" },
  { key: "order", href: "#order" },
  { key: "findUs", href: "#find-us" },
] as const;

export default function Footer() {
  const { t } = useI18n();

  const handleClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-cream-dark bg-gradient-to-b from-cream to-surface py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <LinkIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary">EasyLaces</span>
            </div>
            <p className="text-base text-gray-500">
              {t("location.address")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t("footer.quickLinks")}
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleClick(link.href)}
                  className="text-left text-base text-gray-600 transition-colors hover:text-accent"
                >
                  {t(`header.${link.key}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Contact
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+35797661053"
                className="text-base text-gray-600 transition-colors hover:text-accent"
              >
                +357 97 661 053
              </a>
              <a
                href="https://wa.me/35797661053"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-gray-600 transition-colors hover:text-accent"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Social
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-dark text-gray-500 transition-colors hover:bg-accent hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-dark text-gray-500 transition-colors hover:bg-accent hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-dark text-gray-500 transition-colors hover:bg-accent hover:text-white"
                aria-label="TikTok"
              >
                {/* TikTok icon - lucide doesn't have one, using a simple SVG */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.64 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.36V9.18a8.16 8.16 0 0 0 3.85.97V6.69Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream-dark pt-8 sm:flex-row">
          <p className="text-sm text-gray-400">{t("footer.rights")}</p>
          <p className="flex items-center gap-1.5 text-sm text-gray-400">
            {t("footer.madeIn")} 🇨🇾
          </p>
        </div>
      </div>
    </footer>
  );
}
