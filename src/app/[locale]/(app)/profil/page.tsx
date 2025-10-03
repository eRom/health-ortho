import { Calendar, LogOut, Mail, User } from "lucide-react";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/navigation/sign-out-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSafeSession } from "@/lib/safe-auth";

interface ProfilPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function ProfilPage({ params }: ProfilPageProps) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  // Récupérer la session
  const incomingHeaders = await import("next/headers").then((mod) => mod.headers());
  const headerInit = new Headers();
  for (const [key, value] of incomingHeaders.entries()) {
    headerInit.append(key, value);
  }

  const session = await getSafeSession({
    headers: headerInit,
  });

  // Rediriger vers login si pas de session
  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const user = session.user;
  const createdAt = new Date(user.createdAt);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(createdAt);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-4 py-16 sm:px-6">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t.pages.profil?.tagline || "Mon compte"}
          </p>
          <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
            {t.pages.profil?.title || "Profil utilisateur"}
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t.pages.profil?.description || "Gérez vos informations personnelles et vos préférences."}
          </p>
        </div>
      </section>

      <section className="grid gap-6">
        <Card className="border-border/60 bg-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" aria-hidden="true" />
              {t.pages.profil?.sections?.personal?.title || "Informations personnelles"}
            </CardTitle>
            <CardDescription>
              {t.pages.profil?.sections?.personal?.description || "Vos informations de compte"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">
                  {t.pages.profil?.fields?.name || "Nom"}:
                </span>
              </div>
              <p className="text-base text-foreground">{user.name}</p>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">
                  {t.pages.profil?.fields?.email || "Email"}:
                </span>
              </div>
              <p className="text-base text-foreground">{user.email}</p>
              {user.emailVerified ? (
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✓ {t.pages.profil?.fields?.emailVerified || "Email vérifié"}
                </span>
              ) : (
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  ⚠ {t.pages.profil?.fields?.emailNotVerified || "Email non vérifié"}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">
                  {t.pages.profil?.fields?.createdAt || "Membre depuis"}:
                </span>
              </div>
              <p className="text-base text-foreground">{formattedDate}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" aria-hidden="true" />
              {t.pages.profil?.sections?.actions?.title || "Actions"}
            </CardTitle>
            <CardDescription>
              {t.pages.profil?.sections?.actions?.description || "Gérer votre session"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignOutButton
              label={t.layout.nav.logout}
              callbackUrl={`/${locale}`}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

