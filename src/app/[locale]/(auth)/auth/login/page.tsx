import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const t = useTranslations("pages.auth.login");

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col gap-10 px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {t("tagline")}
        </p>
        <h1 className="text-3xl font-semibold text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("description")}
        </p>
      </header>

      <form className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>{t("fields.email.label")}</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={t("fields.email.placeholder")}
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
            className="rounded-lg border border-border/60 bg-background px-4 py-3 text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <Button type="submit" className="mt-2" size="lg">
          {t("cta")}
        </Button>
      </form>

      <footer className="flex flex-col gap-2 text-center text-xs text-muted-foreground">
        <p>{t("helper.demo")}</p>
        <a
          href="mailto:contact@health-ortho.fr"
          className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("helper.contact")}
        </a>
      </footer>
    </section>
  );
}
