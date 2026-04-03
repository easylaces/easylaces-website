"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function OrderCancelled() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream via-cream to-red-50/50 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="rounded-2xl bg-cream p-8 shadow-xl sm:p-10">
          {/* Cancel Icon */}
          <div className="mb-6 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100"
            >
              <XCircle className="h-10 w-10 text-red-400" />
            </motion.div>
          </div>

          <h1 className="mb-2 text-center text-3xl font-bold text-primary">
            {t("cancelled.title")}
          </h1>
          <p className="mb-8 text-center text-gray-500">
            {t("cancelled.subtitle")}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/#order"
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-accent-hover hover:shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
              {t("cancelled.tryAgain")}
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 font-semibold text-primary transition-all hover:border-accent hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("cancelled.backHome")}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
