# 🗺️ Roadmap - Health In Cloud

**Projet** : Health In Cloud  
**Version** : 0.1.0  
**Dernière mise à jour** : Octobre 2025

---

## 📊 Score Actuel du Projet

| Catégorie | Score | Status |
|-----------|-------|--------|
| Architecture | ?/10 | ✅ TODO |
| TypeScript | ?/10 | ❌  TODO |
| Performance | ?/10 | ✅ TODO |
| Sécurité | ?/10 | ✅ TODO |
| i18n | ?/10 | ✅ TODO |
| SEO | ?/10 | ✅ TODO |
| Accessibilité | ?/10 | ✅ Excellent |
| Tests | ?/10 | ⚠️ En cours |
| Documentation | ?/10 | ✅ Complet |
| Error Handling | ?/10 | ✅ Implémenté |

**Score Global** : ?/10 ⭐

---

## 🎯 Phase 1 : MVP (Actuelle)

**Objectif** : Application fonctionnelle avec authentification et pages de base  
**Période** : Sprint 1-2  
**Status** : 🟡 En cours

### Infrastructure & Configuration
- [ ] Base de données Neon DB en production
- [ ] Variables d'environnement production configurées
- [ ] DNS Cloudflare configurés
- [ ] Déploiement Vercel production actif
- [ ] SSL/TLS activé et fonctionnel
- [ ] Monitoring Sentry configuré

### Authentification
- [ ] Système d'authentification Better Auth fonctionnel
- [ ] Connexion Email/Password
- [ ] Google OAuth (optionnel)
- [ ] Apple Sign In (optionnel)
- [ ] Protection des routes
- [ ] Gestion des sessions

### Pages Publiques
- [ ] Landing page complète
- [ ] Page Merci fonctionnelle
- [ ] SEO optimisé (metadata, sitemap, robots.txt)

### Navigation & Layout
- [ ] Header avec navigation principale
- [ ] Menu utilisateur (si authentifié)
- [ ] Switcher de langue (FR/EN)
- [ ] Footer avec liens utiles
- [ ] Navigation responsive mobile

### Internationalisation
- [ ] Support FR/EN complet
- [ ] Traductions toutes les pages
- [ ] Switcher de langue fonctionnel
- [ ] Metadata i18n

### Pages Protégées (Base)
- [ ] Dashboard utilisateur (base)
- [ ] Page Profil utilisateur (base)
- [ ] Structure pages Exercices Neuro (base)
- [ ] Structure pages Exercices Ortho (base)

### Tests & Qualité
- [ ] Tests unitaires essentiels (auth, navigation)
- [ ] Tests E2E parcours critiques
- [ ] Coverage minimum 50%
- [ ] Build production sans erreur
- [ ] Linter 0 erreur

---

## 🚀 Phase 2 : Core Features

**Objectif** : Fonctionnalités principales d'exercices et suivi  
**Période** : Sprint 3-4  
**Status** : ⏳ À faire

### Exercices Neuropsychologiques
- [ ] Module Mémoire visuelle
- [ ] Module Attention soutenue
- [ ] Module Fonctions exécutives
- [ ] Module Mémoire de travail
- [ ] Instructions claires pour chaque exercice
- [ ] Feedback immédiat utilisateur

### Exercices Orthophoniques
- [ ] Module Lecture
- [ ] Module Compréhension
- [ ] Module Expression orale
- [ ] Module Vocabulaire
- [ ] Instructions audio (optionnel)
- [ ] Support visuel adapté

### Système de Progression
- [ ] Enregistrement des résultats
- [ ] Calcul des scores
- [ ] Historique des exercices
- [ ] Graphiques de progression
- [ ] Objectifs personnalisés
- [ ] Recommandations automatiques

### Dashboard Enrichi
- [ ] Statistiques globales
- [ ] Graphiques de performance
- [ ] Derniers exercices effectués
- [ ] Objectifs en cours
- [ ] Badges/récompenses (optionnel)

### Profil Utilisateur Complet
- [ ] Informations personnelles complètes
- [ ] Préférences d'exercices
- [ ] Historique détaillé
- [ ] Statistiques personnelles
- [ ] Export des données (PDF)
- [ ] Partage des résultats (optionnel)

### Tests & Qualité
- [ ] Tests unitaires modules exercices
- [ ] Tests E2E parcours exercices
- [ ] Coverage 70%+
- [ ] Tests de performance
- [ ] Validation accessibilité WCAG 2.1 AA

