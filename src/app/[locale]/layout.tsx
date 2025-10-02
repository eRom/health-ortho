import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  defaultLocale,
  localeLabels,
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
  params: {
    locale: string;
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = (params.locale ?? defaultLocale) as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  const messages = await getDictionary(locale);
  const navigation = [
    {
      href: `/${locale}/neuro`,
      label: messages["layout.nav.neuro"],
    },
    {
      href: `/${locale}/ortho`,
      label: messages["layout.nav.ortho"],
    },
    {
      href: `/${locale}/dashboard`,
      label: messages["layout.nav.dashboard"],
    },
  ];

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#content"
            className="fixed left-4 top-4 z-50 -translate-y-16 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {messages["layout.skipToContent"]}
          </a>

          <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
              <div className="flex items-center gap-4">
                <Link
                  href={`/${locale}`}
                  className="text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
                >
                  Health Ortho
                </Link>

                <nav
                  aria-label={messages["layout.nav.ariaLabel"]}
                  className="flex items-center gap-2 overflow-x-auto text-sm text-muted-foreground"
                >
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full px-3 py-1.5 transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <details className="sm:hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {messages["layout.languageToggle"]}
                    <ChevronDown aria-hidden className="size-3" />
                  </summary>
                  <ul className="mt-3 flex flex-col gap-1 rounded-xl border border-border/60 bg-background/95 p-3 text-sm shadow-lg">
                    {locales.map((loc) => (
                      <li key={loc}>
                        <Link
                          href={`/${loc}`}
                          className="block rounded-lg px-3 py-2 transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-current={loc === locale ? "page" : undefined}
                          lang={loc}
                        >
                          {localeLabels[loc]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>

                <nav aria-label={messages["layout.languageLabel"]} className="hidden sm:block">
                  <ul className="flex items-center gap-2 text-xs text-muted-foreground">
                    {locales.map((loc) => (
                      <li key={loc}>
                        <Link
                          href={`/${loc}`}
                          className="rounded-full px-2 py-1 transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-current={loc === locale ? "page" : undefined}
                          lang={loc}
                        >
                          {localeLabels[loc]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <Button asChild variant="secondary" size="sm">
                  <Link href={`/${locale}/auth/login`}>
                    {messages["layout.nav.login"]}
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <main id="content" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </main>

          <footer className="mt-auto border-t border-border/60 bg-background/80">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span>{messages["footer.legal"]}</span>
              <span>{messages["footer.prototype"]}</span>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
