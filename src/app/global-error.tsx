"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Capturer l'erreur globale dans Sentry
    Sentry.captureException(error, {
      level: "fatal",
      tags: {
        errorBoundary: "global-error",
      },
    });
    
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="fr" className="dark">
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md rounded-xl border border-border/60 bg-card p-6 text-center shadow-lg">
            <h1 className="mb-2 text-2xl font-semibold text-foreground">
              Erreur Critique
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Une erreur critique s&apos;est produite. Nous en avons été notifiés
              et travaillons à la résoudre.
            </p>
            
            {process.env.NODE_ENV === "development" && (
              <pre className="mb-6 overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
                {error.message}
              </pre>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Réessayer
              </button>
              <Link
                href="/"
                className="flex-1 rounded-lg border border-border/60 px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-accent/40"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
            
            {error.digest && (
              <p className="mt-4 text-xs text-muted-foreground">
                Code: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

