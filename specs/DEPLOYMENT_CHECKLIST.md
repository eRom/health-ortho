# ✅ Checklist de Déploiement - MPR In Cloud

> **Guide complet pour déployer l'application sur `healthincloud.app`**

---

## 📋 Table des Matières

1. [Avant le Déploiement](#-avant-le-déploiement)
2. [Pendant le Déploiement](#-pendant-le-déploiement)
3. [Après le Déploiement](#-après-le-déploiement)
4. [Vérifications Finales](#-vérifications-finales)
5. [Monitoring & Maintenance](#-monitoring--maintenance)

---

## 🔧 Avant le Déploiement

### 1. Configuration des Comptes & Services

#### Comptes Requis
- [x] Compte **Vercel** créé et vérifié
- [x] Compte **Neon DB** créé et projet configuré
- [ x Compte **Cloudflare** créé et domaine ajouté
- [ ] Compte **Sentry** créé et projet configuré
- [ ] Compte **Google Cloud Console** pour OAuth (si utilisé)
- [ ] Compte **Apple Developer** pour Sign In (si utilisé)

#### Domaine
- [x] Domaine `healthincloud.app` acheté
- [x] Domaine transféré/pointé vers Cloudflare
- [x] Nameservers Cloudflare configurés chez le registrar

---

### 2. Préparation du Code

#### Code Quality
- [ ] Tous les tests unitaires passent (`npm run test`)
- [ ] Tous les tests E2E Playwright passent (`npm run test:e2e`)
- [ ] Aucune erreur ESLint (`npm run lint`)
- [ ] Aucune erreur TypeScript (`npm run type-check`)
- [ ] Build local réussi (`npm run build`)
- [ ] Build local démarre sans erreur (`npm run start`)

#### Code Review
- [ ] Code review effectué (si équipe)
- [ ] Commits suivent Conventional Commits
- [ ] Changelog mis à jour (si applicable)
- [ ] Version mise à jour dans `package.json` (si applicable)

#### Git
- [ ] Code poussé sur la branche `main`
- [ ] Toutes les branches feature mergées
- [ ] Repository GitHub/GitLab configuré
- [ ] Pas de fichiers sensibles dans Git (`.env`, clés API, etc.)
- [ ] `.gitignore` à jour

---

### 3. Configuration Base de Données (Neon DB)

#### Création du Projet Neon
- [ ] Projet Neon DB créé
- [ ] Région sélectionnée (ex: `eu-central-1` pour Europe)
- [ ] Base de données créée (nom: `health_ortho` ou similaire)
- [ ] Branche `main` créée

#### Schema & Migrations
- [ ] Schema Prisma finalisé (`prisma/schema.prisma`)
- [ ] Migrations générées (`npx prisma migrate dev`)
- [ ] Migrations testées localement
- [ ] Migrations prêtes pour production

#### Connection Strings
- [ ] `DATABASE_URL` copié depuis Neon Dashboard
- [ ] `DIRECT_URL` copié depuis Neon Dashboard (pooled connection)
- [ ] Connection strings sauvegardées en lieu sûr (gestionnaire de mots de passe)

---

### 4. Configuration Authentication (Better Auth)

#### Secrets & Keys
- [ ] `BETTER_AUTH_SECRET` généré (minimum 32 caractères)
  ```bash
  # Générer un secret fort
  openssl rand -base64 32
  ```
- [ ] Secret sauvegardé en lieu sûr

#### Google OAuth (si utilisé)
- [ ] Projet Google Cloud créé
- [ ] OAuth Consent Screen configuré
- [ ] Identifiants OAuth créés
- [ ] `GOOGLE_CLIENT_ID` copié
- [ ] `GOOGLE_CLIENT_SECRET` copié
- [ ] Redirect URI ajouté : `https://healthincloud.app/api/auth/callback/google`

#### Apple Sign In (si utilisé)
- [ ] Apple Developer Account actif
- [ ] App ID créé dans Apple Developer Portal
- [ ] Service ID créé pour Sign In with Apple
- [ ] `APPLE_CLIENT_ID` copié
- [ ] `APPLE_CLIENT_SECRET` généré (JWT)
- [ ] Redirect URI ajouté : `https://healthincloud.app/api/auth/callback/apple`
- [ ] Domain ajouté et vérifié dans Apple Developer Portal

---

### 5. Configuration Monitoring (Sentry)

#### Projet Sentry
- [ ] Organisation Sentry créée
- [ ] Projet créé pour l'application
- [ ] `NEXT_PUBLIC_SENTRY_DSN` copié
- [ ] `SENTRY_ORG` noté
- [ ] `SENTRY_PROJECT` noté
- [ ] `SENTRY_AUTH_TOKEN` généré avec permissions adéquates

#### Configuration
- [ ] Source maps activées dans `next.config.ts`
- [ ] Sentry installé (`@sentry/nextjs`)
- [ ] `sentry.client.config.ts` configuré
- [ ] `sentry.server.config.ts` configuré
- [ ] `sentry.edge.config.ts` configuré (si utilisé)

---

### 6. Variables d'Environnement

#### Fichier `.env.production` Préparé
Créer un fichier avec TOUTES les variables nécessaires :

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://healthincloud.app

# Database (Neon DB)
DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require
DIRECT_URL=postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require

# Auth (Better Auth)
BETTER_AUTH_SECRET=[votre-secret-32-caracteres]
GOOGLE_CLIENT_ID=[votre-google-client-id]
GOOGLE_CLIENT_SECRET=[votre-google-client-secret]
APPLE_CLIENT_ID=[votre-apple-client-id]
APPLE_CLIENT_SECRET=[votre-apple-client-secret]

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
SENTRY_ORG=[votre-org-slug]
SENTRY_PROJECT=[votre-project-slug]
SENTRY_AUTH_TOKEN=[votre-auth-token]

# Linear (Optionnel)
LINEAR_API_KEY=[votre-linear-api-key]
```

#### Checklist Variables
- [ ] Toutes les variables listées ci-dessus préparées
- [ ] Aucune valeur de développement (localhost, etc.)
- [ ] Toutes les URLs pointent vers `healthincloud.app`
- [ ] Secrets générés avec entropie suffisante
- [ ] Variables sauvegardées dans gestionnaire de mots de passe

---

## 🚀 Pendant le Déploiement

### 1. Configuration Vercel

#### Import du Projet
- [ ] Connecter Vercel à GitHub/GitLab
- [ ] Importer le repository `health-ortho`
- [ ] Framework détecté automatiquement (Next.js)
- [ ] Configuration build acceptée (défaut)

#### Variables d'Environnement Vercel
- [ ] Aller dans **Settings** → **Environment Variables**
- [ ] Ajouter **TOUTES** les variables du fichier `.env.production`
- [ ] Sélectionner environnements : **Production** + **Preview**
- [ ] Vérifier qu'aucune variable n'est manquante

#### Configuration Build
Vérifier que Vercel utilise :
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`
- [ ] Development Command: `npm run dev`
- [ ] Node.js Version: `20.x` (selon `.nvmrc`)

---

### 2. Intégration Neon DB avec Vercel

#### Méthode Automatique (Recommandée)
- [ ] Dans Vercel Dashboard → **Integrations**
- [ ] Rechercher "Neon" et cliquer "Add"
- [ ] Autoriser Vercel à accéder à Neon
- [ ] Sélectionner le projet Neon DB
- [ ] Vérifier que `DATABASE_URL` et `DIRECT_URL` sont auto-configurées

#### Vérification
- [ ] Variables `DATABASE_URL` et `DIRECT_URL` présentes dans Vercel
- [ ] Connection string pointe vers le bon endpoint Neon

---

### 3. Configuration Cloudflare

#### DNS Records
- [ ] Aller dans **Cloudflare Dashboard** → **DNS**
- [ ] Ajouter record **A** :
  ```
  Type: A
  Name: @
  IPv4: 76.76.21.21
  Proxy: ✅ Activé (orange)
  TTL: Auto
  ```
- [ ] Ajouter record **CNAME** :
  ```
  Type: CNAME
  Name: www
  Target: cname.vercel-dns.com
  Proxy: ✅ Activé (orange)
  TTL: Auto
  ```

#### SSL/TLS
- [ ] Aller dans **SSL/TLS** → **Overview**
- [ ] Mode sélectionné : **Full (strict)**
- [ ] Edge Certificates activés
- [ ] Always Use HTTPS : **On**
- [ ] Automatic HTTPS Rewrites : **On**
- [ ] Minimum TLS Version : **TLS 1.2**

#### Page Rules (3 gratuites)
- [ ] **Rule 1** : Redirection www → non-www
  ```
  Pattern: www.healthincloud.app/*
  Setting: Forwarding URL (301)
  Target: https://healthincloud.app/$1
  ```
- [ ] **Rule 2** : Cache agressif pour assets
  ```
  Pattern: healthincloud.app/_next/static/*
  Settings:
    - Cache Level: Cache Everything
    - Edge Cache TTL: 1 month
    - Browser Cache TTL: 1 year
  ```
- [ ] **Rule 3** : Bypass cache pour API
  ```
  Pattern: healthincloud.app/api/*
  Setting: Cache Level: Bypass
  ```

#### Sécurité
- [ ] **Firewall** → **Settings** → Bot Fight Mode : **On**
- [ ] **Security** → **Settings** → Security Level : **Medium**
- [ ] **Scrape Shield** → Email Obfuscation : **On**
- [ ] **Speed** → **Optimization** → Auto Minify : HTML, CSS, JS **On**
- [ ] **Speed** → **Optimization** → Brotli : **On**

---

### 4. Configuration Domaine dans Vercel

#### Ajout du Domaine
- [ ] Aller dans Vercel Dashboard → **Settings** → **Domains**
- [ ] Cliquer "Add" et entrer `healthincloud.app`
- [ ] Ajouter également `www.healthincloud.app`
- [ ] Configurer `www` pour rediriger vers `healthincloud.app`

#### Vérification DNS
- [ ] Vercel détecte automatiquement la config DNS
- [ ] Status "Valid Configuration" affiché
- [ ] Certificat SSL généré automatiquement
- [ ] Attendre 5-10 minutes pour propagation

---

### 5. Déploiement Initial

#### Lancer le Déploiement
- [ ] Dans Vercel Dashboard, cliquer **"Deploy"**
- [ ] Ou pusher sur `main` → déploiement automatique
- [ ] Surveiller les logs de build en temps réel

#### Vérifier Build
- [ ] Build complété sans erreur
- [ ] Aucune erreur TypeScript
- [ ] Aucune erreur ESLint
- [ ] Aucun warning critique
- [ ] Build time < 5 minutes (idéalement)

#### Appliquer Migrations DB
- [ ] Aller dans Vercel → **Deployments** → deployment actif
- [ ] Ou connecter en SSH si self-hosted
- [ ] Exécuter :
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Vérifier que toutes les migrations sont appliquées
- [ ] Vérifier les tables dans Neon DB Dashboard

---

## ✅ Après le Déploiement

### 1. Tests Fonctionnels

#### Navigation & Pages
- [ ] Accéder à `https://healthincloud.app`
- [ ] Landing page s'affiche correctement
- [ ] Tester navigation Header (logo, liens)
- [ ] Tester page `/merci`
- [ ] Tester redirection `www.healthincloud.app` → `healthincloud.app`

#### Authentication
- [ ] Page `/auth/login` accessible
- [ ] Formulaire de connexion email/password fonctionne
- [ ] Connexion Google OAuth fonctionne (si activée)
- [ ] Connexion Apple Sign In fonctionne (si activée)
- [ ] Redirection post-login vers dashboard fonctionne
- [ ] Déconnexion fonctionne

#### Pages Protégées
- [ ] Accès `/dashboard` nécessite authentification
- [ ] Accès `/exercices-neuro` nécessite authentification
- [ ] Accès `/exercices-ortho` nécessite authentification
- [ ] Accès `/profil` nécessite authentification
- [ ] Redirection vers `/auth/login` si non authentifié

#### Internationalisation (i18n)
- [ ] Sélecteur de langue fonctionne (FR/EN)
- [ ] Traductions françaises s'affichent correctement
- [ ] Traductions anglaises s'affichent correctement
- [ ] URLs avec locale fonctionnent (`/fr/...`, `/en/...`)

---

### 2. Tests Techniques

#### Performance
- [ ] Tester sur [PageSpeed Insights](https://pagespeed.web.dev/)
  - [ ] Score Performance > 90
  - [ ] Score Accessibility > 90
  - [ ] Score Best Practices > 90
  - [ ] Score SEO > 90
- [ ] Tester sur [WebPageTest](https://www.webpagetest.org/)
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Tester vitesse de chargement mobile (4G simulé)

#### SEO
- [ ] Balise `<title>` présente sur toutes les pages
- [ ] Balises `<meta description>` présentes
- [ ] Open Graph tags présents (og:title, og:description, og:image)
- [ ] `robots.txt` accessible (`/robots.txt`)
- [ ] `sitemap.xml` accessible (`/sitemap.xml`)
- [ ] Canonical URLs configurées

#### Images & Assets
- [ ] Images optimisées (WebP/AVIF)
- [ ] Images responsive (`srcset`, `sizes`)
- [ ] Fonts chargés correctement (Inter, etc.)
- [ ] Icônes Lucide s'affichent
- [ ] Favicon visible dans l'onglet navigateur

#### SSL/TLS
- [ ] `https://` fonctionne
- [ ] Certificat SSL valide
- [ ] Aucun warning de sécurité navigateur
- [ ] Mixed content détecté et corrigé (si applicable)
- [ ] Tester sur [SSL Labs](https://www.ssllabs.com/ssltest/)
  - [ ] Grade A ou A+

---

### 3. Tests Base de Données

#### Connexion
- [ ] Application se connecte à Neon DB sans erreur
- [ ] Requêtes Prisma fonctionnent
- [ ] Pas de timeout de connexion

#### CRUD Operations
- [ ] Créer un utilisateur via signup → OK
- [ ] Lire les données utilisateur → OK
- [ ] Mettre à jour profil utilisateur → OK
- [ ] Supprimer un utilisateur (si fonctionnalité existe) → OK

#### Vérification Neon Dashboard
- [ ] Connexions actives visibles dans Neon
- [ ] Pas de connexions bloquées/idle
- [ ] Monitoring CPU/RAM normal

---

### 4. Tests Monitoring (Sentry)

#### Configuration
- [ ] Aller sur [Sentry Dashboard](https://sentry.io)
- [ ] Vérifier que le projet reçoit des events
- [ ] Vérifier que les source maps sont uploadées

#### Tester Error Tracking
- [ ] Déclencher une erreur volontaire (ex: `throw new Error("Test Sentry")`)
- [ ] Vérifier que l'erreur apparaît dans Sentry
- [ ] Vérifier que le stack trace est lisible (source maps OK)
- [ ] Vérifier les breadcrumbs (contexte utilisateur)

#### Performance Monitoring
- [ ] Aller dans **Performance** dans Sentry
- [ ] Vérifier que les transactions sont capturées
- [ ] Vérifier les métriques de performance (LCP, FID, etc.)

---

### 5. Tests Cloudflare

#### Analytics
- [ ] Aller dans **Cloudflare Dashboard** → **Analytics**
- [ ] Vérifier que le trafic est détecté
- [ ] Vérifier les requêtes cachées vs non-cachées

#### Cache
- [ ] Tester `/` → Headers doivent montrer `CF-Cache-Status: HIT` après 2e visite
- [ ] Tester `/_next/static/...` → `CF-Cache-Status: HIT`
- [ ] Tester `/api/...` → `CF-Cache-Status: BYPASS`

#### Sécurité
- [ ] Vérifier dans **Security** → **Events** → Aucune attaque détectée (ou bloquée si test)
- [ ] Tester WAF (si configuré) avec une requête malveillante simulée

---

### 6. Tests Responsive & Navigateurs

#### Devices
- [ ] Desktop (Chrome, Firefox, Safari, Edge)
- [ ] Tablet (iPad, Android)
- [ ] Mobile (iPhone, Android)

#### Breakpoints
- [ ] Mobile (320px - 640px) → Layout adapté
- [ ] Tablet (640px - 1024px) → Layout adapté
- [ ] Desktop (1024px+) → Layout adapté

#### Navigateurs
- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)
- [ ] Safari iOS (si app mobile-first)

---

### 7. Tests Accessibilité (WCAG 2.1 AA)

#### Tests Automatiques
- [ ] Tester avec [WAVE](https://wave.webaim.org/)
- [ ] Tester avec [axe DevTools](https://www.deque.com/axe/)
- [ ] Tester avec Lighthouse Accessibility Audit (score > 90)

#### Tests Manuels
- [ ] Navigation au clavier (Tab, Enter, Esc)
  - [ ] Tous les liens accessibles
  - [ ] Tous les boutons accessibles
  - [ ] Tous les formulaires utilisables
  - [ ] Focus visible et logique
- [ ] Screen Reader (VoiceOver, NVDA, JAWS)
  - [ ] Navigation logique
  - [ ] Labels et ARIA correctement lus
  - [ ] Annonces importantes (erreurs, succès)

#### Contraste
- [ ] Vérifier contraste texte/background > 4.5:1
- [ ] Vérifier contraste éléments UI > 3:1
- [ ] Tester en mode sombre (si applicable)

---

## 🎯 Vérifications Finales

### Checklist Globale

#### URLs & Domaine
- [ ] `https://healthincloud.app` → OK
- [ ] `https://www.healthincloud.app` → Redirige vers `healthincloud.app`
- [ ] `http://healthincloud.app` → Redirige vers `https://healthincloud.app`
- [ ] `http://www.healthincloud.app` → Redirige vers `https://healthincloud.app`

#### Environnements
- [ ] Production déployé sur `healthincloud.app`
- [ ] Preview deployments fonctionnent (branches feature)
- [ ] Environnement local fonctionne (`npm run dev`)

#### Sécurité
- [ ] Aucune clé API exposée dans le code
- [ ] Aucun secret dans Git
- [ ] Headers de sécurité configurés (CSP, X-Frame-Options, etc.)
- [ ] HTTPS forcé partout
- [ ] Cookies sécurisés (httpOnly, secure, sameSite)

#### Performance
- [ ] Lighthouse Performance > 90
- [ ] Core Web Vitals "Vert" sur tous les métriques
- [ ] Images optimisées
- [ ] Fonts optimisés
- [ ] Bundle JS < 200KB (gzip)

#### Monitoring
- [ ] Sentry configuré et actif
- [ ] Erreurs tracées correctement
- [ ] Performance monitoring actif
- [ ] Alertes configurées (si applicable)

---

## 📊 Monitoring & Maintenance

### 1. Monitoring Quotidien (Première Semaine)

#### Vercel Dashboard
- [ ] Vérifier les déploiements
- [ ] Vérifier les logs d'erreurs
- [ ] Vérifier les métriques de performance
- [ ] Vérifier l'utilisation des ressources

#### Sentry
- [ ] Vérifier les nouvelles erreurs
- [ ] Vérifier les erreurs récurrentes
- [ ] Trier et résoudre les issues critiques
- [ ] Vérifier les métriques de performance

#### Cloudflare Analytics
- [ ] Vérifier le trafic
- [ ] Vérifier les requêtes bloquées (sécurité)
- [ ] Vérifier le cache hit rate
- [ ] Vérifier la bande passante

#### Neon DB
- [ ] Vérifier l'utilisation du storage
- [ ] Vérifier le nombre de connexions
- [ ] Vérifier les slow queries (si applicable)
- [ ] Vérifier les métriques CPU/RAM

---

### 2. Monitoring Hebdomadaire

#### Performance
- [ ] Exécuter Lighthouse sur toutes les pages principales
- [ ] Vérifier Core Web Vitals dans Search Console
- [ ] Analyser les pages les plus lentes
- [ ] Optimiser si nécessaire

#### Sécurité
- [ ] Vérifier les dépendances obsolètes (`npm outdated`)
- [ ] Vérifier les vulnérabilités (`npm audit`)
- [ ] Mettre à jour les dépendances critiques
- [ ] Vérifier les tentatives d'attaque dans Cloudflare

#### Base de Données
- [ ] Vérifier la croissance du storage
- [ ] Analyser les requêtes lentes
- [ ] Optimiser les index si nécessaire
- [ ] Nettoyer les données obsolètes (si applicable)

---

### 3. Maintenance Mensuelle

#### Mises à Jour
- [ ] Mettre à jour Next.js (version mineure)
- [ ] Mettre à jour React (version mineure)
- [ ] Mettre à jour les dépendances (patch versions)
- [ ] Tester après chaque mise à jour
- [ ] Déployer les mises à jour

#### Backups
- [ ] Vérifier les backups Neon DB automatiques
- [ ] Tester la restauration d'un backup (1x/mois)
- [ ] Exporter un snapshot manuel (optionnel)

#### Analytics
- [ ] Analyser Google Analytics (si configuré)
- [ ] Analyser Vercel Analytics
- [ ] Analyser Cloudflare Analytics
- [ ] Identifier les tendances et optimisations

#### Documentation
- [ ] Mettre à jour `CHANGELOG.md`
- [ ] Mettre à jour la documentation technique si changements
- [ ] Documenter les incidents et résolutions

---

## 🆘 Troubleshooting

### Problèmes Courants

#### 1. Erreur 500 sur une page
**Causes possibles** :
- Variable d'environnement manquante
- Erreur de connexion DB
- Erreur dans le code (check Sentry)

**Solutions** :
1. Vérifier les logs Vercel
2. Vérifier Sentry pour le stack trace
3. Vérifier que toutes les variables d'environnement sont présentes
4. Tester en local avec les mêmes variables

---

#### 2. Page blanche / Build failed
**Causes possibles** :
- Erreur TypeScript
- Erreur ESLint
- Dépendance manquante

**Solutions** :
1. Lire les logs de build Vercel
2. Reproduire en local : `npm run build`
3. Corriger les erreurs
4. Re-déployer

---

#### 3. DB Connection Failed
**Causes possibles** :
- `DATABASE_URL` incorrect
- Firewall Neon bloque Vercel
- Compute Neon en sleep mode

**Solutions** :
1. Vérifier `DATABASE_URL` dans Vercel
2. Vérifier que Neon compute est actif
3. Tester connexion avec Prisma Studio
4. Contacter support Neon si persistant

---

#### 4. Auth ne fonctionne pas
**Causes possibles** :
- Redirect URI incorrect
- Client ID/Secret incorrect
- `BETTER_AUTH_SECRET` manquant

**Solutions** :
1. Vérifier redirect URI dans Google/Apple Console
2. Vérifier que `BETTER_AUTH_SECRET` est défini
3. Vérifier logs Sentry pour erreurs auth
4. Tester en local avec les mêmes credentials

---

#### 5. Images ne s'affichent pas
**Causes possibles** :
- Domaine non autorisé dans `next.config.ts`
- Images non optimisées
- CSP bloque les images

**Solutions** :
1. Vérifier `images.domains` dans `next.config.ts`
2. Vérifier Content-Security-Policy headers
3. Vérifier que les images existent
4. Tester avec une image locale

---

#### 6. DNS ne pointe pas
**Causes possibles** :
- Propagation DNS en cours (24-48h)
- Records DNS incorrects
- Nameservers non mis à jour

**Solutions** :
1. Attendre propagation (dig healthincloud.app)
2. Vérifier records A et CNAME dans Cloudflare
3. Vérifier nameservers chez le registrar
4. Utiliser [DNS Checker](https://dnschecker.org/)

---

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre application **MPR In Cloud** est déployée avec succès sur `healthincloud.app` ! 🚀

### Ressources Utiles

- 📊 [Vercel Dashboard](https://vercel.com/dashboard)
- 🐘 [Neon Console](https://console.neon.tech)
- ☁️ [Cloudflare Dashboard](https://dash.cloudflare.com)
- 🐛 [Sentry Dashboard](https://sentry.io)
- 📈 [PageSpeed Insights](https://pagespeed.web.dev/)
- 🔍 [Search Console](https://search.google.com/search-console)

### Support

- **Vercel** : [vercel.com/support](https://vercel.com/support)
- **Neon** : [neon.tech/docs](https://neon.tech/docs)
- **Cloudflare** : [community.cloudflare.com](https://community.cloudflare.com)
- **Sentry** : [docs.sentry.io](https://docs.sentry.io)

---

**Bon déploiement !** 🎊

