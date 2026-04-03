"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Language } from "@/types";
import en from "@/messages/en.json";
import el from "@/messages/el.json";

const messages = { en, el } as const;

type Messages = typeof en;

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
        : Prefix extends ""
        ? K
        : `${Prefix}.${K}`;
    }[keyof T & string]
  : never;

type TranslationKey = NestedKeyOf<Messages>;

interface I18nContextType {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("easylaces-lang") as Language | null;
    if (saved && (saved === "en" || saved === "el")) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((lang: Language) => {
    setLocaleState(lang);
    localStorage.setItem("easylaces-lang", lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return getNestedValue(messages[locale] as unknown as Record<string, unknown>, key);
    },
    [locale]
  );

  if (!mounted) {
    return (
      <I18nContext.Provider value={{ locale: "en", setLocale, t: (key) => getNestedValue(en as unknown as Record<string, unknown>, key) }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
