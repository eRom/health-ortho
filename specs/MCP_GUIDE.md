# 🔌 Guide MCP (Model Context Protocol) - Health In Cloud

**Projet** : Health In Cloud  
**Type** : Guide complet des MCP installés et configurés  
**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2025

---

## 📖 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [MCP Installés](#mcp-installés)
3. [Exemples d'Utilisation](#exemples-dutilisation)
4. [Workflow Complet](#workflow-complet)
5. [Matrice de Décision](#matrice-de-décision)

---

## 🎯 Vue d'Ensemble

### Qu'est-ce que MCP ?

Les **Model Context Protocol (MCP)** permettent à l'IA d'interagir directement avec des services externes pour améliorer la productivité du développement.

### Avantages pour Health In Cloud

- ✅ **Productivité** : L'IA peut directement interagir avec vos outils
- ✅ **Automatisation** : Déploiements, tests, monitoring automatisés
- ✅ **Debugging** : Analyse en temps réel des erreurs et performances
- ✅ **Documentation** : Accès instantané aux docs à jour
- ✅ **Intégration** : Workflow unifié avec tous vos services

---

## 🔌 MCP Installés

### 1. **Context7** ⭐⭐⭐⭐⭐
- **Usage** : Documentation des bibliothèques en temps réel
- **Fonctionnalités** :
  - Recherche de documentation Next.js, React, Prisma, etc.
  - Exemples de code à jour
  - Résolution automatique des IDs de librairie
- **Commandes** :
  - `resolve-library-id` : Trouver l'ID d'une librairie
  - `get-library-docs` : Récupérer la documentation
- **Utilité** : Essentiel pour développement Next.js/React

### 2. **Sentry** ⭐⭐⭐⭐⭐
- **Usage** : Monitoring et gestion des erreurs
- **Fonctionnalités** :
  - Rechercher des issues/erreurs
  - Analyser les traces et événements
  - Consulter les détails d'issues spécifiques
  - Mettre à jour le statut des issues
  - Rechercher dans la documentation Sentry
- **Commandes principales** :
  - `search_issues` : Rechercher des issues groupées
  - `search_events` : Rechercher des événements/comptages
  - `get_issue_details` : Détails d'une issue spécifique
  - `update_issue` : Mettre à jour une issue (résoudre, assigner)
  - `search_docs` : Rechercher dans la doc Sentry
- **Utilité** : Critique pour monitoring production

### 3. **Playwright** ⭐⭐⭐⭐⭐
- **Usage** : Tests E2E et automatisation navigateur
- **Fonctionnalités** :
  - Naviguer sur des pages web
  - Interagir avec des éléments (click, type, etc.)
  - Prendre des screenshots
  - Capturer les logs console et réseau
  - Tests d'accessibilité (snapshots)
- **Commandes principales** :
  - `browser_navigate` : Naviguer vers une URL
  - `browser_click` : Cliquer sur un élément
  - `browser_type` : Saisir du texte
  - `browser_snapshot` : Capture accessibilité
  - `browser_take_screenshot` : Capture d'écran
- **Utilité** : Essentiel pour tests E2E automatisés

### 4. **Shadcn** ⭐⭐⭐⭐⭐
- **Usage** : Composants UI shadcn/ui
- **Fonctionnalités** :
  - Rechercher des composants shadcn/ui
  - Voir des exemples de code
  - Récupérer les commandes d'installation
  - Consulter la documentation des composants
- **Commandes principales** :
  - `search_items_in_registries` : Rechercher composants
  - `view_items_in_registries` : Voir détails d'un composant
  - `get_item_examples_from_registries` : Exemples d'utilisation
  - `get_add_command_for_items` : Commande d'installation
- **Utilité** : Accélère développement UI

### 5. **Prisma** ⭐⭐⭐⭐⭐
- **Usage** : Gestion ORM et migrations
- **Fonctionnalités** :
  - Explorer le schéma de base de données
  - Gérer les migrations
  - Consulter la documentation Prisma
  - Optimiser les requêtes
  - Générer le client Prisma
  - Visualiser les relations entre modèles
- **Commandes principales** :
  - Exploration du schéma
  - Documentation intégrée
  - Aide aux migrations
  - Optimisation des requêtes
- **Utilité** : Excellent pour gestion DB

### 6. **Vercel** ⭐⭐⭐⭐⭐
- **Usage** : Déploiement et monitoring
- **Fonctionnalités** :
  - Consulter les déploiements
  - Voir les logs en temps réel
  - Gérer les variables d'environnement
  - Consulter les métriques analytics
  - Déclencher des déploiements
  - Gérer les domaines personnalisés
- **Commandes principales** :
  - Liste des déploiements
  - Logs en temps réel
  - Variables d'environnement
  - Analytics & métriques
- **Utilité** : Essentiel pour déploiement

### 7. **Neon** ⭐⭐⭐⭐⭐
- **Usage** : Gestion base de données PostgreSQL
- **Fonctionnalités** :
  - Gérer les branches de DB
  - Consulter les métriques de performance
  - Voir l'usage compute/storage
  - Gérer les connexions
  - Créer et gérer des branches
  - Point-in-time recovery
- **Commandes principales** :
  - Gestion des branches DB
  - Métriques de performance
  - Usage compute/storage
  - Connection strings
- **Utilité** : Essentiel pour gestion DB

### 8. **Cloudflare** ⭐⭐⭐⭐⭐
- **Usage** : CDN, DNS, sécurité, performance
- **Fonctionnalités** :
  - Gérer les DNS records (A, CNAME, etc.)
  - Consulter les analytics en temps réel
  - Configurer le WAF (Web Application Firewall)
  - Gérer le cache et les Page Rules
  - Monitoring du trafic
  - Protection DDoS
  - Configuration SSL/TLS
- **Commandes principales** :
  - Gestion des DNS records
  - Configuration du cache
  - Analytics et métriques
  - Gestion de la sécurité
- **Domaine configuré** : `healthincloud.app`

### 9. **Chrome DevTools** ⭐⭐⭐⭐⭐
- **Usage** : Debugging avancé, analyse de performance, accessibilité
- **Fonctionnalités** :
  - Inspection du DOM en temps réel
  - Debugging JavaScript (console, breakpoints)
  - Analyse de performance (LCP, FID, CLS)
  - Tests d'accessibilité (Lighthouse, WCAG)
  - Inspection CSS avancée (computed styles, layout)
  - Analyse du réseau (requêtes, timing, bundle size)
  - Profiling JavaScript
  - Screenshots et responsive testing
- **Commandes principales** :
  - Inspecter éléments et styles
  - Exécuter code dans la console
  - Analyser les performances
  - Auditer l'accessibilité
  - Capturer screenshots
- **Utilité** : Excellent pour objectifs performance & a11y

**Complémentarité avec Playwright** :
```
Playwright MCP    → Tests fonctionnels (ça marche ?)
Chrome DevTools   → Debugging & Optimisation (pourquoi/comment ?)
```

---

## 💡 Exemples d'Utilisation

### Debugging avec Sentry MCP

```
1. Détection d'une erreur dans l'app
2. AI utilise Sentry MCP → search_issues("database connection error")
3. AI analyse les issues retournées
4. AI utilise get_issue_details(issue_id) pour plus de contexte
5. AI propose une solution basée sur les stack traces
6. AI peut update_issue() pour marquer comme résolu
```

### Déploiement avec Vercel MCP

```
1. Code prêt pour déploiement
2. AI utilise Vercel MCP → list_deployments()
3. AI vérifie le dernier déploiement
4. AI consulte les logs si erreurs
5. AI suggère des optimisations basées sur les métriques
```

### Ajout de Composant avec Shadcn MCP

```
1. Besoin d'un composant Dialog
2. AI utilise Shadcn MCP → search_items("dialog")
3. AI récupère get_item_examples("dialog-demo")
4. AI fournit get_add_command("@shadcn/dialog")
5. AI génère le code d'intégration
```

### Gestion DB avec Prisma MCP

```
1. Modification du schéma Prisma nécessaire
2. AI utilise Prisma MCP → explore schema
3. AI identifie les relations existantes
4. AI suggère les modifications optimales
5. AI génère la migration appropriée
6. AI fournit les commandes de migration
```

### Gestion DB avec Neon MCP

```
1. Besoin de créer une branche DB pour tester une feature
2. AI utilise Neon MCP → create_branch()
3. AI crée une branche "feature-test" depuis main
4. AI fournit la connection string de la nouvelle branche
5. AI peut vérifier les métriques de performance
6. AI peut gérer le scaling compute selon usage
7. AI peut supprimer la branche après tests
```

### Configuration DNS avec Cloudflare MCP

```
1. Besoin de configurer le domaine healthincloud.app
2. AI utilise Cloudflare MCP → list_dns_records()
3. AI vérifie la configuration actuelle
4. AI suggère les records DNS optimaux pour Vercel
5. AI peut créer/mettre à jour les records
6. AI configure le cache et les Page Rules
7. AI active la protection DDoS et le WAF
```

### Debugging CSS avec Chrome DevTools MCP

```
Scénario : Bug d'affichage sur mobile

1. Patient signale : "Le bouton est coupé sur mon téléphone"
2. AI utilise Chrome DevTools MCP → ouvre l'app en mobile viewport
3. AI inspecte l'élément problématique (button)
4. AI analyse les styles appliqués :
   - overflow: hidden
   - width: 100%
   - padding manquant
5. AI identifie : le container parent a max-width trop petit
6. AI propose la correction dans le code
7. AI vérifie le résultat avec screenshot
```

### Optimisation Performance avec Chrome DevTools MCP

```
Scénario : Page dashboard lente à charger

1. AI utilise Chrome DevTools MCP → Performance tab
2. AI enregistre le chargement de /dashboard
3. AI analyse les métriques Core Web Vitals :
   - LCP: 4.2s (❌ doit être < 2.5s)
   - FID: 85ms (✅ bon)
   - CLS: 0.05 (✅ bon)
4. AI identifie : Large image non optimisée (2.5MB)
5. AI applique optimisations :
   - Convertir en AVIF/WebP
   - Ajouter priority loading
   - Lazy load pour images en-dessous du fold
6. AI vérifie le résultat : LCP = 1.8s ✅
```

### Audit Accessibilité avec Chrome DevTools MCP

```
Scénario : Vérifier conformité WCAG 2.1 AA

1. AI utilise Chrome DevTools MCP → Lighthouse
2. AI lance un audit d'accessibilité sur la landing page
3. AI détecte les problèmes :
   - ❌ Contraste insuffisant (3.2:1 vs 4.5:1 requis)
   - ❌ Boutons sans aria-label
   - ❌ Image décorative sans alt vide
   - ✅ Hiérarchie headings correcte
4. AI propose les corrections spécifiques :
   - Changer color: #999 → #666 (ratio 4.8:1)
   - Ajouter aria-label="Menu" sur le bouton
   - Ajouter alt="" sur l'image décorative
5. AI re-vérifie : Score accessibilité 98/100 ✅
```

---

## 🔄 Workflow Complet

### Phase 1 : Développement

```
1. Code Feature
   ├─ Context7 MCP → Documentation Next.js/React
   ├─ Shadcn MCP → Ajouter composants UI
   └─ Prisma MCP → Modifications schéma DB

2. Tests Locaux
   ├─ Chrome DevTools MCP → Debugging CSS/JS
   ├─ Chrome DevTools MCP → Tests responsive
   └─ Playwright MCP → Tests E2E basiques

3. Tests & Validation
   └─ Vérifications locales
```

### Phase 2 : Tests & Optimisation

```
1. Tests Fonctionnels
   ├─ Playwright MCP → Suite E2E complète
   └─ Chrome DevTools MCP → Debugging si échec

2. Tests Performance
   ├─ Chrome DevTools MCP → Audit Lighthouse
   ├─ Chrome DevTools MCP → Analyse bundle
   └─ Chrome DevTools MCP → Core Web Vitals

3. Tests Accessibilité
   ├─ Chrome DevTools MCP → WCAG audit
   └─ Chrome DevTools MCP → Tests contrastes

4. Optimisations
   ├─ Chrome DevTools MCP → Identifier goulots
   └─ Code fixes
```

### Phase 3 : Déploiement

```
1. Pre-deploy
   └─ Vercel MCP → Vérifier preview deployment

2. Deploy
   ├─ Push vers main
   ├─ Vercel MCP → Deploy automatique
   └─ Cloudflare MCP → Vérifier DNS/Cache (si configuré)

3. Post-deploy
   ├─ Chrome DevTools MCP → Tests smoke production
   └─ Sentry MCP → Vérifier absence d'erreurs
```

### Phase 4 : Monitoring Production

```
1. Monitoring Continu
   ├─ Sentry MCP → Tracking erreurs temps réel
   └─ Vercel MCP → Analytics & métriques

2. Debugging Production
   ├─ Sentry MCP → Identifier issue
   ├─ Chrome DevTools MCP → Reproduire localement
   ├─ Chrome DevTools MCP → Debugger
   └─ Fix et push vers repository

3. Support Utilisateurs
   ├─ Chrome DevTools MCP → Investiguer bug rapporté
   └─ Fix et push vers repository
```

---

## 🎯 Matrice de Décision

| Besoin | MCP Recommandé | Pourquoi |
|--------|----------------|----------|
| **Documentation** | Context7 | Docs à jour Next.js/React/Prisma |
| **Ajouter composant UI** | Shadcn | Exemples code + commande install |
| **Schéma DB** | Prisma | Explorer relations, migrations |
| **Tests E2E** | Playwright | Automatisation parcours utilisateur |
| **Bug CSS** | Chrome DevTools | Inspection styles temps réel |
| **Performance lente** | Chrome DevTools | Profiling, Core Web Vitals |
| **Accessibilité** | Chrome DevTools | Audit WCAG, contrastes |
| **Erreur production** | Sentry | Stack traces, contexte erreur |
| **Déploiement** | Vercel | Logs, preview, env vars |
| **DNS/CDN** | Cloudflare | Configuration domaine, cache |
| **Gestion projet** | Linear (background) | Issues, roadmap, cycles |
| **Monitoring infra** | Vercel | Déploiements, logs, analytics |
| **DB Management** | Neon | Branches, métriques, connexions |

---

**Document créé le** : Octobre 2025  
**Dernière mise à jour** : Octobre 2025  
**Version** : 1.0.0  
**Statut** : ✅ Guide complet des MCP configurés
