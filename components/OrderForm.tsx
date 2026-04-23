"use client";

import { useState, useEffect, FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  Truck,
  Store,
} from "lucide-react";
import {
  COLORS,
  BUNDLES,
  SHIPPING_FEE,
  FREE_SHIPPING_BUNDLE,
} from "@/types";
import type { OrderFormData, FulfillmentMode } from "@/types";

export default function OrderForm() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState<OrderFormData>({
    fullName: "",
    email: "",
    phone: "",
    color: COLORS[0].id,
    colorMix: "",
    quantity: 1,
    fulfillment: "delivery",
    address: "",
    city: "",
    postalCode: "",
    pickupDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Listen for bundle selection from ProductSelector
  useEffect(() => {
    const handler = (e: Event) => {
      const quantity = (e as CustomEvent).detail;
      if (quantity) {
        setForm((prev) => ({ ...prev, quantity }));
      }
    };
    window.addEventListener("easylaces-select-bundle", handler);
    return () => window.removeEventListener("easylaces-select-bundle", handler);
  }, []);

  // Min date = 4 working days from now
  const getMinPickupDate = () => {
    const date = new Date();
    let workingDays = 0;
    while (workingDays < 4) {
      date.setDate(date.getDate() + 1);
      const day = date.getDay();
      if (day !== 0 && day !== 6) workingDays++;
    }
    return date.toISOString().split("T")[0];
  };
  const minDate = getMinPickupDate();

  const bundle = BUNDLES.find((b) => b.quantity === form.quantity) || BUNDLES[0];
  const shippingFee =
    form.fulfillment === "delivery" && form.quantity !== FREE_SHIPPING_BUNDLE
      ? SHIPPING_FEE
      : 0;
  const subtotal = bundle.price;
  const total = (subtotal + shippingFee).toFixed(2);
  const isFreeShipping =
    form.fulfillment === "delivery" && form.quantity === FREE_SHIPPING_BUNDLE;

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

    // Color vs color mix — conditional on quantity
    if (form.quantity === 1) {
      if (!form.color) newErrors.color = t("order.selectColor");
    } else {
      const mix = form.colorMix.trim();
      if (!mix) {
        newErrors.colorMix = t("order.colorMixRequired");
      } else if (mix.length < 3) {
        newErrors.colorMix = t("order.colorMixTooShort");
      }
    }

    // Fulfillment-specific fields
    if (form.fulfillment === "delivery") {
      if (!form.address.trim()) newErrors.address = t("order.addressRequired");
      if (!form.city.trim()) newErrors.city = t("order.cityRequired");
      if (!form.postalCode.trim()) newErrors.postalCode = t("order.postalCodeRequired");
    } else {
      if (!form.pickupDate) {
        newErrors.pickupDate = t("order.required");
      } else if (form.pickupDate < minDate) {
        newErrors.pickupDate = t("order.dateTooEarly");
      }
    }

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

      const data = await res.json();

      if (!res.ok) {
        const code = data.code || "UNKNOWN";
        setSubmitError(`${t("order.error")} (${code})`);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setSubmitError(`${t("order.error")} (NO_CHECKOUT_URL)`);
      }
    } catch {
      setSubmitError(`${t("order.error")} (NETWORK_ERROR)`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof OrderFormData) =>
    `w-full rounded-xl border ${
      errors[field] ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-accent"
    } bg-white/70 px-4 py-3 text-primary placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2`;

  const setFulfillment = (mode: FulfillmentMode) => {
    setForm((prev) => ({ ...prev, fulfillment: mode }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.address;
      delete next.city;
      delete next.postalCode;
      delete next.pickupDate;
      return next;
    });
  };

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
            {/* Fulfillment toggle */}
            <div className="mb-6">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.fulfillmentLabel")} *
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFulfillment("delivery")}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                    form.fulfillment === "delivery"
                      ? "border-accent bg-accent/[0.06] shadow-sm"
                      : "border-gray-200 bg-white/70 hover:border-accent/50"
                  }`}
                >
                  <Truck className={`h-6 w-6 shrink-0 ${form.fulfillment === "delivery" ? "text-accent" : "text-gray-400"}`} />
                  <div>
                    <p className="text-sm font-semibold text-primary">{t("order.deliveryOption")}</p>
                    <p className="text-xs text-gray-500">{t("order.deliveryOptionDesc")}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("pickup")}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                    form.fulfillment === "pickup"
                      ? "border-accent bg-accent/[0.06] shadow-sm"
                      : "border-gray-200 bg-white/70 hover:border-accent/50"
                  }`}
                >
                  <Store className={`h-6 w-6 shrink-0 ${form.fulfillment === "pickup" ? "text-accent" : "text-gray-400"}`} />
                  <div>
                    <p className="text-sm font-semibold text-primary">{t("order.pickupOption")}</p>
                    <p className="text-xs text-gray-500">{t("order.pickupOptionDesc")}</p>
                  </div>
                </button>
              </div>
            </div>

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

            {/* Quantity (Bundle) */}
            <div className="mb-5">
              <label className="mb-2 block text-base font-medium text-primary">
                {t("order.quantity")}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BUNDLES.map((b) => (
                  <button
                    key={b.quantity}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, quantity: b.quantity }))
                    }
                    className={`relative rounded-xl border-2 px-3 py-3 text-center transition-all ${
                      form.quantity === b.quantity
                        ? "border-accent bg-accent/[0.06] shadow-sm"
                        : "border-gray-200 bg-white/70 hover:border-accent/50"
                    }`}
                  >
                    <p className={`text-lg font-bold ${
                      form.quantity === b.quantity ? "text-accent" : "text-primary"
                    }`}>
                      {b.quantity}x
                    </p>
                    <p className="text-[11px] text-gray-500">{b.quantity * 2} {t("product.pairsCount")}</p>
                    <p className="text-xs font-semibold text-gray-600">€{b.price.toFixed(2)}</p>
                    {b.bestSeller && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                        Best
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection (1x) or Mix (2x+) */}
            <div className="mb-5">
              {form.quantity === 1 ? (
                <>
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
                </>
              ) : (
                <>
                  <label className="mb-2 block text-base font-medium text-primary">
                    {t("order.colorMixLabel")} *
                  </label>
                  <input
                    type="text"
                    value={form.colorMix}
                    maxLength={200}
                    placeholder={t("order.colorMixPlaceholder")}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, colorMix: e.target.value }))
                    }
                    className={inputClass("colorMix")}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("order.colorMixHelper").replace("{count}", String(form.quantity))}
                  </p>
                  {errors.colorMix && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.colorMix}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Delivery address (delivery) or Pickup date (pickup) */}
            {form.fulfillment === "delivery" ? (
              <>
                <div className="mb-5">
                  <label className="mb-2 block text-base font-medium text-primary">
                    {t("order.addressLabel")} *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    placeholder={t("order.addressPlaceholder")}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className={inputClass("address")}
                  />
                  {errors.address && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.address}
                    </p>
                  )}
                </div>
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-base font-medium text-primary">
                      {t("order.cityLabel")} *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className={inputClass("city")}
                    />
                    {errors.city && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-base font-medium text-primary">
                      {t("order.postalCodeLabel")} *
                    </label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, postalCode: e.target.value }))
                      }
                      className={inputClass("postalCode")}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-base font-medium text-primary">
                    {t("order.countryLabel")}
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600">
                    <span aria-hidden>🇨🇾</span>
                    <span className="text-sm font-medium">Cyprus</span>
                  </div>
                </div>
              </>
            ) : (
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
                <p className="mt-1 text-xs text-gray-500">
                  {t("order.pickupConfirmNote")}
                </p>
                {errors.pickupDate && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.pickupDate}
                  </p>
                )}
              </div>
            )}

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

            {/* Subtotal / Shipping / Total */}
            <div className="mb-6 space-y-2 rounded-xl border border-accent/10 bg-accent/[0.04] p-5">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{t("order.total")} ({form.quantity}x)</span>
                <span className="font-semibold text-primary">€{subtotal.toFixed(2)}</span>
              </div>
              {form.fulfillment === "delivery" && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{t("order.shippingFeeLabel")}</span>
                  {isFreeShipping ? (
                    <span className="font-semibold text-green-600">
                      {t("order.freeShippingChip")}
                    </span>
                  ) : (
                    <span className="font-semibold text-primary">€{shippingFee.toFixed(2)}</span>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-semibold text-primary">
                  {t("order.total")}
                </span>
                <span className="text-3xl font-extrabold text-accent">€{total}</span>
              </div>
            </div>

            {/* Processing time notice */}
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent/10 bg-accent/[0.04] p-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-gray-600">
                {t("order.processingTime")}
              </p>
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
