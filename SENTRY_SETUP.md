# 🔍 Configuration Sentry - Guide Complet

Guide complet pour configurer et utiliser Sentry dans MPR In Cloud.

---

## ✅ Installation Effectuée

✅ **Package installé** : `@sentry/nextjs`  
✅ **Fichiers créés** :
- `instrumentation-client.ts` - Configuration client (navigateur) ✨ **Nouveau format Turbopack**
- `instrumentation.ts` - Configuration serveur et Edge Runtime
- `src/lib/sentry.ts` - Helpers Sentry
- `src/app/global-error.tsx` - Error boundary global
- `src/app/[locale]/error.tsx` - Error boundary avec Sentry (mis à jour)
- `src/app/api/sentry-test/route.ts` - Route de test

> **Note** : Migration effectuée vers la nouvelle structure recommandée pour Next.js 15 et Turbopack.  
> Les anciens fichiers `sentry.*.config.ts` ont été remplacés par `instrumentation.ts` et `instrumentation-client.ts`.

---

## 🚀 Configuration Sentry.io

### 1. Créer un Compte Sentry

1. Allez sur [sentry.io](https://sentry.io)
2. Créez un compte gratuit (ou utilisez GitHub OAuth)
3. Créez une nouvelle organisation

### 2. Créer un Projet

1. Dans Sentry, créez un nouveau projet
2. Choisissez la plateforme : **Next.js**
3. Nommez le projet : `mpr-in-cloud` (ou autre)
4. Copiez le **DSN** fourni

### 3. Trouver vos Identifiants

Dans Sentry :
- **DSN** : Settings > Projects > [Votre Projet] > Client Keys (DSN)
- **Organization Slug** : Settings > General Settings > Organization Slug
- **Project Slug** : Settings > General Settings > Project Slug
- **Auth Token** : Settings > Developer Settings > Auth Tokens > Create New Token
  - Permissions nécessaires : `project:releases`, `org:read`

---

## 🔐 Configuration des Variables d'Environnement

### Créer le fichier `.env.local`

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN="https://[key]@[organization].ingest.sentry.io/[project-id]"
SENTRY_ORG="votre-org-slug"
SENTRY_PROJECT="votre-project-slug"
SENTRY_AUTH_TOKEN="votre-auth-token"

# Autres variables existantes...
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="votre-secret-32-chars-minimum"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Vercel / Production

Dans Vercel Dashboard :
1. Settings > Environment Variables
2. Ajoutez les mêmes variables (sans le fichier `.env.local`)
3. Configurez pour l'environnement `Production`

---

## 🧪 Tester Sentry

### Test 1 : Via l'API de Test (Développement uniquement)

```bash
# Démarrer le serveur
npm run dev

# Dans un autre terminal, tester la route
curl http://localhost:3000/api/sentry-test
```

Vous devriez voir l'erreur apparaître dans Sentry après quelques secondes.

### Test 2 : Déclencher une Erreur Manuellement

Ajoutez temporairement dans une page :

```typescript
// src/app/[locale]/(site)/page.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <Button 
      onClick={() => {
        throw new Error("Test error from button click!");
      }}
    >
      Tester Sentry
    </Button>
  );
}
```

Cliquez sur le bouton → L'erreur apparaît dans Sentry.

### Test 3 : Vérifier la Console Sentry

1. Allez dans Sentry.io
2. Ouvrez votre projet
3. Section **Issues** : vos erreurs devraient apparaître
4. Cliquez sur une erreur pour voir :
   - Stack trace
   - Breadcrumbs (navigation)
   - Contexte utilisateur
   - Environnement

---

## 💡 Utilisation dans le Code

### Capturer une Erreur Simple

```typescript
import { captureError } from "@/lib/sentry";

try {
  // Code qui peut échouer
  await riskyOperation();
} catch (error) {
  captureError(error, {
    tags: { feature: "user-profile" },
    extra: { userId: "123" },
  });
  // Gérer l'erreur...
}
```

### Capturer un Message

```typescript
import { captureMessage } from "@/lib/sentry";

captureMessage(
  "L'utilisateur a atteint la limite de tentatives",
  "warning",
  {
    tags: { feature: "auth" },
    extra: { attempts: 5 },
  }
);
```

### Définir le Contexte Utilisateur

```typescript
import { setUserContext } from "@/lib/sentry";

// Après login
setUserContext({
  id: user.id,
  email: user.email,
  name: user.name,
});

// Après logout
setUserContext(null);
```

### Wrapper une Fonction Async

```typescript
import { withErrorBoundary } from "@/lib/sentry";

const fetchUserData = withErrorBoundary(
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
  "fetch-user-data"
);

// Utilisation
try {
  const user = await fetchUserData("123");
} catch (error) {
  // L'erreur est automatiquement capturée par Sentry
}
```

### Ajouter des Breadcrumbs

```typescript
import { addBreadcrumb } from "@/lib/sentry";

addBreadcrumb(
  "User navigated to profile page",
  "navigation",
  "info",
  { profileId: "123" }
);
```

### Monitoring de Performance

```typescript
import { startTransaction } from "@/lib/sentry";

const transaction = startTransaction("fetch-products", "http.server");

try {
  // Opération coûteuse
  const products = await fetchProducts();
  
  transaction.setStatus("ok");
} catch (error) {
  transaction.setStatus("internal_error");
  throw error;
} finally {
  transaction.finish();
}
```

---

## 🎯 Exemple d'Intégration dans une Page

```typescript
// src/app/[locale]/(app)/dashboard/page.tsx
import { captureError, setUserContext } from "@/lib/sentry";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  try {
    // Récupérer la session
    const session = await auth.api.getSession();
    
    // Définir le contexte utilisateur dans Sentry
    if (session?.user) {
      setUserContext({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      });
    }
    
    // ... reste du code
  } catch (error) {
    captureError(error, {
      tags: { page: "dashboard" },
      level: "error",
    });
    throw error; // Relancer pour que l'error boundary l'attrape
  }
}
```

---

## 🎨 Exemple dans un Composant Client

```typescript
"use client";

import { useEffect } from "react";
import { captureError, addBreadcrumb } from "@/lib/sentry";

export function MyComponent() {
  useEffect(() => {
    addBreadcrumb("MyComponent mounted", "component", "info");
  }, []);

  const handleClick = async () => {
    try {
      await fetchData();
    } catch (error) {
      captureError(error, {
        tags: { component: "MyComponent", action: "fetchData" },
        level: "error",
      });
      // Afficher un toast d'erreur à l'utilisateur
    }
  };

  return <button onClick={handleClick}>Fetch Data</button>;
}
```

---

## 📊 Fonctionnalités Configurées

### ✅ Client (Navigateur)
- ✅ Error tracking
- ✅ Performance monitoring (10% sample)
- ✅ Session Replay (10% des sessions normales, 100% avec erreur)
- ✅ Browser Tracing
- ✅ Filtrage des erreurs non pertinentes (ResizeObserver, etc.)

### ✅ Serveur
- ✅ Error tracking
- ✅ Performance monitoring (10% sample)
- ✅ Profiling (10% sample en production)
- ✅ Intégration Prisma
- ✅ Filtrage des données sensibles (cookies, tokens)

### ✅ Edge Runtime
- ✅ Error tracking
- ✅ Configuration minimale (limitations de taille)
- ✅ Filtrage des données sensibles

---

## 🔒 Sécurité et Confidentialité

### Données Filtrées Automatiquement
- ❌ Cookies
- ❌ Headers Authorization
- ❌ Query params `token`, `key`
- ❌ Mots de passe
- ❌ Données sensibles marquées

### Session Replay
- ✅ Tout le texte masqué par défaut
- ✅ Tous les médias bloqués
- ✅ Seulement 10% des sessions enregistrées
- ✅ 100% des sessions avec erreur

### Source Maps
- ✅ Source maps uploadés seulement en production
- ✅ Source maps cachés du public
- ✅ Seulement accessible à votre équipe Sentry

---

## 📈 Monitoring et Alertes

### Créer des Alertes dans Sentry

1. Dans Sentry : Alerts > Create Alert Rule
2. Types d'alertes utiles :
   - **Issues** : Nouvelle erreur détectée
   - **Frequency** : Erreur se produit X fois en Y minutes
   - **Users Affected** : X utilisateurs affectés
   - **Performance** : LCP > 2.5s, FID > 100ms

3. Canaux de notification :
   - Email
   - Slack
   - Discord
   - Webhooks

### Exemple d'Alerte Recommandée

```
Type: Frequency
Condition: When an issue is seen more than 10 times in 5 minutes
Action: Send email to team@mprincloud.com
```

---

## 🎯 Best Practices

### ✅ DO

```typescript
// ✅ Ajouter du contexte aux erreurs
captureError(error, {
  tags: { feature: "payment", step: "checkout" },
  extra: { orderId, amount },
});

// ✅ Utiliser des breadcrumbs
addBreadcrumb("User clicked checkout button", "user-action");

// ✅ Définir le contexte utilisateur après login
setUserContext({ id, email, name });

// ✅ Gérer les erreurs gracieusement
try {
  await operation();
} catch (error) {
  captureError(error);
  showErrorToast("Une erreur est survenue");
}
```

### ❌ DON'T

```typescript
// ❌ Capturer des erreurs sans contexte
captureError(error); // Pas assez d'infos !

// ❌ Capturer des erreurs attendues/normales
try {
  const user = await findUser(id);
} catch (NotFoundError) {
  captureError(NotFoundError); // Ne pas faire ça !
}

// ❌ Logger des données sensibles
captureError(error, {
  extra: { password: "secret123" }, // ❌ NON !
});

// ❌ Trop de breadcrumbs inutiles
onClick={() => {
  addBreadcrumb("Button clicked"); // Trop verbeux
}}
```

---

## 📊 Dashboard Recommandé

Créez un Dashboard dans Sentry avec :

1. **Error Rate** : Taux d'erreur par heure
2. **User Impact** : Nombre d'utilisateurs affectés
3. **Performance Metrics** :
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)
4. **Top Errors** : Les 10 erreurs les plus fréquentes
5. **Browser Breakdown** : Erreurs par navigateur
6. **Release Health** : Santé des déploiements

