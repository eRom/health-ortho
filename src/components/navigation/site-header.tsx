import Link from "next/link";
import { memo } from "react";

import { localeLabels, locales, type Locale } from "@/lib/i18n/config";

import { UserMenu } from "@/components/navigation/user-menu";

const localeIcons: Record<string, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
};

interface SiteHeaderProps {
  locale: Locale;
  messages: SiteHeaderMessages;
  session: SiteHeaderSession;
}

export type SiteHeaderMessages = {
  skipToContent: string;
  nav: {
    neuro: string;
    ortho: string;
    dashboard: string;
    login: string;
    logout: string;
    profile: string;
    ariaLabel: string;
  };
  languageLabel: string;
  languageToggle: string;
};

export type SiteHeaderSession = {
  name?: string | null;
  email?: string | null;
} | null;

const LanguageSwitcher = memo(function LanguageSwitcher({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Pick<SiteHeaderMessages, "languageLabel" | "languageToggle">;
}) {
  return (
    <>
      <details className="sm:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {messages.languageToggle}
          <span aria-hidden>▼</span>
        </summary>
        <ul className="mt-3 flex flex-col gap-1 rounded-xl border border-border/60 bg-background/95 p-3 text-sm shadow-lg">
          {locales.map((loc) => (
            <li key={loc}>
              <Link
                href={`/${loc}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-current={loc === locale ? "page" : undefined}
                lang={loc}
                prefetch={false}
              >
                <span aria-hidden>{localeIcons[loc] ?? loc.toUpperCase()}</span>
                <span className="text-xs text-muted-foreground">
                  {localeLabels[loc]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </details>

      <nav aria-label={messages.languageLabel} className="hidden sm:block">
        <ul className="flex items-center gap-2 text-xs text-muted-foreground">
          {locales.map((loc) => (
            <li key={loc}>
              <Link
                href={`/${loc}`}
                className="flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-current={loc === locale ? "page" : undefined}
                lang={loc}
                prefetch={false}
              >
                <span aria-hidden>{localeIcons[loc] ?? loc.toUpperCase()}</span>
                <span className="sr-only">{localeLabels[loc]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
});

export function SiteHeader({ locale, messages, session }: SiteHeaderProps) {
  const navigation = [
    { href: `/${locale}/neuro`, label: messages.nav.neuro },
    { href: `/${locale}/ortho`, label: messages.nav.ortho },
    { href: `/${locale}/dashboard`, label: messages.nav.dashboard },
  ];

  const userDisplayName =
    session?.name || session?.email || localeLabels[locale];

  return (
    <>
      <a
        href="#content"
        className="fixed left-4 top-4 z-50 -translate-y-16 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {messages.skipToContent}
      </a>

      <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-4 overflow-hidden">
            <Link
              href={`/${locale}`}
              className="text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
            >
              MPR In Cloud
            </Link>

            <nav
              aria-label={messages.nav.ariaLabel}
              className="hidden items-center gap-2 overflow-x-auto text-sm text-muted-foreground sm:flex"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  prefetch={false}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher
              locale={locale}
              messages={{
                languageLabel: messages.languageLabel,
                languageToggle: messages.languageToggle,
              }}
            />

            {session ? (
              <UserMenu
                userName={session.name || session.email || "User"}
                userEmail={session.email || ""}
                locale={locale}
                messages={{
                  profile: messages.nav.profile,
                  logout: messages.nav.logout,
                }}
              />
            ) : (
              <Link
                href={`/${locale}/auth/login`}
                className="rounded-full border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                prefetch={false}
              >
                {messages.nav.login}
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
