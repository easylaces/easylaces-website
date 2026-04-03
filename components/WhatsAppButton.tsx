"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppButton() {
  const { t } = useI18n();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {showTooltip && (
        <div className="absolute bottom-16 right-0 mb-2 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-sm text-cream shadow-lg">
          {t("whatsapp.tooltip")}
          <button
            onClick={() => setShowTooltip(false)}
            className="ml-2 inline-flex items-center"
            aria-label="Close tooltip"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <a
        href="https://wa.me/35797661053"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-all hover:scale-110 hover:bg-green-600 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
