import * as Sentry from "@sentry/nextjs";

export async function register() {
  // Configuration pour le serveur Node.js
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // Définir l'environnement
      environment: process.env.NODE_ENV || "development",

      // Sample rate pour les transactions côté serveur
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

      // Activer le profiling en production (optionnel)
      profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,

      // Configuration serveur spécifique
      integrations: [Sentry.prismaIntegration()],

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
  }

  // Configuration pour Edge Runtime (Middleware, Edge API Routes)
  if (process.env.NEXT_RUNTIME === "edge") {
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
  }
}

export async function onRequestError(
  err: Error,
  request: {
    path: string;
    method: string;
    headers: Headers;
  },
  context: {
    routerKind: "Pages Router" | "App Router";
    routePath: string;
    routeType: "render" | "route" | "action" | "middleware";
  }
) {
  Sentry.captureException(err, {
    contexts: {
      nextjs: {
        request: {
          path: request.path,
          method: request.method,
        },
        router: {
          kind: context.routerKind,
          path: context.routePath,
          type: context.routeType,
        },
      },
    },
  });
}
