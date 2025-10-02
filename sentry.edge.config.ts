import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Définir l'environnement
  environment: process.env.NODE_ENV || "development",
  
  // Sample rate pour Edge Runtime
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Configuration minimale pour Edge (limitations de taille)
  beforeSend(event) {
    // Filtrer les informations sensibles
    if (event.request?.headers) {
      delete event.request.headers.cookie;
      delete event.request.headers.authorization;
    }
    return event;
  },
});

