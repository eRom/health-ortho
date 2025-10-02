# 🎯 Exemples d'Utilisation de Sentry

Exemples pratiques d'utilisation de Sentry dans différents scénarios.

---

## 📱 1. Intégration dans le Layout (Contexte Utilisateur Automatique)

### Option A : Via Provider Client (Recommandé)

```typescript
// src/app/[locale]/layout.tsx
import { SentryUserProvider } from "@/components/providers/sentry-user-provider";

export default async function LocaleLayout({ children, params }) {
  const session = await getSession(); // Votre méthode de récupération de session
  
  return (
    <html>
      <body>
        <SentryUserProvider session={session}>
          <SiteHeader session={session} />
          <main>{children}</main>
        </SentryUserProvider>
      </body>
    </html>
  );
}
```

### Option B : Directement dans un Composant Client

```typescript
// src/components/auth-context-setter.tsx
"use client";

import { useEffect } from "react";
import { setUserContext } from "@/lib/sentry";

export function AuthContextSetter({ user }) {
  useEffect(() => {
    if (user) {
      setUserContext({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } else {
      setUserContext(null);
    }
  }, [user]);

  return null; // Ce composant ne rend rien
}
```

---

## 🔄 2. API Routes avec Sentry

### Capturer les Erreurs d'API

```typescript
// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { captureError, addBreadcrumb } from "@/lib/sentry";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    addBreadcrumb(
      `Fetching user ${params.id}`,
      "api",
      "info"
    );

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    captureError(error, {
      tags: {
        endpoint: "get-user",
        userId: params.id,
      },
      level: "error",
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### POST avec Validation

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { captureError, captureMessage } from "@/lib/sentry";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.title || !body.content) {
      captureMessage(
        "Invalid post creation attempt",
        "warning",
        { extra: { body } }
      );

      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: body,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    captureError(error, {
      tags: { endpoint: "create-post" },
      extra: { requestBody: await request.text() },
    });

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
```

---

## 🎨 3. Composants React avec Error Handling

### Composant de Formulaire

```typescript
"use client";

import { useState } from "react";
import { captureError, addBreadcrumb } from "@/lib/sentry";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    addBreadcrumb("User submitted contact form", "user-action", "info");

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      addBreadcrumb("Contact form submitted successfully", "http", "info");
      // Succès : rediriger ou afficher un message
    } catch (error) {
      captureError(error, {
        tags: {
          component: "ContactForm",
          action: "submit",
        },
        level: "error",
      });

      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Champs du formulaire */}
      {error && <p className="text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
```

### Hook Personnalisé avec Sentry

```typescript
// src/hooks/useFetch.ts
import { useState, useEffect } from "react";
import { captureError, addBreadcrumb } from "@/lib/sentry";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        addBreadcrumb(`Fetching data from ${url}`, "http", "info");

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);

        addBreadcrumb(`Successfully fetched ${url}`, "http", "info");
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        
        captureError(error, {
          tags: {
            hook: "useFetch",
            url,
          },
          extra: {
            timestamp: new Date().toISOString(),
          },
        });

        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Utilisation
function MyComponent() {
  const { data, loading, error } = useFetch<User>("/api/user");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{data?.name}</div>;
}
```

---

## 🔐 4. Monitoring d'Authentification

### Page de Login

```typescript
// src/app/[locale]/(auth)/auth/login/login-form.tsx
"use client";

import { useState } from "react";
import { captureError, addBreadcrumb, setUserContext } from "@/lib/sentry";

export function LoginForm() {
  const handleLogin = async (email: string, password: string) => {
    addBreadcrumb("User attempting to login", "auth", "info", { email });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const user = await response.json();

      // Définir le contexte utilisateur dans Sentry après login réussi
      setUserContext({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      addBreadcrumb("User logged in successfully", "auth", "info");
      
      // Redirection...
    } catch (error) {
      captureError(error, {
        tags: {
          feature: "auth",
          action: "login",
        },
        extra: { email }, // OK car pas de mot de passe
        level: "warning", // warning car échec de login est "normal"
      });

      // Afficher erreur à l'utilisateur
    }
  };

  // ... reste du composant
}
```

### Logout

```typescript
// src/components/navigation/sign-out-button.tsx
"use client";

import { captureMessage, setUserContext, addBreadcrumb } from "@/lib/sentry";

export function SignOutButton() {
  const handleLogout = async () => {
    addBreadcrumb("User logging out", "auth", "info");

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      
      // Effacer le contexte utilisateur dans Sentry
      setUserContext(null);
      
      captureMessage("User logged out", "info");
      
      // Redirection...
    } catch (error) {
      // Gérer l'erreur
    }
  };

  return <button onClick={handleLogout}>Déconnexion</button>;
}
```

---

## 📊 5. Performance Monitoring

### Page avec Mesures de Performance

```typescript
// src/app/[locale]/(app)/dashboard/page.tsx
import { startTransaction, addBreadcrumb } from "@/lib/sentry";

export default async function DashboardPage() {
  const transaction = startTransaction("dashboard-page-load", "pageload");

  try {
    addBreadcrumb("Loading dashboard data", "navigation", "info");

    // Span pour la base de données
    const dbSpan = transaction.startChild({
      op: "db.query",
      description: "Fetch user stats",
    });

    const stats = await prisma.userStats.findMany();
    dbSpan.finish();

    // Span pour un autre appel
    const apiSpan = transaction.startChild({
      op: "http.client",
      description: "Fetch external data",
    });

    const externalData = await fetch("https://api.example.com/data");
    apiSpan.finish();

    transaction.setStatus("ok");
    
    return <div>{/* Render dashboard */}</div>;
  } catch (error) {
    transaction.setStatus("internal_error");
    throw error;
  } finally {
    transaction.finish();
  }
}
```

