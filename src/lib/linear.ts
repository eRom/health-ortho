/**
 * Linear API Helper
 * Fonctions utilitaires pour interagir avec Linear
 */

interface LinearIssueInput {
  title: string;
  description?: string;
  priority?: number;
  labels?: string[];
  project?: string;
  team?: string;
  assignee?: string;
}

interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
}

/**
 * Crée un ticket Linear
 */
export async function createLinearIssue(input: LinearIssueInput): Promise<LinearIssue> {
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
  
  if (!LINEAR_API_KEY) {
    throw new Error("LINEAR_API_KEY not configured in environment variables");
  }

  // Récupérer les IDs des labels, projet et équipe
  const teamId = await getTeamId(input.team || "Mpr-in-cloud");
  const projectId = input.project ? await getProjectId(input.project, teamId) : undefined;
  const labelIds = input.labels ? await getLabelIds(input.labels, teamId) : [];

  const mutation = `
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
  `;

  const variables = {
    input: {
      title: input.title,
      description: input.description,
      priority: input.priority || 3, // Normal par défaut
      labelIds,
      projectId,
      teamId,
      assigneeId: input.assignee,
    },
  };

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": LINEAR_API_KEY,
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Linear API error: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`Linear API errors: ${JSON.stringify(result.errors)}`);
  }

  if (!result.data.issueCreate.success) {
    throw new Error("Failed to create Linear issue");
  }

  return result.data.issueCreate.issue;
}

/**
 * Récupère l'ID d'une équipe par son nom
 */
async function getTeamId(teamName: string): Promise<string> {
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY!;

  const query = `
    query GetTeams {
      teams {
        nodes {
          id
          name
        }
      }
    }
  `;

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": LINEAR_API_KEY,
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  const team = result.data.teams.nodes.find((t: any) => t.name === teamName);
  
  if (!team) {
    throw new Error(`Team "${teamName}" not found`);
  }

  return team.id;
}

/**
 * Récupère l'ID d'un projet par son nom
 */
async function getProjectId(projectName: string, teamId: string): Promise<string> {
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY!;

  const query = `
    query GetProjects($teamId: String!) {
      team(id: $teamId) {
        projects {
          nodes {
            id
            name
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": LINEAR_API_KEY,
    },
    body: JSON.stringify({
      query,
      variables: { teamId },
    }),
  });

  const result = await response.json();
  const project = result.data.team.projects.nodes.find((p: any) => p.name === projectName);
  
  if (!project) {
    throw new Error(`Project "${projectName}" not found in team`);
  }

  return project.id;
}

/**
 * Récupère les IDs des labels par leurs noms
 */
async function getLabelIds(labelNames: string[], teamId: string): Promise<string[]> {
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY!;

  const query = `
    query GetLabels($teamId: String!) {
      team(id: $teamId) {
        labels {
          nodes {
            id
            name
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": LINEAR_API_KEY,
    },
    body: JSON.stringify({
      query,
      variables: { teamId },
    }),
  });

  const result = await response.json();
  const labels = result.data.team.labels.nodes;
  
  return labelNames
    .map(name => labels.find((l: any) => l.name === name)?.id)
    .filter(Boolean);
}

/**
 * Crée un ticket pour un bug Sentry
 */
export async function createSentryBugTicket(sentryData: {
  title: string;
  culprit: string;
  level: string;
  userCount: number;
  count: number;
  permalink: string;
  metadata: any;
  tags: Array<{ key: string; value: string }>;
}): Promise<LinearIssue> {
  const priority = getPriorityFromLevel(sentryData.level);
  const labels = getLabelsFromSentryData(sentryData);

  return createLinearIssue({
    title: `🐛 Sentry: ${sentryData.title}`,
    description: createSentryDescription(sentryData),
    priority,
    labels,
    project: "Bug Fixes",
    team: "Mpr-in-cloud",
  });
}

/**
 * Crée un ticket pour une feature
 */
export async function createFeatureTicket(data: {
  title: string;
  description: string;
  labels?: string[];
  project?: string;
  assignee?: string;
}): Promise<LinearIssue> {
  return createLinearIssue({
    title: data.title,
    description: data.description,
    priority: 3, // Normal
    labels: ["Feature", ...(data.labels || [])],
    project: data.project || "Application NextJS",
    team: "Mpr-in-cloud",
    assignee: data.assignee,
  });
}

/**
 * Crée un ticket pour une amélioration
 */
export async function createImprovementTicket(data: {
  title: string;
  description: string;
  labels?: string[];
  project?: string;
}): Promise<LinearIssue> {
  return createLinearIssue({
    title: data.title,
    description: data.description,
    priority: 4, // Low
    labels: ["Improvement", ...(data.labels || [])],
    project: data.project || "Application NextJS",
    team: "Mpr-in-cloud",
  });
}

// Fonctions utilitaires (réutilisées depuis le webhook)

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

function getLabelsFromSentryData(data: any): string[] {
  const labels = ["Bug"];

  if (data.userCount > 10) {
    labels.push("Critical");
  }

  if (
    data.title.toLowerCase().includes("performance") ||
    data.title.toLowerCase().includes("slow") ||
    data.title.toLowerCase().includes("timeout")
  ) {
    labels.push("Performance");
  }

  if (data.culprit.includes("neuro") || data.title.toLowerCase().includes("neuro")) {
    labels.push("Neuro");
  }

  if (data.culprit.includes("ortho") || data.title.toLowerCase().includes("ortho")) {
    labels.push("Ortho");
  }

  return labels;
}

function createSentryDescription(data: any): string {
  return `## 🐛 Bug Sentry

**Titre:** ${data.title}
**Culprit:** \`${data.culprit}\`
**Niveau:** ${data.level}
**Utilisateurs affectés:** ${data.userCount}
**Occurrences:** ${data.count}

### 📊 Métadonnées
- **Fichier:** ${data.metadata.filename || "N/A"}
- **Fonction:** ${data.metadata.function || "N/A"}
- **Type:** ${data.metadata.type || "N/A"}

### 🏷️ Tags Sentry
${data.tags.map((tag: any) => `- **${tag.key}:** ${tag.value}`).join("\n")}

### 🔗 Liens
- [Voir dans Sentry](${data.permalink})

---
*Ticket créé automatiquement depuis Sentry*`;
}

