import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Définir l'environnement
  environment: process.env.NODE_ENV || "development",
  
  // Sample rate pour les transactions côté serveur
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Activer le profiling en production (optionnel)
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  
  // Configuration serveur spécifique
  integrations: [
    Sentry.prismaIntegration(),
  ],
  
  // Filtrer les informations sensibles
  beforeSend(event) {
    // Supprimer les données sensibles des breadcrumbs et contextes
    if (event.request) {
      // Supprimer les headers sensibles
      if (event.request.headers) {
        delete event.request.headers.cookie;
        delete event.request.headers.authorization;
      }
      
      // Supprimer les query params sensibles
      if (event.request.query_string) {
        const queryParams = new URLSearchParams(event.request.query_string);
        if (queryParams.has("token")) queryParams.delete("token");
        if (queryParams.has("key")) queryParams.delete("key");
        event.request.query_string = queryParams.toString();
      }
    }
    
    return event;
  },
});

