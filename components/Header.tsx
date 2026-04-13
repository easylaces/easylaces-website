"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_ITEMS = [
  { key: "howItWorks", href: "#how-it-works" },
  { key: "features", href: "#features" },
  { key: "colors", href: "#colors" },
  { key: "reviews", href: "#reviews" },
  { key: "findUs", href: "#find-us" },
  { key: "order", href: "#order" },
] as const;

export default function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 shadow-md backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2"
        >
          <Logo size={32} />
          <span className="text-2xl font-bold text-primary">EasyLaces</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.href)}
              className="text-base font-medium text-gray-600 transition-colors hover:text-accent"
            >
              {t(`header.${item.key}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-primary transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-cream-dark bg-cream px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.href)}
                className="text-left text-base font-medium text-gray-700 transition-colors hover:text-accent"
              >
                {t(`header.${item.key}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
