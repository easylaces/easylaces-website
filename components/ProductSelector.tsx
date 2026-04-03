"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { COLORS, PRICE } from "@/types";
import Image from "next/image";

const PRODUCT_IMAGES = [
  "/images/hero-formal.jpg",
  "/images/hero-casual.jpg",
  "/images/hero-jeans.jpg",
  "/images/hero-closeup.jpg",
];

// Clip position per image (% of container). Each image can have multiple clips visible.
const CLIP_OVERLAYS: { top: string; left: string; w: string; h: string }[][] = [
  // hero-formal.jpg — small clip on front-right shoe tongue
  [{ top: "67%", left: "52%", w: "5%", h: "4%" }],
  // hero-casual.jpg — clip on front shoe tongue
  [{ top: "37%", left: "45.5%", w: "6%", h: "6%" }],
  // hero-jeans.jpg — clips on both shoes
  [
    { top: "49%", left: "46%", w: "6%", h: "4.5%" },
    { top: "36%", left: "31%", w: "5%", h: "3.5%" },
  ],
  // hero-closeup.jpg — large prominent clip
  [{ top: "46%", left: "39%", w: "12%", h: "10%" }],
];

export default function ProductSelector() {
  const { t, locale } = useI18n();
  const [selectedColor, setSelectedColor] = useState(COLORS[0].id);
  const [activeImage, setActiveImage] = useState(0);

  const activeColor = COLORS.find((c) => c.id === selectedColor)!;

  const scrollToOrder = () => {
    const orderSection = document.querySelector("#order");
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(
        new CustomEvent("easylaces-select-color", { detail: selectedColor })
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
                alt={`EasyLaces Clip - ${activeColor.name[locale]}`}
                fill
                className="object-cover transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Clip color overlays — recolors the dark clip using lighten blend */}
              {CLIP_OVERLAYS[activeImage]?.map((pos, idx) => (
                <div
                  key={idx}
                  className="absolute rounded-sm transition-colors duration-500"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    width: pos.w,
                    height: pos.h,
                    backgroundColor: activeColor.hex,
                    mixBlendMode: "lighten",
                  }}
                />
              ))}
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

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-2 text-3xl font-bold text-primary">
              {t("product.name")}
            </h3>
            <div className="mb-6 flex items-baseline gap-3">
              <p className="text-4xl font-extrabold text-accent">
                €{PRICE.toFixed(2)}
              </p>
              <span className="text-sm font-medium text-gray-400">per pair</span>
            </div>

            {/* Color Swatches */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                {t("order.color")}: <span className="normal-case text-primary">{activeColor.name[locale]}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.id
                        ? "border-accent scale-110 shadow-md"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name[locale]}
                  >
                    {selectedColor === color.id && (
                      <Check
                        className="h-5 w-5"
                        style={{
                          color:
                            color.id === "white" ? "#1A1A1A" : "#FFFFFF",
                        }}
                      />
                    )}
                    {color.id === "white" && (
                      <span className="absolute inset-0 rounded-full border border-gray-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature highlights */}
            <div className="mb-8 space-y-3">
              <p className="text-base leading-relaxed text-gray-500">{t("product.specs")}</p>
              <div className="flex flex-wrap gap-2">
                {["Universal fit", "No-tie solution", "Durable clip", "6 colors"].map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 rounded-full bg-cream-dark px-3.5 py-1.5 text-xs font-medium text-gray-600"
                  >
                    <Check className="h-3 w-3 text-accent" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={scrollToOrder}
              className="inline-flex items-center justify-center rounded-full bg-accent px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl"
            >
              {t("product.addToOrder")}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
