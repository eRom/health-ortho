import * as Sentry from "@sentry/nextjs";

/**
 * Capture une exception dans Sentry
 * @param error - L'erreur à capturer
 * @param context - Contexte additionnel (tags, user, extra)
 */
export function captureError(
  error: Error | unknown,
  context?: {
    tags?: Record<string, string>;
    user?: { id: string; email?: string; name?: string };
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
  }
) {
  Sentry.captureException(error, {
    level: context?.level || "error",
    tags: context?.tags,
    user: context?.user,
    extra: context?.extra,
  });
}

/**
 * Capture un message dans Sentry
 * @param message - Le message à logger
 * @param level - Niveau de sévérité
 * @param context - Contexte additionnel
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
) {
  Sentry.captureMessage(message, {
    level,
    tags: context?.tags,
    extra: context?.extra,
  });
}

/**
 * Définir le contexte utilisateur pour Sentry
 * @param user - Informations de l'utilisateur
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  name?: string;
} | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Ajouter un breadcrumb (fil d'Ariane) à Sentry
 * @param message - Message du breadcrumb
 * @param category - Catégorie (navigation, http, user-action, etc.)
 * @param level - Niveau de sévérité
 * @param data - Données additionnelles
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = "info",
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Wrapper pour capturer les erreurs dans les fonctions async
 * @param fn - Fonction à wrapper
 * @param errorContext - Contexte d'erreur
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorBoundary<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorContext?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error, {
        tags: {
          function: fn.name,
          context: errorContext || "unknown",
        },
        level: "error",
      });
      throw error;
    }
  }) as T;
}

/**
 * Créer un span Sentry pour le monitoring de performance
 * @param name - Nom de l'opération
 * @param operation - Type d'opération (http.server, db.query, etc.)
 * @param callback - Fonction à exécuter dans le span
 */
export function withPerformanceSpan<T>(
  name: string,
  operation: string,
  callback: () => T | Promise<T>
): T | Promise<T> {
  return Sentry.startSpan(
    {
      name,
      op: operation,
    },
    callback
  );
}

/**
 * Définir des tags personnalisés pour tout le contexte
 * @param tags - Tags à définir
 */
export function setTags(tags: Record<string, string>) {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
}

/**
 * Définir un contexte personnalisé
 * @param name - Nom du contexte
 * @param context - Données du contexte
 */
export function setContext(name: string, context: Record<string, unknown>) {
  Sentry.setContext(name, context);
}