---

## 🎨 Phase 3 : Advanced Features

**Objectif** : Fonctionnalités avancées et interface professionnelle  
**Période** : Sprint 5+  
**Status** : ⏳ À faire

### Dashboard Professionnel
- [ ] Vue multi-patients (pour orthophonistes)
- [ ] Statistiques agrégées
- [ ] Gestion des groupes
- [ ] Planification des séances
- [ ] Notes professionnelles
- [ ] Export rapports professionnels

### Gestion Multi-Patients
- [ ] Interface professionnelle
- [ ] Assignation d'exercices
- [ ] Suivi individualisé
- [ ] Communications sécurisées
- [ ] Gestion des rendez-vous

### Rapports & Analytics
- [ ] Rapports personnalisés
- [ ] Export PDF avancé
- [ ] Graphiques détaillés
- [ ] Comparaison de performances
- [ ] Insights automatiques
- [ ] Recommandations IA (futur)

### API Publique
- [ ] Documentation API
- [ ] Authentification API (JWT/OAuth)
- [ ] Endpoints CRUD
- [ ] Rate limiting
- [ ] Webhooks
- [ ] SDK JavaScript

### Intégrations Tierces
- [ ] Google Calendar (rendez-vous)
- [ ] Export vers EMR (Electronic Medical Records)
- [ ] Intégration Linear (task management)
- [ ] Intégration Slack (notifications)
- [ ] Zapier/Make (automation)

### PWA Avancée
- [ ] Service Worker complet
- [ ] Offline mode fonctionnel
- [ ] Cache stratégique
- [ ] Background sync
- [ ] Push notifications
- [ ] Installation app mobile

---

## 📋 Priorités Immédiates (Sprint 1-2)

### 🔴 Priorité HAUTE

#### 1. Infrastructure Production
- [ ] Récupérer connection strings Neon DB
- [ ] Générer `BETTER_AUTH_SECRET` production
- [ ] Configurer variables d'environnement Vercel
- [ ] Appliquer migrations Prisma en production
- [ ] Configurer DNS Cloudflare
- [ ] Tester déploiement production

#### 2. UI/UX Essentiels
- [ ] Implémenter Footer global
  - [ ] Structure HTML/React
  - [ ] Liens utiles (mentions légales, CGU, contact)
  - [ ] Copyright MPR Nantes
  - [ ] Support i18n
  - [ ] Responsive mobile
- [ ] Améliorer Header mobile
  - [ ] Menu hamburger
  - [ ] Animation smooth
  - [ ] Accessibilité clavier
- [ ] Optimiser Landing page
  - [ ] Hero section impactante
  - [ ] Call-to-action clairs
  - [ ] Features highlights
  - [ ] Testimonials (optionnel)

#### 3. Tests Essentiels
- [ ] Tests Auth
  - [ ] Login email/password
  - [ ] Logout
  - [ ] Session persistence
  - [ ] Redirections
- [ ] Tests Navigation
  - [ ] Routes publiques
  - [ ] Routes protégées
  - [ ] Redirections auth
  - [ ] 404 pages
- [ ] Tests Composants UI
  - [ ] Button variants
  - [ ] Card components
  - [ ] Header navigation
  - [ ] Footer links
- [ ] Tests E2E Critiques
  - [ ] Parcours login → dashboard
  - [ ] Changement de langue
  - [ ] Navigation complète
  - [ ] Logout
- [ ] Coverage minimum 50%

#### 4. Monitoring & Production Ready
- [ ] Configurer Sentry production
  - [ ] DSN production
  - [ ] Auth token
  - [ ] Source maps upload
  - [ ] Alertes email
- [ ] Setup monitoring
  - [ ] Vercel Analytics
  - [ ] Cloudflare Analytics
  - [ ] Error tracking Sentry
- [ ] Alertes configurées
  - [ ] Erreurs critiques → Email
  - [ ] Downtime → Notification
  - [ ] Performance dégradée → Alert

### 🟡 Priorité MOYENNE (Sprint 3-4)

#### 5. Fonctionnalités Core
- [ ] Finaliser exercices Neuro
  - [ ] Interface utilisateur
  - [ ] Logique métier
  - [ ] Enregistrement résultats
  - [ ] Feedback utilisateur
