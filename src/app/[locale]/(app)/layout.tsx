import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSafeSession } from "@/lib/safe-auth";

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
  const incomingHeaders = await headers();
  const headerInit = new Headers();
  for (const [key, value] of incomingHeaders.entries()) {
    headerInit.append(key, value);
  }

  const sessionResult = await getSafeSession({
    headers: headerInit,
  });

  if (!sessionResult?.session) {
    const callback = encodeURIComponent(`/${locale}/dashboard`);
    redirect(`/${locale}/auth/login?callbackUrl=${callback}`);
  }

  return <>{children}</>;
}
