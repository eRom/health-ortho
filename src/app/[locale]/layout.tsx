import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  SiteHeader,
  type SiteHeaderMessages,
  type SiteHeaderSession,
} from "@/components/navigation/site-header";
import { auth } from "@/lib/auth";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

import "../globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101012",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mprincloud.com"),
  title: {
    default: "MPR In Cloud — Rééducation numérique MPR Nantes",
    template: "%s · MPR In Cloud",
  },
  description:
    "Plateforme MPR In Cloud : exercices de neuropsychologie et d'orthophonie, suivi individualisé et accès sécurisé 24/7.",
  keywords: [
    "MPR",
    "rééducation",
    "neuropsychologie",
    "orthophonie",
    "Nantes",
    "santé",
  ],
  authors: [{ name: "MPR In Cloud" }],
  creator: "MPR In Cloud",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://mprincloud.com",
    siteName: "MPR In Cloud",
    title: "MPR In Cloud — Rééducation numérique MPR Nantes",
    description:
      "Plateforme MPR In Cloud : exercices de neuropsychologie et d'orthophonie, suivi individualisé et accès sécurisé 24/7.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MPR In Cloud — Rééducation numérique MPR Nantes",
    description:
      "Plateforme MPR In Cloud : exercices de neuropsychologie et d'orthophonie, suivi individualisé et accès sécurisé 24/7.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://mprincloud.com",
    languages: {
      fr: "https://mprincloud.com/fr",
      en: "https://mprincloud.com/en",
    },
  },
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

export type UnknownSession = {
  session?: {
    user?: {
      id: string;
      email: string;
      name?: string | null;
    } | null;
  } | null;
  user?: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
};

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
  const headerList = await headers();
  const cookieHeader = headerList.get("cookie") ?? "";
  const userAgentHeader = headerList.get("user-agent") ?? undefined;

  const sessionResult = (await auth.api.getSession({
    headers: {
      cookie: cookieHeader,
      ...(userAgentHeader ? { "user-agent": userAgentHeader } : {}),
    },
  })) as UnknownSession | null;

  const sessionUser =
    sessionResult?.user ?? sessionResult?.session?.user ?? null;
  const session: SiteHeaderSession = sessionUser
    ? {
        name: sessionUser.name ?? sessionUser.email,
        email: sessionUser.email,
      }
    : null;

  const layoutMessages = (() => {
    const layout =
      messages && typeof messages === "object" && "layout" in messages
        ? (messages.layout as Record<string, unknown>)
        : {};

    const nav =
      layout && typeof layout === "object" && "nav" in layout
        ? (layout.nav as Record<string, unknown>)
        : {};

    return {
      skipToContent:
        typeof layout.skipToContent === "string" ? layout.skipToContent : "",
      nav: {
        neuro: typeof nav.neuro === "string" ? nav.neuro : "",
        ortho: typeof nav.ortho === "string" ? nav.ortho : "",
        dashboard: typeof nav.dashboard === "string" ? nav.dashboard : "",
        login: typeof nav.login === "string" ? nav.login : "",
        logout: typeof nav.logout === "string" ? nav.logout : "",
        ariaLabel: typeof nav.ariaLabel === "string" ? nav.ariaLabel : "",
      },
      languageLabel:
        typeof layout.languageLabel === "string" ? layout.languageLabel : "",
      languageToggle:
        typeof layout.languageToggle === "string" ? layout.languageToggle : "",
    } satisfies SiteHeaderMessages;
  })();

  return (
    <html
      lang={locale}
      className={`dark ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteHeader
            locale={locale}
            messages={layoutMessages}
            session={session}
          />

          <main id="content" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </main>

          {(() => {
            const footerMessages =
              messages &&
              typeof messages === "object" &&
              "footer" in messages &&
              typeof messages.footer === "object"
                ? (messages.footer as Record<string, string | undefined>)
                : null;

            if (!footerMessages) {
              return null;
            }

            return (
              <footer className="mt-auto border-t border-border/60 bg-background/80">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  {footerMessages?.legal ? (
                    <span>{footerMessages.legal}</span>
                  ) : null}
                  {footerMessages?.prototype ? (
                    <span>{footerMessages.prototype}</span>
                  ) : null}
                </div>
              </footer>
            );
          })()}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
