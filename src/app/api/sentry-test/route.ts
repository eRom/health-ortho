import { NextResponse } from "next/server";

/**
 * Route API de test pour Sentry
 * Utilisez cette route pour vérifier que Sentry capture correctement les erreurs
 * 
 * Usage: GET /api/sentry-test
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Cette route est désactivée en production" },
      { status: 403 }
    );
  }

  // Déclencher une erreur pour tester Sentry
  throw new Error("Test Sentry: Cette erreur devrait apparaître dans Sentry!");
}

