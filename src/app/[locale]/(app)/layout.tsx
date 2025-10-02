import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/lib/auth";

interface ProtectedAppLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function ProtectedAppLayout({
  children,
  params,
}: ProtectedAppLayoutProps) {
  const { locale } = await params;
  const incomingHeaders = headers();
  const headerInit = new Headers();
  incomingHeaders.forEach((value, key) => {
    headerInit.append(key, value);
  });

  const { data, error } = await auth.api.getSession({
    fetchOptions: {
      headers: headerInit,
    },
  });

  if (error || !data) {
    const callback = encodeURIComponent(`/${locale}/dashboard`);
    redirect(`/${locale}/auth/login?callbackUrl=${callback}`);
  }

  return <>{children}</>;
}
