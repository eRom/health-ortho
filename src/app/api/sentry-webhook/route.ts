import { NextRequest, NextResponse } from "next/server";

interface SentryWebhookPayload {
  action: string;
  issue: {
    id: string;
    title: string;
    culprit: string;
    level: "error" | "warning" | "info";
    status: "unresolved" | "resolved" | "ignored";
    firstSeen: string;
    lastSeen: string;
    count: number;
    userCount: number;
    permalink: string;
    metadata: {
      filename?: string;
      function?: string;
      type?: string;
      value?: string;
    };
    tags: Array<{ key: string; value: string }>;
  };
  webhookUrl: string;
}

/**
 * Webhook Sentry → Linear
 * Crée automatiquement des tickets Linear pour les bugs Sentry
 */
export async function POST(request: NextRequest) {
  try {
    const payload: SentryWebhookPayload = await request.json();

    // Vérifier que c'est bien un webhook Sentry
    if (!payload.issue || !payload.action) {
      return NextResponse.json(
        { error: "Invalid Sentry webhook payload" },
        { status: 400 }
      );
    }

    // Filtrer seulement les nouvelles erreurs non résolues
    if (payload.action !== "created" || payload.issue.status !== "unresolved") {
      return NextResponse.json({ message: "Ignored" }, { status: 200 });
    }

    // Déterminer la priorité selon le niveau
    const priority = getPriorityFromLevel(payload.issue.level);
    
    // Déterminer les labels selon le contexte
    const labels = getLabelsFromIssue(payload.issue);

    // Créer le ticket Linear
    const linearIssue = await createLinearIssue({
      title: `🐛 Sentry: ${payload.issue.title}`,
      description: createIssueDescription(payload.issue),
      priority,
      labels,
      project: "Bug Fixes", // Projet dédié aux bugs
      team: "Mpr-in-cloud",
    });

    return NextResponse.json({
      message: "Linear issue created successfully",
      linearIssueId: linearIssue.id,
      sentryIssueId: payload.issue.id,
    });

  } catch (error) {
    console.error("Error processing Sentry webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Détermine la priorité Linear selon le niveau Sentry
 */
function getPriorityFromLevel(level: string): number {
  switch (level) {
    case "error":
      return 1; // Urgent
    case "warning":
      return 2; // High
    case "info":
      return 3; // Normal
    default:
      return 3; // Normal
  }
}

/**
 * Détermine les labels selon le contexte de l'erreur
 */
function getLabelsFromIssue(issue: SentryWebhookPayload["issue"]): string[] {
  const labels = ["Bug"]; // Toujours un bug

  // Ajouter Critical si beaucoup d'utilisateurs affectés
  if (issue.userCount > 10) {
    labels.push("Critical");
  }

  // Ajouter Performance si erreur liée aux performances
  if (
    issue.title.toLowerCase().includes("performance") ||
    issue.title.toLowerCase().includes("slow") ||
    issue.title.toLowerCase().includes("timeout")
  ) {
    labels.push("Performance");
  }

  // Ajouter Neuro/Ortho selon le contexte
  if (
    issue.culprit.includes("neuro") ||
    issue.title.toLowerCase().includes("neuro")
  ) {
    labels.push("Neuro");
  }

  if (
    issue.culprit.includes("ortho") ||
    issue.title.toLowerCase().includes("ortho")
  ) {
    labels.push("Ortho");
  }

  return labels;
}

/**
 * Crée la description du ticket Linear
 */
function createIssueDescription(issue: SentryWebhookPayload["issue"]): string {
  return `## 🐛 Bug Sentry

**Titre:** ${issue.title}
**Culprit:** \`${issue.culprit}\`
**Niveau:** ${issue.level}
**Utilisateurs affectés:** ${issue.userCount}
**Occurrences:** ${issue.count}

### 📊 Métadonnées
- **Fichier:** ${issue.metadata.filename || "N/A"}
- **Fonction:** ${issue.metadata.function || "N/A"}
- **Type:** ${issue.metadata.type || "N/A"}

### 📅 Timeline
- **Première occurrence:** ${new Date(issue.firstSeen).toLocaleString("fr-FR")}
- **Dernière occurrence:** ${new Date(issue.lastSeen).toLocaleString("fr-FR")}

### 🏷️ Tags Sentry
${issue.tags.map(tag => `- **${tag.key}:** ${tag.value}`).join("\n")}

### 🔗 Liens
- [Voir dans Sentry](${issue.permalink})

---
*Ticket créé automatiquement depuis Sentry*`;
}

/**
 * Crée un ticket Linear via l'API REST
 */
async function createLinearIssue(data: {
  title: string;
  description: string;
  priority: number;
  labels: string[];
  project: string;
  team: string;
}) {
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
  
  if (!LINEAR_API_KEY) {
    throw new Error("LINEAR_API_KEY not configured");
  }

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": LINEAR_API_KEY,
    },
    body: JSON.stringify({
      query: `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue {
              id
              identifier
              title
              url
            }
          }
        }
      `,
      variables: {
        input: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          labelIds: data.labels, // Les IDs des labels seront résolus côté client
          projectId: data.project, // L'ID du projet sera résolu côté client
          teamId: data.team, // L'ID de l'équipe sera résolu côté client
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Linear API error: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`Linear API errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data.issueCreate.issue;
}

