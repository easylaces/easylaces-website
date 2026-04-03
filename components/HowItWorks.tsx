"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Paperclip, Lock, Footprints } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    icon: Paperclip,
    titleKey: "step1Title",
    descKey: "step1Desc",
    number: "01",
    image: "/images/hero-casual.jpg",
    alt: "Clip the EasyLaces onto your shoe",
  },
  {
    icon: Lock,
    titleKey: "step2Title",
    descKey: "step2Desc",
    number: "02",
    image: "/images/hero-closeup.jpg",
    alt: "Pull laces through the clip and lock",
  },
  {
    icon: Footprints,
    titleKey: "step3Title",
    descKey: "step3Desc",
    number: "03",
    image: "/images/hero-jeans.jpg",
    alt: "Walk away with secure, no-tie shoes",
  },
] as const;

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how-it-works" className="relative bg-cream-dark py-24 sm:py-32">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent">
            {t("howItWorks.subtitle")}
          </span>
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">
            {t("howItWorks.title")}
          </h2>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Connecting line (desktop only) */}
          <div className="absolute left-0 right-0 top-[160px] hidden h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent md:block" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative overflow-hidden rounded-2xl border border-cream-dark bg-cream shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Step image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-md">
                    {step.number}
                  </span>
                </div>

                {/* Step content */}
                <div className="p-6">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/15">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-primary">
                    {t(`howItWorks.${step.titleKey}` as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-500">
                    {t(`howItWorks.${step.descKey}` as Parameters<typeof t>[0])}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
