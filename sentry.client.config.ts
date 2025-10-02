import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Définir l'environnement
  environment: process.env.NODE_ENV || "development",
  
  // Sample rate pour les transactions de performance
  // 1.0 = 100% des transactions sont envoyées
  // En production, vous pourriez réduire à 0.1 (10%) pour économiser le quota
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Sample rate pour les sessions replay
  replaysSessionSampleRate: 0.1, // 10% des sessions
  replaysOnErrorSampleRate: 1.0, // 100% des sessions avec erreur
  
  // Intégrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration({
      // Configuration pour les routes Next.js
      enableInp: true,
    }),
  ],
  
  // Filtrer les erreurs non pertinentes
  beforeSend(event, hint) {
    // Ignorer les erreurs réseau courantes
    const error = hint.originalException;
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message);
      if (
        message.includes("ResizeObserver") ||
        message.includes("Non-Error promise rejection")
      ) {
        return null;
      }
    }
    return event;
  },
  
  // Ne pas capturer les breadcrumbs console en dev
  beforeBreadcrumb(breadcrumb) {
    if (
      process.env.NODE_ENV === "development" &&
      breadcrumb.category === "console"
    ) {
      return null;
    }
    return breadcrumb;
  },
});

