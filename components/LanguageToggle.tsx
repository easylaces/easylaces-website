"use client";

import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "el" : "en")}
      className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "en" ? "ΕΛ" : "EN"}</span>
    </button>
  );
}
