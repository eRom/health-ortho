"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { localeLabels, locales } from "@/lib/i18n/config";

interface SiteHeaderProps {
  locale: string;
}

export function SiteHeader({ locale: layoutLocale }: SiteHeaderProps) {
  const t = useTranslations("layout");
  const locale = useLocale() || layoutLocale;
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navigation = [
    { href: `/${locale}/neuro`, label: t("nav.neuro") },
    { href: `/${locale}/ortho`, label: t("nav.ortho") },
    { href: `/${locale}/dashboard`, label: t("nav.dashboard") },
  ];

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut({ callbackURL: `/${locale}` });
    } catch (error) {
      console.error("sign-out", error);
      setIsSigningOut(false);
    }
  }

  const userDisplayName = session?.user?.name || session?.user?.email || "";

  return (
    <>
      <a
        href="#content"
        className="fixed left-4 top-4 z-50 -translate-y-16 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {t("skipToContent")}
      </a>

      <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-4 overflow-hidden">
            <Link
              href={`/${locale}`}
              className="text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
            >
              Health Ortho
            </Link>

            <nav
              aria-label={t("nav.ariaLabel")}
              className="hidden items-center gap-2 overflow-x-auto text-sm text-muted-foreground sm:flex"
            >
              {navigation.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-3 py-1.5 transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <details className="sm:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/40 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {t("languageToggle")}
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

            <nav aria-label={t("languageLabel")} className="hidden sm:block">
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

            {session ? (
              <div className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
                <span className="max-w-[12rem] truncate" title={userDisplayName}>
                  {userDisplayName}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  ) : null}
                  {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <Button asChild variant="secondary" size="sm" disabled={isPending}>
                <Link href={`/${locale}/auth/login`}>{t("nav.login")}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
