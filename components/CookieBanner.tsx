"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("easylaces-cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash immediately
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("easylaces-cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("easylaces-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md">
      <div className="rounded-2xl border border-cream-dark bg-cream p-5 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-primary">Cookies</span>
          </div>
          <button
            onClick={handleDecline}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-600">{t("cookie.message")}</p>
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {t("cookie.accept")}
          </button>
          <button
            onClick={handleDecline}
            className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300"
          >
            {t("cookie.decline")}
          </button>
        </div>
      </div>
    </div>
  );
}
