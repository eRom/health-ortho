import type { Locale } from "./config";

type Dictionary = Record<string, unknown>;

type Dictionaries = Record<Locale, () => Promise<Dictionary>>;

const dictionaries: Dictionaries = {
  fr: () =>
    import("@/locales/fr/common.json").then((mod) => mod.default as Dictionary),
  en: () =>
    import("@/locales/en/common.json").then((mod) => mod.default as Dictionary),
};

export async function getDictionary(locale: Locale) {
  const loadDictionary = dictionaries[locale];
  if (!loadDictionary) {
    throw new Error(`Missing dictionary for locale: ${locale}`);
  }

  return loadDictionary();
}
