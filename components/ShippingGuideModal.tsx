"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, BookOpen } from "lucide-react";
import Image from "next/image";

interface ShippingGuideModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "shipping" | "howTo";

export default function ShippingGuideModal({ open, onClose }: ShippingGuideModalProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>("shipping");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shipping-guide-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-cream shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-dark px-6 py-4">
              <h3
                id="shipping-guide-title"
                className="text-xl font-bold text-primary"
              >
                {t("modal.title")}
              </h3>
              <button
                onClick={onClose}
                aria-label={t("modal.close")}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-cream-dark">
              <button
                onClick={() => setActiveTab("shipping")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === "shipping"
                    ? "border-b-2 border-accent text-accent"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <Truck className="h-4 w-4" />
                {t("modal.tabShipping")}
              </button>
              <button
                onClick={() => setActiveTab("howTo")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === "howTo"
                    ? "border-b-2 border-accent text-accent"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {t("modal.tabHowTo")}
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5">
              {activeTab === "shipping" ? (
                <ul className="space-y-3 text-base leading-relaxed text-gray-700">
                  <li>{t("modal.shippingBullet1")}</li>
                  <li>{t("modal.shippingBullet2")}</li>
                  <li>{t("modal.shippingBullet3")}</li>
                  <li>{t("modal.shippingBullet4")}</li>
                  <li>{t("modal.shippingBullet5")}</li>
                </ul>
              ) : (
                <div className="space-y-6">
                  <GuideStep
                    src="/images/guide-step1-lace-routing.jpg"
                    title={t("modal.step1Title")}
                    desc={t("modal.step1Desc")}
                  />
                  <GuideStep
                    src="/images/guide-step2-final.jpg"
                    title={t("modal.step2Title")}
                    desc={t("modal.step2Desc")}
                  />
                  <GuideStep
                    src="/images/guide-lace-specs.jpg"
                    title={t("modal.fitTitle")}
                    desc={t("modal.fitDesc")}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GuideStep({ src, title, desc }: { src: string; title: string; desc: string }) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
        <Image
          src={src}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 640px"
        />
      </div>
      <div>
        <h4 className="text-base font-semibold text-primary">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
