import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/navigation/site-header";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  defaultLocale,
  locales,
  type Locale,
} from "@/lib/i18n/config";

import "../globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Health Ortho — Rééducation numérique MPR Nantes",
    template: "%s · Health Ortho",
  },
  description:
    "Plateforme de rééducation MPR de Nantes : exercices de neuropsychologie et d'orthophonie, suivi individualisé et accès sécurisé 24/7.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: paramLocale } = await params;
  const locale = (paramLocale ?? defaultLocale) as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getDictionary(locale);

  return (
    <html lang={locale} className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteHeader locale={locale} />

          <main id="content" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </main>

          <footer className="mt-auto border-t border-border/60 bg-background/80">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span>{messages.footer.legal}</span>
              <span>{messages.footer.prototype}</span>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
