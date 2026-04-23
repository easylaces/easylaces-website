"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle } from "lucide-react";

export default function StoreLocation() {
  const { t } = useI18n();

  return (
    <section id="find-us" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent">
            {t("location.subtitle")}
          </span>
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">
            {t("location.title")}
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1640.5!2d32.41342!3d34.76579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14e706f1b47f4c8f%3A0x5765d56657ca877a!2sKings%20Avenue%20Mall!5e0!3m2!1sen!2scy!4v1700000000000!5m2!1sen!2scy"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kings Avenue Mall, Paphos"
              className="h-[300px] w-full sm:h-[400px]"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-primary">
                    {t("location.address")}
                  </p>
                  <p className="text-base text-gray-500">
                    Kings Avenue Mall, Paphos 8046, Cyprus
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-primary">
                    {t("location.phone")}
                  </p>
                  <a
                    href="tel:+35797661053"
                    className="text-base text-accent hover:underline"
                  >
                    +357 97 661 053
                  </a>
                </div>
              </div>

              {/* "Not a physical store" note */}
              <div className="rounded-xl border border-accent/15 bg-accent/[0.04] p-4">
                <p className="text-sm leading-relaxed text-gray-700">
                  {t("location.notAStore")}
                </p>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/35797661053"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-green-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-green-600 hover:shadow-xl"
              >
                <MessageCircle className="h-5 w-5" />
                {t("location.whatsapp")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
