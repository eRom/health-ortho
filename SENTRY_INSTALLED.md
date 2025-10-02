# ✅ Sentry - Installation Complète

Sentry a été installé et configuré avec succès dans votre application MPR In Cloud ! 🎉

---

## 📦 Ce qui a été installé

### Package
- ✅ `@sentry/nextjs` v7.x installé

### Fichiers de Configuration Créés

#### Configuration Sentry ✨ **Nouveau format Turbopack**
1. **`instrumentation-client.ts`** - Configuration client (navigateur)
   - Error tracking
   - Performance monitoring (10% sample)
   - Session Replay (10%/100% avec erreur)
   - Filtrage des erreurs non pertinentes
   - **✨ Compatible Turbopack (Next.js 15+)**

2. **`instrumentation.ts`** - Configuration serveur et Edge
   - Auto-init de Sentry pour Node.js et Edge Runtime
   - Error tracking serveur
   - Performance monitoring (10% sample)
   - Profiling (10% en production)
   - Intégration Prisma
   - Filtrage des données sensibles
   - Hook `onRequestError` pour capturer les erreurs de requête

> **Note** : Migration effectuée vers la nouvelle structure recommandée.  
> Les anciens fichiers `sentry.*.config.ts` ont été supprimés et remplacés par `instrumentation.ts` et `instrumentation-client.ts`.

#### Intégration Next.js
5. **`next.config.ts`** - Mis à jour
   - `withSentryConfig` wrapper
   - Configuration upload source maps
   - Options de build optimisées

#### Composants & Utils
6. **`src/lib/sentry.ts`** - Helpers Sentry
   - `captureError()` - Capturer une erreur
   - `captureMessage()` - Logger un message
   - `setUserContext()` - Définir l'utilisateur
   - `addBreadcrumb()` - Ajouter un breadcrumb
   - `withErrorBoundary()` - Wrapper de fonction
   - Et plus...

7. **`src/app/global-error.tsx`** - Error boundary root
   - Capture les erreurs fatales
   - UI d'erreur sympathique
   - Intégration Sentry

8. **`src/app/[locale]/error.tsx`** - Mis à jour
   - Capture les erreurs de pages
   - Envoie automatiquement à Sentry
   - Context et tags

9. **`src/components/providers/sentry-user-provider.tsx`**
   - Provider pour synchroniser automatiquement l'utilisateur avec Sentry

10. **`src/app/api/sentry-test/route.ts`**
    - Route de test (dev uniquement)
    - Pour vérifier que Sentry fonctionne

#### Documentation
11. **`SENTRY_SETUP.md`** - Guide complet de configuration
12. **`SENTRY_EXAMPLES.md`** - Exemples d'utilisation détaillés
13. **`SENTRY_QUICK_REFERENCE.md`** - Aide-mémoire rapide
14. **`SENTRY_INSTALLED.md`** - Ce fichier

#### Configuration Système
15. **`.gitignore`** - Mis à jour
    - Exclusion des fichiers Sentry sensibles

---

## 🚀 Prochaines Étapes

### 1. Créer un Compte Sentry (5 minutes)

```bash
# 1. Aller sur https://sentry.io
# 2. Créer un compte gratuit (10k événements/mois gratuits)
# 3. Créer une organisation
# 4. Créer un projet Next.js
# 5. Copier le DSN fourni
```

### 2. Configurer les Variables d'Environnement

Créez `.env.local` avec :

```env
# Sentry (REQUIS)
NEXT_PUBLIC_SENTRY_DSN="https://[key]@[org].ingest.sentry.io/[project-id]"

# Pour upload des source maps (optionnel en dev, requis en prod)
SENTRY_ORG="votre-organization-slug"
SENTRY_PROJECT="votre-project-slug"
SENTRY_AUTH_TOKEN="votre-auth-token"

# Variables existantes...
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="votre-secret-32-chars-minimum"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Tester Localement

```bash
# Démarrer le serveur
npm run dev

# Dans un autre terminal, tester
curl http://localhost:3000/api/sentry-test

# Vérifier dans Sentry.io > Issues
# L'erreur devrait apparaître en ~10 secondes
```

### 4. Configuration Production (Vercel/AWS/etc.)

Dans votre plateforme de déploiement :

```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=votre-org
SENTRY_PROJECT=votre-projet  
SENTRY_AUTH_TOKEN=votre-token (requis pour source maps)
```

---

## 💡 Utilisation Rapide

### Capturer une Erreur

```typescript
import { captureError } from "@/lib/sentry";

try {
  await operation();
} catch (error) {
  captureError(error, {
    tags: { feature: "payment" },
    extra: { orderId: "123" },
  });
}
```

### Définir l'Utilisateur (après login)

```typescript
import { setUserContext } from "@/lib/sentry";

setUserContext({
  id: user.id,
  email: user.email,
  name: user.name,
});
```

### Logger un Message

```typescript
import { captureMessage } from "@/lib/sentry";

