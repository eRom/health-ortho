import { getRequestConfig } from "next-intl/server";

import { defaultLocale, locales } from "./src/lib/i18n/config";

const dictionaries = {
  fr: () => import("./src/locales/fr/common.json").then((mod) => mod.default),
  en: () => import("./src/locales/en/common.json").then((mod) => mod.default),
};

type SupportedLocale = keyof typeof dictionaries;

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locales.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : (defaultLocale as SupportedLocale);

  const messages = await dictionaries[resolvedLocale]();

  return {
    locale: resolvedLocale,
    messages,
  };
});
