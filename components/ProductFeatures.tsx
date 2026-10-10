"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Leaf,
  Gem,
  Feather,
  Thermometer,
  Ruler,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

const features = [
  { icon: Leaf, titleKey: "ecoTitle", descKey: "ecoDesc" },
  { icon: Gem, titleKey: "craftedTitle", descKey: "craftedDesc" },
  { icon: Feather, titleKey: "durableTitle", descKey: "durableDesc" },
  { icon: Thermometer, titleKey: "heatTitle", descKey: "heatDesc" },
  { icon: Ruler, titleKey: "fitTitle", descKey: "fitDesc" },
  { icon: ShieldCheck, titleKey: "safetyTitle", descKey: "safetyDesc" },
] as const;

export default function ProductFeatures() {
  const { t } = useI18n();

  return (
    <section id="features" className="relative bg-cream py-16 sm:py-32">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:mb-16"
        >
          <span className="mb-3 inline-block text-base font-medium text-gray-500">
            {t("features.subtitle")}
          </span>
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">
            {t("features.title")}
          </h2>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex gap-4 rounded-[1.25rem] border border-cream-dark bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:block sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 ring-2 ring-accent/10 transition-colors group-hover:bg-accent/15 sm:mb-4">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-primary sm:mb-2">
                    {t(`features.${feature.titleKey}` as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {t(`features.${feature.descKey}` as Parameters<typeof t>[0])}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fit tip banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 sm:items-center"
        >
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent sm:mt-0" />
          <p className="text-sm leading-relaxed text-gray-600">
            {t("features.fitTip")}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
