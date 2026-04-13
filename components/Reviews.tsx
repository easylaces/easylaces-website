"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import type { Review } from "@/types";
import type { ReviewsResponse, ReviewData } from "@/app/api/reviews/route";

// Static fallback reviews (shown when Google reviews aren't available)
const staticReviews: Review[] = [
  {
    id: 1,
    name: "Maria K.",
    rating: 5,
    text: {
      en: "Absolutely love these! My kids can now put on their shoes by themselves. No more fighting with laces every morning. Best \u20ac6.99 I've ever spent!",
      el: "\u03a4\u03b1 \u03bb\u03b1\u03c4\u03c1\u03b5\u03cd\u03c9! \u03a4\u03b1 \u03c0\u03b1\u03b9\u03b4\u03b9\u03ac \u03bc\u03bf\u03c5 \u03bc\u03c0\u03bf\u03c1\u03bf\u03cd\u03bd \u03c4\u03ce\u03c1\u03b1 \u03bd\u03b1 \u03b2\u03ac\u03b6\u03bf\u03c5\u03bd \u03c4\u03b1 \u03c0\u03b1\u03c0\u03bf\u03cd\u03c4\u03c3\u03b9\u03b1 \u03c4\u03bf\u03c5\u03c2 \u03bc\u03cc\u03bd\u03b1 \u03c4\u03bf\u03c5\u03c2. \u0394\u03b5\u03bd \u03c0\u03b1\u03bb\u03b5\u03cd\u03bf\u03c5\u03bc\u03b5 \u03c0\u03b9\u03b1 \u03bc\u03b5 \u03c4\u03b1 \u03ba\u03bf\u03c1\u03b4\u03cc\u03bd\u03b9\u03b1 \u03ba\u03ac\u03b8\u03b5 \u03c0\u03c1\u03c9\u03af. \u03a4\u03b1 \u03ba\u03b1\u03bb\u03cd\u03c4\u03b5\u03c1\u03b1 \u20ac6.99 \u03c0\u03bf\u03c5 \u03ad\u03c7\u03c9 \u03be\u03bf\u03b4\u03ad\u03c8\u03b5\u03b9!",
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
      el: "\u03a4\u03b1 \u03c0\u03ae\u03c1\u03b1 \u03b3\u03b9\u03b1 \u03c4\u03bf\u03bd \u03c0\u03b1\u03c4\u03ad\u03c1\u03b1 \u03bc\u03bf\u03c5 \u03c0\u03bf\u03c5 \u03ad\u03c7\u03b5\u03b9 \u03b1\u03c1\u03b8\u03c1\u03af\u03c4\u03b9\u03b4\u03b1. \u039c\u03c0\u03bf\u03c1\u03b5\u03af \u03c4\u03ce\u03c1\u03b1 \u03bd\u03b1 \u03c6\u03bf\u03c1\u03ac\u03b5\u03b9 \u03c4\u03b1 \u03c0\u03b1\u03c0\u03bf\u03cd\u03c4\u03c3\u03b9\u03b1 \u03c4\u03bf\u03c5 \u03be\u03b1\u03bd\u03ac \u03bc\u03cc\u03bd\u03bf\u03c2 \u03c4\u03bf\u03c5. \u03a4\u03cc\u03c3\u03bf \u03b1\u03c0\u03bb\u03ae \u03b1\u03bb\u03bb\u03ac \u03b5\u03be\u03b1\u03b9\u03c1\u03b5\u03c4\u03b9\u03ba\u03ae \u03b5\u03c6\u03b5\u03cd\u03c1\u03b5\u03c3\u03b7.",
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
      el: "\u03a4\u03b1 \u03c7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03b9\u03ce \u03b3\u03b9\u03b1 \u03c4\u03c1\u03ad\u03be\u03b9\u03bc\u03bf \u03ba\u03b1\u03b9 \u03b1\u03bd\u03c4\u03ad\u03c7\u03bf\u03c5\u03bd \u03c4\u03ad\u03bb\u03b5\u03b9\u03b1. \u0393\u03c1\u03ae\u03b3\u03bf\u03c1\u03b1 \u03c3\u03c4\u03b7\u03bd \u03c4\u03bf\u03c0\u03bf\u03b8\u03ad\u03c4\u03b7\u03c3\u03b7, \u03c3\u03c4\u03b1\u03b8\u03b5\u03c1\u03ac \u03ba\u03b1\u03b9 \u03ba\u03bf\u03bc\u03c8\u03ac. \u0398\u03b1 \u03b1\u03b3\u03bf\u03c1\u03ac\u03c3\u03c9 \u03ba\u03b9 \u03ac\u03bb\u03bb\u03b1 \u03c7\u03c1\u03ce\u03bc\u03b1\u03c4\u03b1!",
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
      el: "\u03a4\u03b1 \u03b1\u03b3\u03cc\u03c1\u03b1\u03c3\u03b1 \u03c9\u03c2 \u03b4\u03ce\u03c1\u03b1 \u03b3\u03b9\u03b1 \u03cc\u03bb\u03b7 \u03c4\u03b7\u03bd \u03bf\u03b9\u03ba\u03bf\u03b3\u03ad\u03bd\u03b5\u03b9\u03b1. \u03a4\u03b1 \u03b1\u03b3\u03ac\u03c0\u03b7\u03c3\u03b1\u03bd \u03cc\u03bb\u03bf\u03b9. \u0397 \u03c0\u03bf\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1 \u03b5\u03af\u03bd\u03b1\u03b9 \u03b5\u03ba\u03c0\u03bb\u03b7\u03ba\u03c4\u03b9\u03ba\u03ac \u03ba\u03b1\u03bb\u03ae \u03b3\u03b9\u03b1 \u03c4\u03b7\u03bd \u03c4\u03b9\u03bc\u03ae. \u03a4\u03b1 \u03c3\u03c5\u03bd\u03b9\u03c3\u03c4\u03ce \u03b1\u03bd\u03b5\u03c0\u03b9\u03c6\u03cd\u03bb\u03b1\u03ba\u03c4\u03b1!",
    },
    verified: true,
    lang: "el",
  },
  {
    id: 5,
    name: "Elena M.",
    rating: 5,
    text: {
      en: "As a nurse who\u2019s on her feet all day, these are a game-changer. Slip on my shoes and go. No bending down, no fussing with knots.",
      el: "\u03a9\u03c2 \u03bd\u03bf\u03c3\u03bf\u03ba\u03cc\u03bc\u03b1 \u03c0\u03bf\u03c5 \u03b5\u03af\u03bd\u03b1\u03b9 \u03c3\u03c4\u03b1 \u03c0\u03cc\u03b4\u03b9\u03b1 \u03c4\u03b7\u03c2 \u03cc\u03bb\u03b7 \u03bc\u03ad\u03c1\u03b1, \u03b1\u03c5\u03c4\u03ac \u03b1\u03bb\u03bb\u03ac\u03b6\u03bf\u03c5\u03bd \u03c4\u03b1 \u03b4\u03b5\u03b4\u03bf\u03bc\u03ad\u03bd\u03b1. \u03a6\u03bf\u03c1\u03ac\u03c9 \u03c4\u03b1 \u03c0\u03b1\u03c0\u03bf\u03cd\u03c4\u03c3\u03b9\u03b1 \u03bc\u03bf\u03c5 \u03ba\u03b1\u03b9 \u03c6\u03b5\u03cd\u03b3\u03c9. \u03a7\u03c9\u03c1\u03af\u03c2 \u03c3\u03ba\u03cd\u03c8\u03b9\u03bc\u03bf, \u03c7\u03c9\u03c1\u03af\u03c2 \u03ba\u03cc\u03bc\u03c0\u03bf\u03c5\u03c2.",
    },
    verified: true,
    lang: "en",
  },
  {
    id: 6,
    name: "Christos A.",
    rating: 4.5,
    text: {
      en: "Simple, effective, and affordable. Works on all my sneakers and dress shoes. Picked them up at Kings Avenue Mall \u2014 super convenient!",
      el: "\u0391\u03c0\u03bb\u03cc, \u03b1\u03c0\u03bf\u03c4\u03b5\u03bb\u03b5\u03c3\u03bc\u03b1\u03c4\u03b9\u03ba\u03cc \u03ba\u03b1\u03b9 \u03bf\u03b9\u03ba\u03bf\u03bd\u03bf\u03bc\u03b9\u03ba\u03cc. \u039b\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03b5\u03af \u03c3\u03b5 \u03cc\u03bb\u03b1 \u03c4\u03b1 \u03b1\u03b8\u03bb\u03b7\u03c4\u03b9\u03ba\u03ac \u03ba\u03b1\u03b9 \u03b5\u03c0\u03af\u03c3\u03b7\u03bc\u03b1 \u03c0\u03b1\u03c0\u03bf\u03cd\u03c4\u03c3\u03b9\u03b1 \u03bc\u03bf\u03c5. \u03a4\u03b1 \u03c0\u03ae\u03c1\u03b1 \u03b1\u03c0\u03cc \u03c4\u03bf Kings Avenue Mall \u2014 \u03c0\u03bf\u03bb\u03cd \u03b2\u03bf\u03bb\u03b9\u03ba\u03cc!",
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

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Google review card
function GoogleReviewCard({ review, index }: { review: ReviewData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-cream-dark bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="absolute -right-2 -top-4 text-7xl font-bold leading-none text-accent/[0.06]">&ldquo;</span>

      <div className="relative">
        <div className="flex items-center justify-between">
          <StarRating rating={review.rating} />
          <GoogleIcon />
        </div>
        <p className="mt-4 text-base leading-relaxed text-gray-600">{review.text}</p>
        <div className="mt-5 flex items-center gap-3 border-t border-cream-dark pt-4">
          {review.photoUrl ? (
            <img
              src={review.photoUrl}
              alt={review.name}
              className="h-9 w-9 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-500 text-sm font-bold text-white">
              {review.name[0]}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-primary">{review.name}</p>
            <p className="text-xs text-gray-400">{review.relativeTime}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Static review card
function StaticReviewCard({ review, index, locale, verifiedLabel }: {
  review: Review;
  index: number;
  locale: "en" | "el";
  verifiedLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`group relative overflow-hidden rounded-2xl border border-cream-dark bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
      }`}
    >
      <span className="absolute -right-2 -top-4 text-7xl font-bold leading-none text-accent/[0.06]">&ldquo;</span>

      <div className="relative">
        <StarRating rating={review.rating} />
        <p className="mt-4 text-base leading-relaxed text-gray-600">{review.text[locale]}</p>
        <div className="mt-5 flex items-center gap-3 border-t border-cream-dark pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-500 text-sm font-bold text-white">
            {review.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">{review.name}</p>
            {review.verified && (
              <p className="flex items-center gap-1 text-xs text-green-600">
                <BadgeCheck className="h-3 w-3" />
                {verifiedLabel}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Reviews() {
  const { t, locale } = useI18n();
  const [googleReviews, setGoogleReviews] = useState<ReviewData[]>([]);
  const [overallRating, setOverallRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [useGoogle, setUseGoogle] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: ReviewsResponse) => {
        if (data.source === "google" && data.reviews.length > 0) {
          setGoogleReviews(data.reviews);
          setOverallRating(data.overallRating);
          setTotalReviews(data.totalReviews);
          setUseGoogle(true);
        }
      })
      .catch(() => {
        // Silently fall back to static reviews
      });
  }, []);

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

          {/* Google overall rating */}
          {useGoogle && overallRating > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <GoogleIcon />
              <StarRating rating={overallRating} />
              <span className="text-sm text-gray-500">
                {overallRating.toFixed(1)} ({totalReviews} {t("reviews.reviewCount")})
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useGoogle
            ? googleReviews.map((review, i) => (
                <GoogleReviewCard key={review.time} review={review} index={i} />
              ))
            : staticReviews.map((review, i) => (
                <StaticReviewCard
                  key={review.id}
                  review={review}
                  index={i}
                  locale={locale}
                  verifiedLabel={t("reviews.verified")}
                />
              ))
          }
        </div>
      </div>
    </section>
  );
}
