import type { Locale } from "./config";

type Dictionary = Record<string, string>;

type Dictionaries = Record<Locale, () => Promise<Dictionary>>;

const dictionaries: Dictionaries = {
  fr: () => import("@/locales/fr/common.json").then((mod) => mod.default),
  en: () => import("@/locales/en/common.json").then((mod) => mod.default),
};

export async function getDictionary(locale: Locale) {
  const loadDictionary = dictionaries[locale];
  if (!loadDictionary) {
    throw new Error(`Missing dictionary for locale: ${locale}`);
  }

  return loadDictionary();
}
