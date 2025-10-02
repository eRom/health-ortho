import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

interface OrthoPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function OrthoPage({ params }: OrthoPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.ortho" });
  const modules = (t.raw("modules") as string[]) ?? [];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {t("tagline")}
        </p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t("description")}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {modules.map((module) => (
          <Card key={module} className="border-border/60">
            <CardHeader>
              <CardTitle>{module}</CardTitle>
              <CardDescription>{t("moduleDescription")}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