---

## 🔄 CI/CD Integration

### GitHub Actions (Optionnel)

Ajoutez à `.github/workflows/deploy.yml` :

```yaml
- name: Create Sentry Release
  uses: getsentry/action-release@v1
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
    SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
  with:
    environment: production
    version: ${{ github.sha }}
```

---

## 🎓 Ressources

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Best Practices](https://docs.sentry.io/product/best-practices/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)

---

## ✅ Checklist de Configuration

- [x] Installer `@sentry/nextjs`
- [x] Créer les fichiers de configuration
- [x] Intégrer dans `next.config.ts`
- [x] Ajouter error boundaries
- [x] Créer helpers dans `src/lib/sentry.ts`
- [ ] Créer un compte Sentry.io
- [ ] Obtenir le DSN
- [ ] Ajouter variables d'environnement
- [ ] Tester avec `/api/sentry-test`
- [ ] Configurer les alertes
- [ ] Déployer en production
- [ ] Vérifier les erreurs capturées

---

## 🎉 Prochaines Étapes

1. **Créer un compte Sentry** : [sentry.io](https://sentry.io)
2. **Copier le DSN** dans `.env.local`
3. **Tester** : `npm run dev` puis visitez `/api/sentry-test`
4. **Vérifier** : Ouvrez Sentry.io > Issues
5. **Configurer alertes** : Pour être notifié des erreurs
6. **Déployer** : Les erreurs de production seront capturées !

---

**Sentry est maintenant configuré ! 🎉**  
Toutes les erreurs seront automatiquement capturées et envoyées à votre dashboard Sentry.