captureMessage("Quota limit reached", "warning");
```

---

## 📚 Documentation

| Fichier | Contenu |
|---------|---------|
| **`SENTRY_SETUP.md`** | 📖 Guide complet : compte Sentry, configuration, alertes |
| **`SENTRY_EXAMPLES.md`** | 💡 Exemples détaillés : API routes, composants, hooks |
| **`SENTRY_QUICK_REFERENCE.md`** | 📌 Aide-mémoire : imports, cas d'usage, commandes |
| **`SENTRY_INSTALLED.md`** | ✅ Ce fichier : récapitulatif installation |

---

## 🎯 Fonctionnalités Activées

### ✅ Error Tracking
- Capture automatique des erreurs non gérées
- Stack traces détaillées
- Source maps en production
- Filtrage des erreurs non pertinentes

### ✅ Performance Monitoring
- Monitoring des transactions (10% sample)
- LCP, FID, CLS tracking
- Profiling serveur (10% en production)
- Custom transactions

### ✅ Session Replay
- 10% des sessions normales enregistrées
- 100% des sessions avec erreur
- Texte et médias masqués par défaut
- RGPD compliant

### ✅ Context & Enrichment
- User context automatique
- Breadcrumbs (navigation)
- Tags personnalisés
- Extra data

### ✅ Sécurité
- Filtrage des cookies/tokens
- Source maps sécurisés
- Données sensibles masquées
- HTTPS uniquement

---

## 🔒 Sécurité & Confidentialité

### Données JAMAIS Envoyées
- ❌ Mots de passe
- ❌ Tokens d'authentification
- ❌ Cookies de session
- ❌ Numéros de carte bancaire
- ❌ Données marquées comme sensibles

### Données Envoyées
- ✅ Stack traces (avec source maps)
- ✅ URL de la page (sans query params sensibles)
- ✅ User ID/email (pour contexte)
- ✅ Browser/OS info
- ✅ Breadcrumbs (navigation)

### Conformité
- ✅ RGPD compliant
- ✅ Session replay opt-out possible
- ✅ Données stockées en EU (option Sentry)
- ✅ Rétention configurable

---

## 📊 Monitoring Recommandé

### Alertes à Configurer

1. **Erreur Critique** : Nouvelle erreur non résolue
2. **Fréquence** : Erreur > 10 fois en 5 minutes
3. **Impact Utilisateur** : > 10 utilisateurs affectés
4. **Performance** : LCP > 2.5s

### Dashboard à Créer

- Taux d'erreur par heure
- Top 10 des erreurs
- Utilisateurs affectés
- Performance metrics (LCP, FID, CLS)
- Breakdown par navigateur/OS

---

## 🎓 Ressources

### Documentation Interne
- [Setup Complet](./SENTRY_SETUP.md)
- [Exemples](./SENTRY_EXAMPLES.md)
- [Référence Rapide](./SENTRY_QUICK_REFERENCE.md)

### Documentation Officielle
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Best Practices](https://docs.sentry.io/product/best-practices/)
- [Performance](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

### Support
- [Sentry Discord](https://discord.gg/sentry)
- [GitHub Issues](https://github.com/getsentry/sentry-javascript/issues)
- [Status Page](https://status.sentry.io/)

---

## ✅ Checklist de Mise en Production

Avant de déployer en production :

- [ ] Compte Sentry créé
- [ ] Projet Next.js créé dans Sentry
- [ ] DSN copié et testé en dev
- [ ] Variables d'environnement configurées en production
- [ ] Auth token créé (pour source maps)
- [ ] Alertes configurées (Email/Slack)
- [ ] Dashboard créé
- [ ] Équipe invitée dans Sentry
- [ ] Politique de rétention définie
- [ ] Documentation lue par l'équipe
- [ ] Tests en staging effectués
- [ ] Release créée dans Sentry

---

## 🚨 En Cas de Problème

### Sentry ne reçoit pas d'erreurs

1. Vérifier que `NEXT_PUBLIC_SENTRY_DSN` est défini
2. Tester avec `/api/sentry-test`
3. Vérifier la console browser (F12) pour erreurs Sentry
4. Vérifier que le projet Sentry est actif

### Source Maps ne fonctionnent pas

1. Vérifier `SENTRY_AUTH_TOKEN` en production
2. Vérifier `SENTRY_ORG` et `SENTRY_PROJECT`
3. Regarder les logs de build pour erreurs upload
4. Vérifier les permissions du auth token

### Trop d'événements consommés

1. Réduire `tracesSampleRate` (ex: 0.05 = 5%)
2. Réduire `replaysSessionSampleRate` (ex: 0.05 = 5%)
3. Améliorer les filtres `beforeSend`
4. Utiliser `ignoreErrors` pour erreurs connues

---

## 🎉 Félicitations !

Sentry est maintenant opérationnel ! Vous allez pouvoir :

- 🔍 Détecter les bugs avant vos utilisateurs
- 📊 Monitorer les performances en temps réel
- 🎥 Voir ce que faisait l'utilisateur avant l'erreur
- 📧 Être alerté des problèmes critiques
- 📈 Améliorer la qualité de votre application

**Prochaine étape** : Créez votre compte sur [sentry.io](https://sentry.io) et ajoutez le DSN ! 🚀

---

**Installation effectuée le** : 2 octobre 2025  
**Version Sentry** : @sentry/nextjs v7.x  
**Configuré pour** : Next.js 15.5, React 19

