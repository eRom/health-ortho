"use client";

import type { SiteHeaderSession } from "@/components/navigation/site-header";
import { setUserContext } from "@/lib/sentry";
import { useEffect } from "react";

interface SentryUserProviderProps {
  session: SiteHeaderSession;
  children: React.ReactNode;
}

/**
 * Provider pour synchroniser automatiquement le contexte utilisateur avec Sentry
 * À utiliser dans le layout principal pour que Sentry connaisse toujours l'utilisateur actif
 */
export function SentryUserProvider({
  session,
  children,
}: SentryUserProviderProps) {
  useEffect(() => {
    if (session?.email) {
      setUserContext({
        id: session.email, // Utiliser email comme ID si pas d'ID dispo
        email: session.email,
        name: session.name || undefined,
      });
    } else {
      setUserContext(null);
    }
  }, [session]);

  return <>{children}</>;
}

