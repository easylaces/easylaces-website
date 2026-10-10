"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Star, Shield, Truck, BookOpen } from "lucide-react";
import Image from "next/image";
import ShippingGuideModal from "./ShippingGuideModal";

export default function Hero() {
  const { t } = useI18n();
  const [howToOpen, setHowToOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
    <section className="bg-cream px-3 pb-3 pt-[4.5rem] sm:px-4 sm:pt-20">
      {/* Photo panel, same treatment as /links. Photo: Unsplash 1553808373-92b0bcc3af65 */}
      <div className="relative isolate mx-auto flex min-h-[calc(100svh-5.5rem)] max-w-[1400px] overflow-hidden rounded-[1.75rem] sm:min-h-[calc(100svh-6.5rem)] sm:rounded-[2.25rem]">
        <Image
          src="/images/links-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[50%_40%] lg:object-[50%_55%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/10 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-black/0" />

        <div className="mx-auto flex w-full max-w-container items-end gap-12 px-5 pb-8 pt-24 sm:px-10 sm:pb-12 lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
            className="max-w-2xl"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Truck className="h-4 w-4" />
              {t("hero.badge")}
            </span>

            <h1 className="mb-5 text-[2.75rem] font-extrabold leading-[0.95] text-white [font-stretch:145%] sm:text-6xl lg:text-7xl">
              {t("hero.headline")}
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/80">
              {t("hero.subheadline")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollTo("#order")}
                className="inline-flex items-center justify-center rounded-[1.25rem] bg-accent px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
              >
                {t("hero.cta")}
              </button>
              <button
                onClick={() => setHowToOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-white px-8 py-4 text-lg font-semibold text-primary transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
              >
                <BookOpen className="h-5 w-5" />
                {t("hero.secondaryCta")}
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                5.0/5 rating
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                Secure checkout
              </span>
            </div>
          </motion.div>

          {/* The actual product, desktop only: the background shows the problem, this shows the fix */}
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className="hidden w-[260px] shrink-0 overflow-hidden rounded-[1.25rem] bg-white lg:block"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/hero-closeup.jpg"
                alt="EasyLacesCY Clip on a white sneaker"
                fill
                className="object-cover object-top"
                sizes="260px"
              />
            </div>
            <figcaption className="flex items-baseline justify-between px-4 py-3">
              <span className="font-display text-2xl font-extrabold text-primary [font-stretch:125%]">€6.99</span>
              <span className="text-sm text-gray-500">pack of 4 clips</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
    <ShippingGuideModal
      open={howToOpen}
      onClose={() => setHowToOpen(false)}
      initialTab="howTo"
      singleTab
    />
    </>
  );
}
