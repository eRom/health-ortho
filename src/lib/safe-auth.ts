/**
 * Safe wrapper pour auth.api.getSession qui ne lance jamais d'exception
 */
import type { UnknownSession } from "@/app/[locale]/layout";
import { auth } from "@/lib/auth";

interface SafeSessionOptions {
  headers: Headers | Record<string, string>;
}

/**
 * Récupère la session de manière sécurisée sans lancer d'exception
 * @returns La session ou null si aucune session valide n'existe
 */
export async function getSafeSession(
  options: SafeSessionOptions
): Promise<UnknownSession | null> {
  try {
    const result = (await auth.api.getSession({
      headers: options.headers,
    })) as UnknownSession | null;
    
    // Vérifier que le résultat est valide
    if (!result || (typeof result === "object" && Object.keys(result).length === 0)) {
      return null;
    }
    
    return result;
  } catch (error) {
    // Session invalide, expirée ou inexistante
    // Ne pas logger en production pour éviter de polluer les logs
    if (process.env.NODE_ENV === "development") {
      console.log("[getSafeSession] No active session:", error instanceof Error ? error.message : String(error));
    }
    return null;
  }
}

