# 🔍 Sentry - Référence Rapide

Aide-mémoire pour utiliser Sentry au quotidien.

---

## 🚀 Démarrage Rapide

### 1. Configuration Initiale (Une fois)

```bash
# 1. Créer un compte sur sentry.io
# 2. Créer un projet Next.js
# 3. Copier le DSN

# 4. Ajouter dans .env.local
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_ORG="votre-org"
SENTRY_PROJECT="votre-projet"
SENTRY_AUTH_TOKEN="votre-token"
```

### 2. Tester

```bash
npm run dev
curl http://localhost:3000/api/sentry-test
# Vérifier dans Sentry.io > Issues
```

---

## 📝 Imports

```typescript
// Client ET Server
import { captureError, captureMessage, setUserContext } from "@/lib/sentry";
import { addBreadcrumb, withErrorBoundary } from "@/lib/sentry";

// Client uniquement (composants "use client")
import * as Sentry from "@sentry/nextjs";
```

---

## 🎯 Cas d'Usage Courants

### Capturer une Erreur

```typescript
try {
  await riskyOperation();
} catch (error) {
  captureError(error, {
    tags: { feature: "payment" },
    extra: { orderId: "123" },
  });
}
```

### Logger un Message

```typescript
captureMessage("User reached limit", "warning", {
  tags: { feature: "rate-limit" },
});
```

### Définir l'Utilisateur

```typescript
// Après login
setUserContext({
  id: user.id,
  email: user.email,
  name: user.name,
});

// Après logout
setUserContext(null);
```

### Ajouter un Breadcrumb

```typescript
addBreadcrumb(
  "User clicked checkout",
  "user-action",
  "info",
  { cartValue: 99.99 }
);
```

### Wrapper une Fonction

```typescript
const safeFetch = withErrorBoundary(
  async (url: string) => {
    return await fetch(url);
  },
  "fetch-operation"
);
```

---

## 🎨 Dans les Composants

### Server Component

```typescript
// page.tsx
import { captureError, setUserContext } from "@/lib/sentry";

export default async function Page() {
  try {
    const data = await fetchData();
    return <div>{data}</div>;
  } catch (error) {
    captureError(error, {
      tags: { page: "home" },
    });
    throw error;
  }
}
```

### Client Component

```typescript
"use client";

import { captureError, addBreadcrumb } from "@/lib/sentry";

export function MyButton() {
  const handleClick = async () => {
    addBreadcrumb("Button clicked", "user-action");
    
    try {
      await action();
    } catch (error) {
      captureError(error, {
        tags: { component: "MyButton" },
      });
    }
  };

  return <button onClick={handleClick}>Click</button>;
}
```

---

## 🔄 API Routes

```typescript
// app/api/example/route.ts
import { NextResponse } from "next/server";
import { captureError } from "@/lib/sentry";

export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    captureError(error, {
      tags: { endpoint: "example" },
    });
    
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
```

---

## 📊 Niveaux de Sévérité

```typescript
"fatal"    // Crash complet
"error"    // Erreur nécessitant attention
"warning"  // Potentiellement problématique
"info"     // Information utile
"debug"    // Information de debug
```

### Quand Utiliser Chaque Niveau

- `fatal`: Erreur au niveau root (global-error.tsx)
- `error`: Erreur inattendue nécessitant correction
- `warning`: Erreur attendue mais préoccupante (échec de login)
- `info`: Événement notable mais pas problématique
- `debug`: Information pour débogage (dev uniquement)

---

## 🏷️ Tags Recommandés

```typescript
{
  tags: {
    feature: "payment",        // Quelle fonctionnalité
    component: "CheckoutForm", // Quel composant
    page: "checkout",          // Quelle page
    action: "submit",          // Quelle action
    userId: "123",             // Quel utilisateur (si pertinent)
  }
}
```

---

## 📦 Extra Data

```typescript
{
  extra: {
    orderId: "ORD-123",
    amount: 99.99,
    paymentMethod: "card",
    timestamp: new Date().toISOString(),
  }
}
```

⚠️ **Attention** : Ne jamais inclure de données sensibles (mots de passe, tokens, numéros de carte)

---

## 🔍 Recherche dans Sentry

### Dans Sentry.io

```
# Par tag
feature:payment

# Par utilisateur
user.email:john@example.com

# Par niveau
level:error

# Par environnement
environment:production

# Combiné
feature:payment AND level:error
```

---

## 🎯 Checklist Avant Production

- [ ] DSN configuré en production
- [ ] SENTRY_AUTH_TOKEN dans Vercel/AWS
- [ ] Source maps activés
- [ ] Alertes configurées (Slack/Email)
- [ ] Contexte utilisateur défini après login
- [ ] Données sensibles filtrées
- [ ] Testé en staging
- [ ] Dashboard Sentry configuré

---

## 🚨 Que Faire Quand une Erreur Arrive

1. **Vérifier dans Sentry** : Issues > Dernières erreurs
2. **Lire la stack trace** : Où l'erreur s'est produite
3. **Consulter les breadcrumbs** : Actions de l'utilisateur avant l'erreur
4. **Regarder le contexte** : User, tags, extra data
5. **Reproduire localement** : Avec les mêmes conditions
6. **Corriger et déployer**
7. **Résoudre dans Sentry** : Marquer comme résolu

---

## 📞 Commandes Utiles

```bash
# Dev
npm run dev

# Tester Sentry
curl http://localhost:3000/api/sentry-test

# Build (avec upload source maps en production)
npm run build

# Vérifier la config
grep SENTRY .env.local
```

---

## 🔗 Liens Rapides

- Dashboard: https://sentry.io/organizations/[org]/projects/[project]/
- Issues: https://sentry.io/organizations/[org]/issues/
- Performance: https://sentry.io/organizations/[org]/performance/
- Releases: https://sentry.io/organizations/[org]/releases/

---

## 📚 Documentation Complète

- **Setup complet** : `SENTRY_SETUP.md`
- **Exemples détaillés** : `SENTRY_EXAMPLES.md`
- **Docs officielles** : https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

**Aide-mémoire à garder sous la main ! 📌**

