import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-14 px-6 py-16">
      <section className="flex flex-col gap-6 text-center sm:text-left">
        <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
          {t("hero.tagline")}
        </p>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t("hero.description")}
        </p>
      </section>

      <section className="grid gap-8 sm:grid-cols-2">
        <Card className="backdrop-blur border-border/40 bg-background/80">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              {t("hero.modules.title")}
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-muted-foreground">
              {t("hero.modules.body")}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="backdrop-blur border-border/40 bg-background/80">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              {t("hero.stats.title")}
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-muted-foreground">
              {t("hero.stats.body")}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

    </main>
  );
}
