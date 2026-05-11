"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function RefundPolicyPage() {
  const { t } = useI18n();

  return (
    <>
      <Header />
      <main className="bg-gradient-to-br from-cream via-cream to-surface pb-20 pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent">
              {t("refundPolicy.subtitle")}
            </span>
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              {t("refundPolicy.title")}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {t("refundPolicy.intro")}
            </p>
          </motion.div>

          {/* Return terms card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                <RotateCcw className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-primary sm:text-2xl">
                {t("refundPolicy.policyTitle")}
              </h2>
            </div>
            <ul className="space-y-3 text-base leading-relaxed text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{t("refundPolicy.policy1")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{t("refundPolicy.policy2")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{t("refundPolicy.policy3")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{t("refundPolicy.policy4")}</span>
              </li>
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-gray-600">
              {t("refundPolicy.contact")}
            </p>
          </motion.section>

          {/* After refund is processed card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 rounded-2xl border border-green-100 bg-green-50/40 p-6 shadow-sm sm:p-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-primary sm:text-2xl">
                {t("refundPolicy.processedTitle")}
              </h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-gray-700">
              <p>{t("refundPolicy.processed1")}</p>
              <p>{t("refundPolicy.processed2")}</p>
              <p>{t("refundPolicy.processed3")}</p>
            </div>
          </motion.section>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <a
              href="https://wa.me/35797661053"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-green-600 hover:shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              {t("success.whatsappCta")}
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-primary transition-all hover:border-accent hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("refundPolicy.backHome")}
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