- [ ] Finaliser exercices Ortho
  - [ ] Interface utilisateur
  - [ ] Logique métier
  - [ ] Support audio (optionnel)
  - [ ] Enregistrement résultats
- [ ] Système de suivi des progrès
  - [ ] Base de données (schéma)
  - [ ] Calcul des scores
  - [ ] Graphiques de progression
  - [ ] Historique des exercices

#### 6. Analytics & Insights
- [ ] Intégrer analytics
  - [ ] Vercel Analytics activé
  - [ ] Ou Plausible Analytics (privacy-first)
  - [ ] Configuration domaine personnalisé
- [ ] Tracking événements clés
  - [ ] Signup
  - [ ] Login
  - [ ] Exercice complété
  - [ ] Export données
- [ ] Dashboard métriques
  - [ ] Utilisateurs actifs
  - [ ] Exercices populaires
  - [ ] Taux de complétion
  - [ ] Performance pages

#### 7. Optimisations Avancées
- [ ] Service Worker PWA
  - [ ] Configuration Next.js PWA
  - [ ] Stratégies de cache
  - [ ] Manifest.json complet
- [ ] Offline support
  - [ ] Cache pages critiques
  - [ ] Queue sync actions
  - [ ] Feedback utilisateur offline
- [ ] Bundle analyzer
  - [ ] Analyser bundle actuel
  - [ ] Identifier dépendances lourdes
  - [ ] Optimiser imports
  - [ ] Code splitting avancé

### 🟢 Priorité BASSE (Sprint 5+)

#### 8. Features Additionnelles
- [ ] Export résultats (PDF)
  - [ ] Template PDF professionnel
  - [ ] Graphiques inclus
  - [ ] Logo MPR Nantes
  - [ ] Génération côté serveur
- [ ] Partage de résultats
  - [ ] Lien sécurisé partageable
  - [ ] Expiration automatique
  - [ ] Protection par code (optionnel)
- [ ] Interface administration
  - [ ] Dashboard admin
  - [ ] Gestion utilisateurs
  - [ ] Modération contenu
  - [ ] Statistiques globales

#### 9. Nice to Have
- [ ] Storybook pour composants
  - [ ] Configuration Storybook
  - [ ] Stories pour tous les composants UI
  - [ ] Documentation interactive
- [ ] Lighthouse CI
  - [ ] Intégration GitHub Actions
  - [ ] Seuils de performance
  - [ ] Rapports automatiques
- [ ] A/B testing infrastructure
  - [ ] Outil A/B testing (Vercel, Posthog)
  - [ ] Tracking variants
  - [ ] Analytics résultats
- [ ] Multi-tenancy support
  - [ ] Architecture multi-tenant
  - [ ] Isolation données
  - [ ] Customisation par tenant

---

## 📄 Pages & Composants - Status Détaillé

### Pages Publiques (Route Group: `(site)/`)

#### Landing Page (`/`)
- **Route** : `src/app/[locale]/(site)/page.tsx`
- **Status** : 🟡 En cours d'amélioration
- **Tâches** :
  - [ ] Hero section impactante
  - [ ] Call-to-action clairs
  - [ ] Section fonctionnalités
  - [ ] Testimonials patients (optionnel)
  - [ ] FAQ (optionnel)
  - [ ] Footer complet

#### Page Merci (`/merci`)
- **Route** : `src/app/[locale]/(site)/merci/page.tsx`
- **Status** : ✅ Complète
- **Tâches** :
  - [x] Message de remerciement
  - [x] Support i18n

### Composants de Navigation

#### Header (`SiteHeader`)
- **Route** : `src/components/navigation/site-header.tsx`
- **Status** : 🟡 En cours d'amélioration
- **Tâches** :
  - [ ] Logo cliquable
  - [ ] Navigation principale
  - [ ] Switcher de langue
  - [ ] Menu utilisateur (si auth)
  - [ ] Bouton login (si non auth)
  - [ ] Menu mobile hamburger
  - [ ] Animation smooth
  - [ ] Sticky header (optionnel)

#### Footer
- **Route** : `src/components/navigation/site-footer.tsx`
- **Status** : ❌ À créer
- **Tâches** :
  - [ ] Créer le composant
  - [ ] Liens utiles
  - [ ] Mentions légales
  - [ ] CGU
  - [ ] Contact
  - [ ] Copyright
  - [ ] Support i18n
  - [ ] Responsive

### Pages d'Authentification (Route Group: `(auth)/`)

