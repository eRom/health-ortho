"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Capturer l'erreur dans Sentry
    Sentry.captureException(error, {
      level: "error",
      tags: {
        errorBoundary: "locale-error",
      },
    });
    
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md border-border/60">
        <CardHeader>
          <CardTitle className="text-2xl">Oups ! Une erreur est survenue</CardTitle>
          <CardDescription>
            Nous sommes désolés, quelque chose s&apos;est mal passé.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {process.env.NODE_ENV === "development" && (
            <pre className="rounded-lg bg-muted p-4 text-xs overflow-auto">
              {error.message}
            </pre>
          )}
          
          <div className="flex gap-3">
            <Button onClick={reset} variant="default" className="flex-1">
              Réessayer
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </div>
          
          {error.digest && (
            <p className="text-xs text-muted-foreground text-center">
              Code d&apos;erreur: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

