"use client";

import { useState, useEffect, FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ShoppingBag, Check, AlertCircle, Loader2 } from "lucide-react";
import { COLORS, PRICE } from "@/types";
import type { OrderFormData } from "@/types";

export default function OrderForm() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState<OrderFormData>({
    fullName: "",
    email: "",
    phone: "",
    color: "",
    quantity: 1,
    pickupDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Listen for color selection from ProductSelector
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setForm((prev) => ({ ...prev, color: detail }));
      }
    };
    window.addEventListener("easylaces-select-color", handler);
    return () => window.removeEventListener("easylaces-select-color", handler);
  }, []);

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const total = (form.quantity * PRICE).toFixed(2);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!form.fullName.trim()) newErrors.fullName = t("order.required");
    if (!form.email.trim()) {
      newErrors.email = t("order.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("order.invalidEmail");
    }
    if (!form.phone.trim()) {
      newErrors.phone = t("order.required");
    } else if (!/^[+]?[\d\s()-]{7,}$/.test(form.phone)) {
      newErrors.phone = t("order.invalidPhone");
    }
    if (!form.color) newErrors.color = t("order.selectColor");
    if (!form.pickupDate) newErrors.pickupDate = t("order.required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });

      if (!res.ok) {
        throw new Error("Checkout failed");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch {
      setSubmitError(t("order.error"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof OrderFormData) =>
    `w-full rounded-xl border ${
      errors[field] ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-accent"
    } bg-white/70 px-4 py-3 text-primary placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2`;

  return (
    <section id="order" className="relative bg-cream-dark py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-accent/[0.03]" />
        <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-amber-100/20" />
      </div>

      <div className="relative mx-auto max-w-container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent">
            {t("order.subtitle")}
          </span>
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">
            {t("order.title")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-cream-dark bg-cream p-6 shadow-lg sm:p-10"
            noValidate
          >
            {/* Full Name */}
            <div className="mb-5">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.fullName")} *
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className={inputClass("fullName")}
              />
              {errors.fullName && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.email")} *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.phone")} *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-5">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.color")} *
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, color: color.id }))
                    }
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      form.color === color.id
                        ? "border-accent scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name[locale]}
                  >
                    {form.color === color.id && (
                      <Check
                        className="h-4 w-4"
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
              {form.color && (
                <p className="mt-2 text-sm text-gray-500">
                  {COLORS.find((c) => c.id === form.color)?.name[locale]}
                </p>
              )}
              {errors.color && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.color}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.quantity")}
              </label>
              <select
                value={form.quantity}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value),
                  }))
                }
                className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-primary transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div className="mb-5">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.pickupDate")} *
              </label>
              <input
                type="date"
                value={form.pickupDate}
                min={minDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, pickupDate: e.target.value }))
                }
                className={inputClass("pickupDate")}
              />
              {errors.pickupDate && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.pickupDate}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.notes")}
              </label>
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={3}
                placeholder={t("order.notesPlaceholder")}
                className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-primary placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Total */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-accent/10 bg-accent/[0.04] p-5">
              <span className="text-lg font-semibold text-primary">
                {t("order.total")}
              </span>
              <span className="text-3xl font-extrabold text-accent">€{total}</span>
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-600">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-5 text-xl font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("order.processing")}
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  {t("order.payButton")} — €{total}
                </>
              )}
            </button>

            {/* Notes */}
            <div className="mt-4 space-y-2 text-center">
              <p className="text-xs text-gray-400">{t("order.confirmNote")}</p>
              <p className="text-xs font-medium text-gray-500">
                {t("order.pickupNote")}
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