#### Page Login (`/auth/login`)
- **Route** : `src/app/[locale]/(auth)/auth/login/page.tsx`
- **Status** : ✅ Fonctionnelle
- **Tâches** :
  - [ ] Formulaire email/password
  - [ ] Google OAuth (optionnel)
  - [ ] Apple Sign In (optionnel)
  - [ ] Validation côté client
  - [ ] Messages d'erreur i18n
  - [ ] Redirection post-login
  - [ ] Tests E2E

### Pages Protégées (Route Group: `(app)/`)

#### Dashboard (`/dashboard`)
- **Route** : `src/app/[locale]/(app)/dashboard/page.tsx`
- **Status** : ⚠️ En cours
- **Tâches** :
  - [ ] Layout de base
  - [ ] Statistiques utilisateur
  - [ ] Derniers exercices
  - [ ] Graphiques de progression
  - [ ] Objectifs en cours
  - [ ] Quick actions

#### Exercices Neuro (`/neuro`)
- **Route** : `src/app/[locale]/(app)/neuro/page.tsx`
- **Status** : ⚠️ En cours
- **Tâches** :
  - [ ] Liste des exercices
  - [ ] Filtres par type
  - [ ] Cartes exercices
  - [ ] Statistiques par exercice
  - [ ] Lancer un exercice

#### Exercices Ortho (`/ortho`)
- **Route** : `src/app/[locale]/(app)/ortho/page.tsx`
- **Status** : ⚠️ En cours
- **Tâches** :
  - [ ] Liste des exercices
  - [ ] Filtres par type
  - [ ] Cartes exercices
  - [ ] Statistiques par exercice
  - [ ] Lancer un exercice

#### Profil Utilisateur (`/profil`)
- **Route** : `src/app/[locale]/(app)/profil/page.tsx`
- **Status** : ⚠️ En cours
- **Tâches** :
  - [ ] Informations personnelles
  - [ ] Édition profil
  - [ ] Préférences utilisateur
  - [ ] Historique complet
  - [ ] Statistiques personnelles
  - [ ] Export données

---

## 📈 Métriques de Succès

### Performance
- [ ] Lighthouse Performance Score : 90+
- [ ] LCP (Largest Contentful Paint) : < 2.5s
- [ ] FID (First Input Delay) : < 100ms
- [ ] CLS (Cumulative Layout Shift) : < 0.1
- [ ] TTI (Time to Interactive) : < 3.8s

### Accessibilité
- [ ] Lighthouse Accessibility Score : 90+
- [ ] WCAG 2.1 AA : 100% conformité
- [ ] Navigation clavier : Fonctionnelle partout
- [ ] Screen readers : Support complet
- [ ] Contrastes : Ratios respectés (4.5:1 texte, 3:1 UI)

### Tests
- [ ] Coverage unitaire : 80%+
- [ ] Coverage E2E : Parcours critiques 100%
- [ ] 0 erreur ESLint
- [ ] 0 erreur TypeScript
- [ ] Build production : Succès

### SEO
- [ ] Lighthouse SEO Score : 100
- [ ] Sitemap.xml : Généré et valide
- [ ] Robots.txt : Configuré
- [ ] Meta tags : Présents sur toutes les pages
- [ ] Open Graph : Configuré
- [ ] Structured data : Implémenté (optionnel)

---

## 🔄 Workflow de Suivi

### Comment utiliser cette roadmap ?

1. **Choisir une tâche** de la phase actuelle (Phase 1 MVP)
2. **Cocher la case** `[ ]` → `[x]` quand complétée
3. **Commiter le fichier** après chaque mise à jour
4. **Créer une issue Linear** pour chaque tâche importante (optionnel)

### Légende Status

| Symbole | Signification |
|---------|---------------|
| ✅ | Complété |
| 🟡 | En cours |
| ⚠️ | En cours (attention requise) |
| ❌ | À faire |
| ⏳ | Planifié |
| 🔴 | Priorité haute |
| 🟡 | Priorité moyenne |
| 🟢 | Priorité basse |

---

## 📝 Notes de Progression

### Semaine du [Date]
- Tâches complétées :
  - [ ] ...
- Bloqueurs :
  - [ ] ...
- Prochaines étapes :
  - [ ] ...

---

**Dernière mise à jour** : Octobre 2025  
**Prochaine revue** : [À définir]  
**Responsable** : [Votre nom]

