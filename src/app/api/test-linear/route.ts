import { createFeatureTicket, createLinearIssue } from "@/lib/linear";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route pour tester la création de tickets Linear
 * GET /api/test-linear
 */
export async function GET(request: NextRequest) {
  try {
    // Test 1: Créer un ticket de feature
    const featureTicket = await createFeatureTicket({
      title: "✨ Ajouter exercices Empans visuels",
      description: `## 🧠 Exercices Empans Visuels

### Description
Développer des exercices de mémoire visuelle avec des séquences d'images.

### Fonctionnalités
- Affichage de séquences d'images (2-9 items)
- Interface intuitive avec feedback visuel
- Sauvegarde des résultats et progression
- Graphiques de performance

### Critères d'acceptation
- [ ] Interface responsive (mobile + desktop)
- [ ] Temps de réponse < 2 secondes
- [ ] Sauvegarde automatique des résultats
- [ ] Tests E2E avec Playwright

### Estimation
**Effort:** 5 story points
**Durée:** 1-2 semaines

### Labels
- Neuro (exercices cognitifs)
- Feature (nouvelle fonctionnalité)`,
      labels: ["Neuro"],
      project: "Neuro Q4 2025",
    });

    // Test 2: Créer un ticket d'amélioration
    const improvementTicket = await createLinearIssue({
      title: "🔧 Optimiser les performances Lighthouse",
      description: `## ⚡ Optimisations Performance

### Problème
Le score Lighthouse est actuellement à 90+, mais on peut encore améliorer.

### Améliorations proposées
- Lazy loading des images
- Optimisation des fonts
- Compression des assets
- Cache des API calls

### Objectif
Atteindre un score Lighthouse de 95+`,
      priority: 4, // Low
      labels: ["Performance", "Improvement"],
      project: "Application NextJS",
      team: "Mpr-in-cloud",
    });

    return NextResponse.json({
      success: true,
      message: "Tickets Linear créés avec succès",
      tickets: [
        {
          type: "Feature",
          id: featureTicket.id,
          identifier: featureTicket.identifier,
          title: featureTicket.title,
          url: featureTicket.url,
        },
        {
          type: "Improvement", 
          id: improvementTicket.id,
          identifier: improvementTicket.identifier,
          title: improvementTicket.title,
          url: improvementTicket.url,
        },
      ],
    });

  } catch (error) {
    console.error("Error creating Linear tickets:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Vérifiez que LINEAR_API_KEY est configuré dans .env.local",
      },
      { status: 500 }
    );
  }
}

