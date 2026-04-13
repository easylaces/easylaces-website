"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowDown, Zap, Star, Shield, Truck } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const { t } = useI18n();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-cream via-cream to-surface pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-accent/[0.04]" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-amber-200/20" />
        <div className="absolute left-1/2 top-1/3 h-[200px] w-[200px] -translate-x-1/2 rounded-full bg-accent/[0.03]" />
      </div>

      <div className="relative mx-auto grid max-w-container gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent"
          >
            <Zap className="h-4 w-4 fill-accent" />
            <span>Kings Avenue Mall, Paphos</span>
          </motion.div>

          <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-6xl lg:text-7xl">
            {t("hero.headline")}
          </h1>

          <p className="mb-10 max-w-lg text-lg leading-relaxed text-gray-500 sm:text-xl">
            {t("hero.subheadline")}
          </p>

          <div className="mb-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => scrollTo("#order")}
              className="inline-flex items-center justify-center rounded-full bg-accent px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30"
            >
              {t("hero.cta")}
            </button>
            <button
              onClick={() => scrollTo("#how-it-works")}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white/50 px-10 py-4 text-lg font-semibold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              {t("hero.secondaryCta")}
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 text-sm text-gray-400"
          >
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-600">5.0/5</span> rating
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-500" />
              Secure checkout
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-accent" />
              In-store pickup
            </span>
          </motion.div>
        </motion.div>

        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="relative">
            {/* Glow behind image */}
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/10 to-amber-100/40 blur-2xl" />
            <div className="relative h-[400px] w-[320px] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 sm:h-[520px] sm:w-[400px]">
              <Image
                src="/images/hero-closeup.jpg"
                alt="EasyLaces Clip — Clip & Go, clean laces, clean style"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 640px) 320px, 400px"
              />
            </div>
            {/* Floating price badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-5 -right-5 rounded-2xl border border-white/60 bg-white p-5 shadow-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Only</p>
              <p className="text-3xl font-extrabold text-accent">€6.99</p>
              <p className="text-xs text-gray-400">per pair</p>
            </motion.div>
            {/* Floating rating badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -left-4 top-8 flex items-center gap-2 rounded-xl border border-white/60 bg-white px-4 py-2.5 shadow-xl"
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-primary">5.0</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => scrollTo("#how-it-works")}
          className="animate-bounce text-gray-400 transition-colors hover:text-accent"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </motion.div>
    </section>
  );
}
