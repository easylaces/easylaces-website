"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Check, Star, Truck } from "lucide-react";
import { BUNDLES, PRICE, FREE_SHIPPING_BUNDLE } from "@/types";
import Image from "next/image";
import ShippingGuideModal from "./ShippingGuideModal";

const PRODUCT_IMAGES = [
  "/images/hero-formal.jpg",
  "/images/hero-casual.jpg",
  "/images/hero-jeans.jpg",
  "/images/hero-closeup.jpg",
];

export default function ProductSelector() {
  const { t } = useI18n();
  const [activeImage, setActiveImage] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);

  const scrollToOrder = (quantity: number) => {
    const orderSection = document.querySelector("#order");
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(
        new CustomEvent("easylaces-select-bundle", { detail: quantity })
      );
    }
  };

  return (
    <section id="colors" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent">
            {t("product.subtitle")}
          </span>
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">
            {t("product.title")}
          </h2>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Main image */}
            <div className="relative h-[350px] w-full max-w-[450px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 sm:h-[450px]">
              <Image
                src={PRODUCT_IMAGES[activeImage]}
                alt="EasyLaces Clip"
                fill
                className="object-cover transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail gallery */}
            <div className="flex gap-3">
              {PRODUCT_IMAGES.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20 ${
                    activeImage === i
                      ? "border-accent shadow-md ring-2 ring-accent/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Product view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Bundle Options */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-2 text-3xl font-bold text-primary">
              {t("product.name")}
            </h3>
            <p className="mb-3 text-base leading-relaxed text-gray-500">
              {t("product.specs")}
            </p>
            <p className="mb-6 text-sm font-medium text-accent/80">
              {t("product.packInfo")}
            </p>

            {/* Bundle Cards */}
            <div className="mb-8 space-y-3">
              {BUNDLES.map((bundle) => {
                const clips = bundle.quantity * 4;
                const pairs = bundle.quantity * 2;
                const fullPrice = bundle.quantity * PRICE;
                const savings = fullPrice - bundle.price;
                const hasSavings = savings > 0.5;
                const savingsPercent = hasSavings ? Math.round((savings / fullPrice) * 100) : 0;

                return (
                  <button
                    key={bundle.quantity}
                    onClick={() => scrollToOrder(bundle.quantity)}
                    className={`group relative flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${
                      bundle.bestSeller
                        ? "border-accent bg-accent/[0.06] shadow-lg ring-1 ring-accent/20 scale-[1.02]"
                        : "border-gray-200 bg-white/70 hover:border-accent/50"
                    }`}
                  >
                    {/* Best seller badge */}
                    {bundle.bestSeller && (
                      <div className="absolute -top-3.5 left-4 flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white shadow-md">
                        <Star className="h-3.5 w-3.5 fill-white" />
                        {t("product.bestSeller")}
                      </div>
                    )}

                    {/* Left: quantity & details */}
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-extrabold ${
                        bundle.bestSeller
                          ? "bg-accent text-white shadow-sm"
                          : "bg-cream-dark text-primary"
                      }`}>
                        {bundle.quantity}x
                      </div>
                      <div>
                        <p className="text-base font-semibold text-primary">
                          {clips} {t("product.clipsCount")} · {pairs} {t("product.pairsCount")}
                        </p>
                        {hasSavings && (
                          <p className={`text-sm font-bold ${
                            bundle.bestSeller ? "text-green-600" : "text-green-600"
                          }`}>
                            {t("product.save")} €{savings.toFixed(2)} ({savingsPercent}%)
                          </p>
                        )}
                        {bundle.quantity === FREE_SHIPPING_BUNDLE && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                            <Truck className="h-3 w-3" />
                            {t("product.freeShippingBadge")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: price */}
                    <div className="text-right">
                      <p className={`text-2xl font-extrabold ${
                        bundle.bestSeller ? "text-accent" : "text-primary"
                      }`}>
                        €{bundle.price.toFixed(2)}
                      </p>
                      {bundle.quantity > 1 && (
                        <p className="text-xs text-gray-400">
                          €{(bundle.price / bundle.quantity).toFixed(2)} {t("product.perPack")}
                        </p>
                      )}
                    </div>

                    {/* Hover arrow */}
                    <div className="ml-3 text-gray-300 transition-colors group-hover:text-accent">
                      <Check className="h-5 w-5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Delivery info + guide modal trigger */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-accent/15 bg-accent/[0.04] px-4 py-3">
              <p className="text-sm font-medium text-gray-700">
                {t("product.deliveryInfo")}
              </p>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="shrink-0 text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                {t("product.readMore")}
              </button>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-2">
              {["Universal fit", "No-tie solution", "Durable clip", "4 clips per pack"].map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cream-dark px-3.5 py-1.5 text-xs font-medium text-gray-600"
                >
                  <Check className="h-3 w-3 text-accent" />
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <ShippingGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </section>
  );
}
