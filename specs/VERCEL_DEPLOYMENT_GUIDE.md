# 🚀 Guide de Déploiement Vercel - MPR In Cloud

## 📖 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration Initiale](#configuration-initiale)
3. [Déploiement via Git](#déploiement-via-git)
4. [Configuration des Variables d'Environnement](#configuration-des-variables-denvironnement)
5. [Intégration Neon DB](#intégration-neon-db)
6. [Domaine Personnalisé](#domaine-personnalisé)
7. [Optimisations](#optimisations)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte [Vercel](https://vercel.com)
- ✅ Un compte [GitHub](https://github.com), GitLab, ou Bitbucket
- ✅ Le projet health-ortho poussé sur Git
- ✅ Un compte [Neon DB](https://neon.tech)
- ✅ Les variables d'environnement préparées

---

## 🎬 Configuration Initiale

### Étape 1 : Créer un Compte Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur **"Sign Up"**
3. Choisir **"Continue with GitHub"** (recommandé)
4. Autoriser Vercel à accéder à vos repositories

### Étape 2 : Installer Vercel CLI (Optionnel)

```bash
# Installation globale
npm i -g vercel

# Vérification
vercel --version

# Connexion
vercel login
```

---

## 🔗 Déploiement via Git (Méthode Recommandée)

### Méthode Automatique (GitHub)

#### 1. Importer le Projet

1. Dans le dashboard Vercel, cliquer sur **"Add New"** → **"Project"**
2. Sélectionner votre repository GitHub `health-ortho`
3. Vercel détecte automatiquement Next.js
4. Cliquer sur **"Deploy"**

#### 2. Configuration Build

Vercel détecte automatiquement :

```bash
Build Command:    npm run build
Output Directory: .next
Install Command:  npm install
Development:      npm run dev
```

**Pas besoin de modifier** ces paramètres pour Next.js !

#### 3. Configuration Framework

Vercel détecte automatiquement :

```
Framework Preset: Next.js
Node.js Version:  20.x (basé sur .nvmrc)
```

### Workflow Git Automatique

Une fois configuré, Vercel déploie automatiquement :

```
┌─────────────────┬──────────────────────────────┐
│ Branche Git     │ Type de Déploiement          │
├─────────────────┼──────────────────────────────┤
│ main            │ Production                   │
│ feature/*       │ Preview (URL unique)         │
│ Pull Request    │ Preview (commentaire auto)   │
└─────────────────┴──────────────────────────────┘
```

**Exemple de workflow** :

```bash
# 1. Créer une branche feature
git checkout -b feature/new-exercise

# 2. Développer et commit
git add .
git commit -m "feat: add new exercise"

# 3. Push sur GitHub
git push origin feature/new-exercise

# 4. Vercel déploie automatiquement
# → Vous recevez une URL de preview unique
# → Ex: health-ortho-git-feature-new-exercise-username.vercel.app

# 5. Créer une Pull Request sur GitHub
# → Vercel commente la PR avec l'URL de preview

# 6. Merge vers main
# → Vercel déploie automatiquement en production
# → Ex: health-ortho.vercel.app ou healthincloud.app
```

---

## 🔐 Configuration des Variables d'Environnement

### Via l'Interface Vercel

1. Dans le dashboard, aller dans **"Settings"** → **"Environment Variables"**
2. Ajouter les variables suivantes :

#### Variables Essentielles

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `NODE_ENV` | `production` | Production |
| `NEXT_PUBLIC_APP_URL` | Votre URL Vercel | Production + Preview |
| `BETTER_AUTH_SECRET` | Secret 32+ chars | Production + Preview |
| `DATABASE_URL` | Connection string Neon | Production + Preview |

#### Configuration Complète

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://healthincloud.app

# Database (Neon DB)
DATABASE_URL=postgres://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require
DIRECT_URL=postgres://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require

# Auth (générer un secret fort)
BETTER_AUTH_SECRET=votre-secret-production-minimum-32-caracteres

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=votre-google-client-id
GOOGLE_CLIENT_SECRET=votre-google-client-secret

# Sentry (optionnel mais recommandé)
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
SENTRY_ORG=votre-org-slug
SENTRY_PROJECT=votre-project-slug
SENTRY_AUTH_TOKEN=votre-auth-token

# Linear (optionnel)
LINEAR_API_KEY=lin_api_votre-key
```

### Générer BETTER_AUTH_SECRET

```bash
# Via OpenSSL
openssl rand -base64 32

# Via Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Résultat (exemple)
# xK9m2LpQ4rB7wN5vC8zA3sD6fG1hJ0tY
```

### Via Vercel CLI

```bash
# Ajouter une variable
vercel env add BETTER_AUTH_SECRET

# Lister les variables
vercel env ls

# Supprimer une variable
vercel env rm BETTER_AUTH_SECRET
```

### Différents Environnements

Vercel supporte 3 types d'environnements :

1. **Production** : Déploiements depuis `main`
2. **Preview** : Déploiements depuis autres branches
3. **Development** : Variables locales (`.env.local`)

Vous pouvez définir des valeurs différentes par environnement :

```
Variable: DATABASE_URL
├─ Production → neon-prod-branch
├─ Preview    → neon-preview-branch (auto avec Neon integration)
└─ Development → localhost ou neon-dev-branch
```

---

## 🐘 Intégration Neon DB

### Méthode Automatique (Recommandée)

1. Dans Vercel Dashboard → **"Storage"** → **"Connect Store"**
2. Choisir **"Neon"**
3. Cliquer sur **"Connect"**
4. Autoriser Vercel à accéder à Neon
5. Sélectionner votre projet Neon

**Avantages** :
- ✅ Variables `DATABASE_URL` et `DIRECT_URL` configurées automatiquement
- ✅ Branching automatique pour preview deployments
- ✅ Connection pooling configuré

### Méthode Manuelle

1. Créer un projet sur [neon.tech](https://neon.tech)
2. Copier la connection string
3. Ajouter `DATABASE_URL` dans Vercel Environment Variables
4. Ajouter `DIRECT_URL` (même valeur) pour les migrations

### Configuration Prisma pour Neon + Vercel

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Migrations sur Vercel

#### Option 1 : Build Step (Automatique)

Ajouter un script `postinstall` dans `package.json` :

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Vercel exécutera automatiquement après `npm install`.

#### Option 2 : Migrations Manuelles

```bash
# Appliquer les migrations sur la DB de production
npx prisma migrate deploy

# Via Vercel CLI (si connecté à la DB prod)
vercel env pull .env.production.local
npx prisma migrate deploy
```

**⚠️ Important** : Les migrations doivent être appliquées **avant** de déployer le nouveau code si elles sont nécessaires.

---

## 🌐 Domaine Personnalisé

### Ajouter un Domaine

1. Dans Vercel Dashboard → **"Settings"** → **"Domains"**
2. Cliquer sur **"Add"**
3. Entrer votre domaine (ex: `healthincloud.app`)
4. Configurer les DNS

### Configuration DNS

#### Avec Cloudflare (Recommandé)

**Pour domaine racine** (`healthincloud.app`) :

```
Type: A
Name: @
Value: 76.76.21.21
Proxy: Activé (orange)
```

**Pour www** (`www.healthincloud.app`) :

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
Proxy: Activé (orange)
```

#### Sans Cloudflare

Vercel fournit des valeurs DNS spécifiques :

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL/TLS

- ✅ **Automatique** : Vercel génère un certificat SSL via Let's Encrypt
- ✅ **Renouvellement auto** : Pas d'action requise
- ⏱️ **Délai** : 5-10 minutes après configuration DNS

### Redirection www

Configurer dans Vercel :

```
healthincloud.app → Production (primaire)
www.healthincloud.app → Redirect to healthincloud.app
```

Ou via Next.js config :

```typescript
// next.config.ts
async redirects() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.healthincloud.app' }],
      destination: 'https://healthincloud.app/:path*',
      permanent: true,
    },
  ];
}
```

---

## ⚡ Optimisations

### 1. Edge Network

Vercel déploie automatiquement sur son Edge Network :

- 🌍 **70+ emplacements** dans le monde
- ⚡ **Latence minimale** pour chaque utilisateur
- 🚀 **Cache intelligent** au plus près des utilisateurs

**Aucune configuration requise** !

### 2. Image Optimization

Next.js Image Optimization est activé automatiquement sur Vercel :

```typescript
// Automatiquement optimisé
<Image 
  src="/hero.png" 
  alt="Hero" 
  width={800} 
  height={600}
  priority
/>
```

Formats automatiques :
- ✅ AVIF (si supporté)
- ✅ WebP (fallback)
- ✅ Responsive sizes

### 3. Analytics

#### Vercel Analytics (Recommandé pour Hobby)

```bash
npm i @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Fonctionnalités** :
- ✅ Page views
- ✅ Core Web Vitals
- ✅ Top pages
- ✅ Top referrers

### 4. Speed Insights

```bash
npm i @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 5. Caching Strategy

Configurer les headers de cache dans `next.config.ts` :

```typescript
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/:path*.{jpg,jpeg,png,svg,webp,avif}',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

---

## 🔍 Monitoring & Debugging

### Vercel Logs

1. Dashboard → **"Deployments"**
2. Sélectionner un déploiement
3. Onglet **"Functions"** pour les logs serverless
4. Onglet **"Build Logs"** pour les logs de build

**Rétention** :
- Hobby : 1 jour
- Pro : 3 jours

### Real-time Function Logs

```bash
# Via CLI
vercel logs [deployment-url]

# Suivre en temps réel
vercel logs --follow
```

### Sentry Integration

Pour des logs plus détaillés (recommandé) :

```typescript
// Déjà configuré dans le projet
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  // Sentry capture toutes les erreurs automatiquement
});
```

---

## 🐛 Troubleshooting

### Problèmes Courants

#### 1. Build Failed

**Erreur** : `Build failed`

**Solutions** :
```bash
# Tester le build localement
npm run build

# Vérifier les erreurs TypeScript
npm run type-check

# Vérifier le linter
npm run lint

# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run build
```

#### 2. Environment Variables Non Disponibles

**Erreur** : `process.env.X is undefined`

**Solutions** :
1. Vérifier que la variable est ajoutée dans Vercel Dashboard
2. Vérifier l'environnement (Production/Preview)
3. Redéployer après ajout de variable
4. Pour variables client, utiliser `NEXT_PUBLIC_` prefix

```typescript
// ✅ Accessible côté client
const url = process.env.NEXT_PUBLIC_APP_URL;

// ❌ Uniquement serveur
const secret = process.env.BETTER_AUTH_SECRET;
```

#### 3. Database Connection Failed

**Erreur** : `Can't reach database server`

**Solutions** :
```bash
# 1. Vérifier la connection string
echo $DATABASE_URL

# 2. Tester localement
npx prisma db push

# 3. Vérifier que Neon DB est accessible
# 4. Vérifier que DATABASE_URL et DIRECT_URL sont configurés
```

#### 4. Image Optimization Error

**Erreur** : `Image Optimization Limit Reached`

**Solutions** :
- Optimiser les images avant upload (AVIF/WebP)
- Utiliser `unoptimized: true` pour certaines images si nécessaire
- Vérifier la configuration d'optimisation

#### 5. Function Timeout

**Erreur** : `Function execution timed out`

**Solutions** :
- Optimiser les requêtes lentes (indexation DB, caching)
- Utiliser des Background Jobs pour tâches longues
- Vérifier les timeouts configurés

### Debugging Build

#### Activer Verbose Logging

```bash
# .env
DEBUG=true
NEXT_TELEMETRY_DISABLED=0
```

#### Tester en Local "Simulé Production"

```bash
# Build production
npm run build

# Démarrer en mode production
npm run start

# Tester sur http://localhost:3000
```

### Vérifier la Configuration

```bash
# Via CLI
vercel inspect [deployment-url]

# Voir les environment variables
vercel env ls

# Voir les domains
vercel domains ls

# Voir les projets
vercel projects ls
```

---

## ✅ Checklist de Déploiement

### Avant le Premier Déploiement

- [ ] ✅ Code poussé sur GitHub
- [ ] ✅ `.env.local` dans `.gitignore`
- [ ] ✅ Compte Vercel créé
- [ ] ✅ Compte Neon DB créé
- [ ] ✅ `npm run build` fonctionne localement
- [ ] ✅ Tests passent (`npm run test:run`)

### Configuration Vercel

- [ ] ✅ Projet importé dans Vercel
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ Neon DB intégré
- [ ] ✅ Premier déploiement réussi

### Post-Déploiement

- [ ] ✅ Vérifier que l'app fonctionne
- [ ] ✅ Tester l'authentification
- [ ] ✅ Vérifier les logs (Vercel + Sentry)
- [ ] ✅ Tester sur mobile
- [ ] ✅ Vérifier Core Web Vitals
- [ ] ✅ Configurer domaine personnalisé (optionnel)
- [ ] ✅ Configurer Analytics (optionnel)

### Monitoring Continu

- [ ] ✅ Configurer Sentry alerts
- [ ] ✅ Monitorer Web Vitals
- [ ] ✅ Surveiller usage (bande passante, build minutes)
- [ ] ✅ Vérifier les erreurs quotidiennement

---

## 📚 Ressources

### Documentation Officielle
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Support
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Status Page](https://www.vercel-status.com)
- [Vercel Support](https://vercel.com/support)

---

## 🎉 Félicitations !

Votre application MPR In Cloud est maintenant déployée sur Vercel ! 🚀

**URLs à retenir** :
- 🌐 Production : `https://healthincloud.app`
- 📊 Dashboard : [vercel.com/dashboard](https://vercel.com/dashboard)
- 🐘 Neon DB : [console.neon.tech](https://console.neon.tech)

**Prochaines étapes** :
1. Configurer monitoring (Sentry)
2. Ajouter Analytics
3. Optimiser Core Web Vitals
4. Partager avec les premiers utilisateurs !

---

**Document créé** : Octobre 2025  
**Version** : 1.0.0

