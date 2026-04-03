"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MapPin,
  Clock,
  MessageCircle,
  ArrowLeft,
  Package,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface OrderDetails {
  color_name: string;
  quantity: string;
  total: string;
  pickup_date: string;
  customer_name: string;
}

function OrderSuccessContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (sessionId) {
      setOrderDetails({
        color_name: "Your selected color",
        quantity: "1",
        total: "€5.99",
        pickup_date: "As selected",
        customer_name: "",
      });
    }
  }, [sessionId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream via-cream to-green-50/50 px-4 py-20">
      {/* Confetti particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-3 w-3 rounded-full"
            style={{
              left: `${10 + (i * 4.2)}%`,
              backgroundColor: ["#2563EB", "#DC2626", "#16A34A", "#EAB308", "#8B5CF6"][
                i % 5
              ],
            }}
            initial={{ top: -20, opacity: 1, scale: 1 }}
            animate={{
              top: "110%",
              opacity: 0,
              rotate: i * 36,
              x: (i % 2 === 0 ? 1 : -1) * (20 + i * 8),
            }}
            transition={{
              duration: 2 + (i % 3),
              delay: i * 0.1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="rounded-2xl bg-cream p-8 shadow-xl sm:p-10">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </motion.div>
          </div>

          <h1 className="mb-2 text-center text-3xl font-bold text-primary">
            {t("success.title")}
          </h1>
          <p className="mb-8 text-center text-gray-500">
            {t("success.subtitle")}
          </p>

          {/* Order Summary */}
          {orderDetails && (
            <div className="mb-6 rounded-xl bg-cream-dark p-5">
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-primary">
                  {t("success.orderSummary")}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("success.product")}</span>
                  <span className="font-medium text-primary">EasyLaces Clip</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("success.color")}</span>
                  <span className="font-medium text-primary">
                    {orderDetails.color_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("success.quantity")}</span>
                  <span className="font-medium text-primary">
                    {orderDetails.quantity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Pickup Info */}
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-primary">
                {t("success.pickupInfo")}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm text-gray-700">
                  {t("success.pickupLocation")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm text-gray-700">
                  {t("success.pickupHours")}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              {t("success.pickupReminder")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/35797661053"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-green-600 hover:shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              {t("success.whatsappCta")}
            </a>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 font-semibold text-primary transition-all hover:border-accent hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("success.backHome")}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
