import { getTranslations } from "next-intl/server";

import { LoginForm } from "./login-form";

interface LoginPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.auth.login" });

  const messages = {
    tagline: t("tagline"),
    title: t("title"),
    description: t("description"),
    cta: t("cta"),
    orLabel: t("or"),
    fields: {
      email: {
        label: t("fields.email.label"),
        placeholder: t("fields.email.placeholder"),
      },
      password: {
        label: t("fields.password.label"),
        placeholder: t("fields.password.placeholder"),
      },
    },
    errors: {
      credentials: t("errors.credentials"),
      generic: t("errors.generic"),
    },
    providers: {
      google: t("providers.google"),
      apple: t("providers.apple"),
    },
    helper: {
      demo: t("helper.demo"),
      contact: t("helper.contact"),
    },
  } as const;

  return (
    <LoginForm
      locale={locale}
      callbackURL={`/${locale}/dashboard`}
      contactEmail="contact@health-ortho.fr"
      messages={messages}
    />
  );
}