### Mesurer une Fonction Spécifique

```typescript
import * as Sentry from "@sentry/nextjs";

async function expensiveCalculation(data: number[]) {
  return Sentry.startSpan(
    {
      name: "expensive-calculation",
      op: "function",
      attributes: {
        dataSize: data.length,
      },
    },
    async () => {
      // Calcul coûteux
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data.reduce((a, b) => a + b, 0);
    }
  );
}
```

---

## 🎯 6. Cas d'Usage Spécifiques

### Wrapper de Fetch avec Retry + Sentry

```typescript
// src/lib/fetch-with-retry.ts
import { captureError, addBreadcrumb } from "@/lib/sentry";

export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      addBreadcrumb(
        `Attempting fetch (attempt ${i + 1}/${maxRetries})`,
        "http",
        "info",
        { url }
      );

      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i === maxRetries - 1) {
        // Dernière tentative échouée
        captureError(lastError, {
          tags: {
            function: "fetchWithRetry",
            url,
            attempts: String(maxRetries),
          },
          level: "error",
        });
      } else {
        // Tentative échouée mais on réessaie
        addBreadcrumb(
          `Fetch failed, retrying... (${i + 1}/${maxRetries})`,
          "http",
          "warning",
          { error: lastError.message }
        );
      }

      // Attendre avant de réessayer (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }

  throw lastError || new Error("All retry attempts failed");
}
```

### Upload de Fichier avec Progress

```typescript
"use client";

import { useState } from "react";
import { captureError, addBreadcrumb } from "@/lib/sentry";

export function FileUploader() {
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File) => {
    addBreadcrumb(
      "Starting file upload",
      "file",
      "info",
      {
        fileName: file.name,
        fileSize: String(file.size),
        fileType: file.type,
      }
    );

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          setProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          addBreadcrumb("File uploaded successfully", "file", "info");
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`);
        }
      });

      xhr.addEventListener("error", () => {
        throw new Error("Network error during upload");
      });

      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    } catch (error) {
      captureError(error, {
        tags: {
          feature: "file-upload",
          fileName: file.name,
        },
        extra: {
          fileSize: file.size,
          fileType: file.type,
          progress,
        },
      });

      throw error;
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => {
        if (e.target.files?.[0]) {
          uploadFile(e.target.files[0]);
        }
      }} />
      {progress > 0 && <progress value={progress} max="100" />}
    </div>
  );
}
```

---

## 🔔 7. Notifications et Feedback Utilisateur

### Capturer le Feedback Utilisateur

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

export function FeedbackButton() {
  const showFeedbackDialog = () => {
    const eventId = Sentry.captureMessage("User opened feedback dialog");
    
    Sentry.showReportDialog({
      eventId,
      title: "Signaler un problème",
      subtitle: "Notre équipe vous répondra rapidement",
      subtitle2: "",
      labelName: "Nom",
      labelEmail: "Email",
      labelComments: "Décrivez le problème",
      labelClose: "Fermer",
      labelSubmit: "Envoyer",
      successMessage: "Merci ! Votre retour a été envoyé.",
    });
  };

  return (
    <Button onClick={showFeedbackDialog} variant="outline">
      Signaler un problème
    </Button>
  );
}
```

---

## 📝 8. Tests avec Sentry

### Mock Sentry dans les Tests

```typescript
// src/__tests__/setup.ts
import { vi } from "vitest";

// Mock Sentry dans les tests
vi.mock("@/lib/sentry", () => ({
  captureError: vi.fn(),
  captureMessage: vi.fn(),
  setUserContext: vi.fn(),
  addBreadcrumb: vi.fn(),
  withErrorBoundary: (fn: any) => fn,
  startTransaction: vi.fn(() => ({
    startChild: vi.fn(() => ({ finish: vi.fn() })),
    setStatus: vi.fn(),
    finish: vi.fn(),
  })),
}));
```

### Test d'un Composant avec Sentry

```typescript
// src/__tests__/components/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { ContactForm } from "@/components/ContactForm";
import * as sentry from "@/lib/sentry";

describe("ContactForm", () => {
  it("should capture error on submit failure", async () => {
    const captureErrorSpy = vi.spyOn(sentry, "captureError");

    // Mock fetch pour simuler une erreur
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    render(<ContactForm />);

    const submitButton = screen.getByRole("button", { name: /envoyer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(captureErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: {
            component: "ContactForm",
            action: "submit",
          },
        })
      );
    });
  });
});
```

---

## ✅ Résumé des Best Practices

1. **Toujours ajouter du contexte** aux erreurs capturées
2. **Utiliser des breadcrumbs** pour le fil d'Ariane
3. **Définir le contexte utilisateur** dès le login
4. **Filtrer les données sensibles** (mots de passe, tokens)
5. **Ne pas capturer les erreurs "normales"** (404, validation)
6. **Utiliser les transactions** pour le monitoring de performance
7. **Tester le bon fonctionnement** de Sentry en dev
8. **Configurer des alertes** pour être notifié rapidement

---

**Voir `SENTRY_SETUP.md` pour la configuration complète !**

