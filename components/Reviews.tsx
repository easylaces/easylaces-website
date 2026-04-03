"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import type { Review } from "@/types";

const reviews: Review[] = [
  {
    id: 1,
    name: "Maria K.",
    rating: 5,
    text: {
      en: "Absolutely love these! My kids can now put on their shoes by themselves. No more fighting with laces every morning. Best €5.99 I've ever spent!",
      el: "Τα λατρεύω! Τα παιδιά μου μπορούν τώρα να βάζουν τα παπούτσια τους μόνα τους. Δεν παλεύουμε πια με τα κορδόνια κάθε πρωί. Τα καλύτερα €5.99 που έχω ξοδέψει!",
    },
    verified: true,
    lang: "el",
  },
  {
    id: 2,
    name: "Andreas P.",
    rating: 5,
    text: {
      en: "Got these for my dad who has arthritis. He can now put on his shoes independently again. Such a simple but brilliant invention.",
      el: "Τα πήρα για τον πατέρα μου που έχει αρθρίτιδα. Μπορεί τώρα να φοράει τα παπούτσια του ξανά μόνος του. Τόσο απλή αλλά εξαιρετική εφεύρεση.",
    },
    verified: true,
    lang: "en",
  },
  {
    id: 3,
    name: "Sophie L.",
    rating: 4.5,
    text: {
      en: "I use these for running and they hold up perfectly. Quick to put on, secure fit, and they look sleek. Will buy more colors!",
      el: "Τα χρησιμοποιώ για τρέξιμο και αντέχουν τέλεια. Γρήγορα στην τοποθέτηση, σταθερά και κομψά. Θα αγοράσω κι άλλα χρώματα!",
    },
    verified: true,
    lang: "en",
  },
  {
    id: 4,
    name: "Nikos D.",
    rating: 5,
    text: {
      en: "Bought these as gifts for the whole family. Everyone loves them. The quality is surprisingly good for the price. Highly recommend!",
      el: "Τα αγόρασα ως δώρα για όλη την οικογένεια. Τα αγάπησαν όλοι. Η ποιότητα είναι εκπληκτικά καλή για την τιμή. Τα συνιστώ ανεπιφύλακτα!",
    },
    verified: true,
    lang: "el",
  },
  {
    id: 5,
    name: "Elena M.",
    rating: 5,
    text: {
      en: "As a nurse who's on her feet all day, these are a game-changer. Slip on my shoes and go. No bending down, no fussing with knots.",
      el: "Ως νοσοκόμα που είναι στα πόδια της όλη μέρα, αυτά αλλάζουν τα δεδομένα. Φοράω τα παπούτσια μου και φεύγω. Χωρίς σκύψιμο, χωρίς κόμπους.",
    },
    verified: true,
    lang: "en",
  },
  {
    id: 6,
    name: "Christos A.",
    rating: 4.5,
    text: {
      en: "Simple, effective, and affordable. Works on all my sneakers and dress shoes. Picked them up at Kings Avenue Mall — super convenient!",
      el: "Απλό, αποτελεσματικό και οικονομικό. Λειτουργεί σε όλα τα αθλητικά και επίσημα παπούτσια μου. Τα πήρα από το Kings Avenue Mall — πολύ βολικό!",
    },
    verified: true,
    lang: "el",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : star - 0.5 <= rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { t, locale } = useI18n();

  return (
    <section id="reviews" className="bg-cream-dark py-24 sm:py-32">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent">
            {t("reviews.subtitle")}
          </span>
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">
            {t("reviews.title")}
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl border border-cream-dark bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Quote mark */}
              <span className="absolute -right-2 -top-4 text-7xl font-bold leading-none text-accent/[0.06]">&ldquo;</span>

              <div className="relative">
                <StarRating rating={review.rating} />
                <p className="mt-4 text-base leading-relaxed text-gray-600">{review.text[locale]}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-cream-dark pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-500 text-sm font-bold text-white">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {review.name}
                    </p>
                    {review.verified && (
                      <p className="flex items-center gap-1 text-xs text-green-600">
                        <BadgeCheck className="h-3 w-3" />
                        {t("reviews.verified")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
