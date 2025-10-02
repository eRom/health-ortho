"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Apple, Chrome, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const t = useTranslations("pages.auth.login");
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackURL =
    searchParams.get("callbackUrl") ?? `/${locale}/dashboard`;

  async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL,
        fetchOptions: {
          throw: false,
        },
      });

      if (result.error) {
        setError(result.error.message ?? t("errors.credentials"));
        return;
      }

      const destination = result.data?.redirect ?? callbackURL;
      router.replace(destination);
    } catch (err) {
      console.error("auth/login", err);
      setError(t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocial(provider: "google" | "apple") {
    setIsSubmitting(true);
    setError(null);

    try {
      await signIn.social({
        provider,
        callbackURL,
      });
    } catch (err) {
      console.error(`auth/login:${provider}`, err);
      setError(t("errors.generic"));
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col gap-10 px-4 py-16 sm:px-6">
      <Card className="border-border/60 bg-background/80 shadow-lg">
        <CardHeader className="flex flex-col gap-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {t("tagline")}
          </p>
          <CardTitle className="text-3xl font-semibold text-foreground">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <form className="flex flex-col gap-4" onSubmit={handleCredentialsSubmit}>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>{t("fields.email.label")}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder={t("fields.email.placeholder")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-lg border border-border/60 bg-background px-4 py-3 text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>{t("fields.password.label")}</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder={t("fields.password.placeholder")}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-lg border border-border/60 bg-background px-4 py-3 text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            {error ? (
              <p className="rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Mail className="mr-2 h-4 w-4" aria-hidden />
              )}
              {t("cta")}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" aria-hidden />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {t("or")}
            </span>
            <div className="h-px flex-1 bg-border/60" aria-hidden />
          </div>

          <div className="grid gap-3">
            <Button
              type="button"
              variant="outline"
              className="justify-start"
              disabled={isSubmitting}
              onClick={() => handleSocial("google")}
            >
              <Chrome className="mr-2 h-4 w-4" aria-hidden />
              {t("providers.google")}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="justify-start"
              disabled={isSubmitting}
              onClick={() => handleSocial("apple")}
            >
              <Apple className="mr-2 h-4 w-4" aria-hidden />
              {t("providers.apple")}
            </Button>
          </div>

          <footer className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
            <p>{t("helper.demo")}</p>
            <a
              href="mailto:contact@health-ortho.fr"
              className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("helper.contact")}
            </a>
          </footer>
        </CardContent>
      </Card>
    </section>
  );
}
