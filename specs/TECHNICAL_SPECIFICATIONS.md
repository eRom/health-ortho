# 📋 Spécifications Techniques - Health In Cloud

**Projet** : Health In Cloud
**Type** : Application web de rééducation orthophonique et neuropsychologique  
**Version** : 0.1.0  
**Dernière mise à jour** : Octobre 2025

---

## 📖 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Technique](#architecture-technique)
3. [Stack Technologique](#stack-technologique)
4. [Structure du Projet](#structure-du-projet)
5. [Base de Données](#base-de-données)
6. [Authentification](#authentification)
7. [Internationalisation](#internationalisation)
8. [Design System](#design-system)
9. [Performance & Optimisations](#performance--optimisations)
10. [Tests](#tests)
11. [Monitoring & Error Tracking](#monitoring--error-tracking)
12. [Sécurité](#sécurité)
13. [Accessibilité](#accessibilité)
14. [Déploiement](#déploiement)
15. [MCP (Model Context Protocol)](#mcp-model-context-protocol)
16. [Workflows de Développement](#workflows-de-développement)
17. [Priorités & Roadmap](#priorités--roadmap)



## 🏗️ Architecture Technique

### Architecture Globale
```
┌─────────────────────────────────────────┐
│        UTILISATEURS (Patients)          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     Cloudflare (CDN + Sécurité)         │
│  - DNS ultra-rapide                     │
│  - CDN Global (330+ datacenters)        │
│  - Protection DDoS                      │
│  - WAF (Web Application Firewall)       │
│  - Cache intelligent                    │
│  - SSL/TLS automatique                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        Vercel (Next.js Hosting)         │
│  ┌─────────────────────────────────┐   │
│  │   App Router (Route Groups)     │   │
│  │  - (site)   : Pages publiques   │   │
│  │  - (auth)   : Authentification  │   │
│  │  - (app)    : Pages protégées   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │   Components (shadcn/ui)        │   │
│  │  - UI Primitives                │   │
│  │  - Navigation                   │   │
│  │  - Forms                        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│              API Routes                 │
│  - /api/auth/[...betterAuth]           │
│  - /api/sentry-webhook                 │
│  - /api/test-linear                    │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Database (Prisma ORM)           │
│  - Neon DB (PostgreSQL Serverless)      │
│  - Branching & Scale-to-Zero            │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│          Services Externes              │
│  - Sentry (Monitoring)                  │
│  - Linear (Task Management)             │
│  - Google OAuth                         │
│  - Apple Sign In                        │
└─────────────────────────────────────────┘
```

### Principes Architecturaux

#### React Server Components (RSC)
- **Par défaut** : Tous les composants sont des Server Components
- **"use client"** : Uniquement pour l'interactivité (state, events)
- **Avantages** : 
  - Zero bundle JavaScript par défaut
  - Fetch de données au niveau composant
  - Meilleure performance

#### Route Groups Next.js
```
src/app/[locale]/
├── (site)/          # Pages publiques (landing, merci)
├── (auth)/          # Pages d'authentification (login, register)
└── (app)/           # Pages protégées (dashboard, exercices)
```

#### Separation of Concerns
```
src/
├── app/             # Routes & Pages
├── components/      # Composants réutilisables
│   ├── ui/         # Primitives UI (Button, Card, etc.)
│   └── navigation/ # Navigation spécifique
├── lib/            # Logique métier & utils
│   ├── auth/       # Configuration auth
│   ├── i18n/       # Config internationalisation
│   ├── prisma.ts   # Singleton Prisma
│   └── utils.ts    # Helpers (cn, etc.)
└── locales/        # Fichiers de traduction
```

---

## 💻 Stack Technologique

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 15.5.4 | Framework React avec App Router |
| **React** | 19.1.0 | Bibliothèque UI |
| **TypeScript** | 5.x | Type-safety strict |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **shadcn/ui** | Latest | Composants UI primitives |
| **next-intl** | 4.3.9 | Internationalisation |
| **Lucide React** | 0.544.0 | Icônes |

### Backend & Database

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Prisma** | 6.16.3 | ORM type-safe |
| **Neon DB** | Latest | PostgreSQL serverless avec branching |
| **Better Auth** | 1.3.24 | Authentification moderne |

### Testing

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Vitest** | 3.2.4 | Tests unitaires |
| **Testing Library** | 16.3.0 | Tests React |
| **Playwright** | 1.55.1 | Tests E2E |
| **jsdom** | 27.0.0 | DOM simulation |

### Monitoring & Quality

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Sentry** | 10.17.0 | Error tracking & Performance |
| **ESLint** | 9.x | Linting |
| **Linear** | - | Task management (via API) |

### Build & Dev Tools

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Node.js** | 20.19.5 LTS | Runtime |
| **npm** | 10.8.2 | Package manager |
| **nvm** | 0.39.7 | Node version manager |
| **TypeScript** | 5.x | Type checking |

### Infrastructure & CDN

| Service | Usage |
|---------|-------|
| **Vercel** | Hosting Next.js & déploiement |
| **Cloudflare** | CDN, DNS, Sécurité, Cache |
| **Neon DB** | PostgreSQL serverless |

---

## 📁 Structure du Projet

```
health-ortho/
├── e2e/                          # Tests Playwright E2E
│   ├── auth.spec.ts             # Tests authentification
│   ├── homepage.spec.ts         # Tests page d'accueil
│   ├── i18n.spec.ts             # Tests i18n
│   └── navigation.spec.ts       # Tests navigation
│
├── prisma/                       # Configuration Prisma
│   ├── schema.prisma            # Schéma de base de données
│   ├── seed.ts                  # Données de seed
│   └── migrations/              # Migrations DB
│
├── public/                       # Assets statiques
│   ├── manifest.json            # PWA manifest
│   └── *.svg                    # Icônes & images
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/           # Routes i18n
│   │   │   ├── (site)/         # Pages publiques
│   │   │   │   ├── page.tsx    # Landing page
│   │   │   │   └── merci/      # Page de remerciement
│   │   │   ├── (auth)/         # Pages auth
│   │   │   │   └── auth/login/ # Login page & form
│   │   │   ├── (app)/          # Pages protégées
│   │   │   │   ├── dashboard/
│   │   │   │   ├── neuro/      # Exercices neuro
│   │   │   │   ├── ortho/      # Exercices ortho
│   │   │   │   └── profil/     # Profil utilisateur
│   │   │   ├── layout.tsx      # Layout avec i18n
│   │   │   ├── error.tsx       # Error boundary
│   │   │   └── not-found.tsx   # 404 custom
│   │   ├── api/                # API Routes
│   │   │   ├── auth/[...betterAuth]/
│   │   │   ├── sentry-test/
│   │   │   ├── sentry-webhook/
│   │   │   └── test-linear/
│   │   ├── globals.css         # Styles globaux
│   │   ├── layout.tsx          # Root layout
│   │   ├── robots.ts           # Robots.txt dynamique
│   │   └── sitemap.ts          # Sitemap dynamique
│   │
│   ├── components/             # Composants React
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── navigation/        # Navigation components
│   │   │   ├── site-header.tsx      # Header global
│   │   │   ├── site-footer.tsx      # Footer global (à implémenter)
│   │   │   ├── user-menu.tsx        # Menu utilisateur
│   │   │   └── sign-out-button.tsx  # Bouton déconnexion
│   │   └── providers/         # Context providers
│   │       └── sentry-user-provider.tsx
│   │
│   ├── lib/                   # Logique métier
│   │   ├── auth/             # Config auth
│   │   ├── auth.ts           # Better Auth setup
│   │   ├── auth-client.ts    # Client auth
│   │   ├── auth-actions.ts   # Server actions auth
│   │   ├── safe-auth.ts      # Auth helpers sécurisés
│   │   ├── i18n/             # Config i18n
│   │   │   ├── config.ts
│   │   │   └── get-dictionary.ts
│   │   ├── prisma.ts         # Singleton Prisma
│   │   ├── sentry.ts         # Helpers Sentry
│   │   ├── linear.ts         # Helpers Linear
│   │   └── utils.ts          # Utilities (cn, etc.)
│   │
│   ├── locales/              # Traductions
│   │   ├── fr/
│   │   │   └── common.json
│   │   └── en/
│   │       └── common.json
│   │
│   ├── __tests__/            # Tests
│   │   ├── components/
│   │   │   └── Button.test.tsx
│   │   └── utils.test.ts
│   │
│   ├── test/                 # Setup tests
│   │   ├── setup.ts
│   │   └── vitest.d.ts
│   │
│   └── middleware.ts         # Middleware i18n & auth
│
├── legacy-site/              # Site statique historique
│
├── specs/                    # Documentation technique
│   └── TECHNICAL_SPECIFICATIONS.md  # Ce fichier
│
├── .env                      # Variables d'environnement (local)
├── .env.example              # Template variables
├── .nvmrc                    # Version Node.js
├── components.json           # Config shadcn/ui
├── eslint.config.mjs         # Config ESLint
├── instrumentation.ts        # Sentry server
├── instrumentation-client.ts # Sentry client
├── middleware.ts             # Middleware global
├── next.config.ts            # Config Next.js
├── next-intl.config.ts       # Config next-intl
├── package.json              # Dépendances & scripts
├── playwright.config.ts      # Config Playwright
├── postcss.config.mjs        # Config PostCSS
├── tailwind.config.ts        # Config Tailwind (si présent)
├── tsconfig.json             # Config TypeScript
└── vitest.config.mts         # Config Vitest
```

---

## 🗄️ Base de Données

### Neon DB - PostgreSQL Serverless

**Neon DB** est une plateforme PostgreSQL serverless moderne choisie pour ce projet.

#### Avantages
- ✅ **Serverless** : Scale-to-zero automatique, vous ne payez que ce que vous utilisez
- ✅ **Branching** : Créer des branches de DB comme avec Git (parfait pour preview deployments)
- ✅ **Compatible Prisma** : Fonctionne out-of-the-box
- ✅ **Intégration Vercel** : Setup en 1 clic depuis Vercel Dashboard
- ✅ **Performance** : Cold start ultra rapide (~1s)
- ✅ **Backup automatique** : Point-in-time recovery
- ✅ **Plan gratuit** : 3 GB storage, 191 heures compute/mois

#### Configuration Neon DB

**1. Créer un projet Neon**
```bash
# 1. Aller sur https://neon.tech
# 2. Créer un compte (GitHub OAuth recommandé)
# 3. Créer un nouveau projet
# 4. Copier la connection string fournie
```

**2. Schéma Prisma** (`prisma/schema.prisma`)
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Pour migrations (sans pooling)
}

generator client {
  provider = "prisma-client-js"
}
```

### Schéma Prisma

#### Model User
```prisma
model User {
  id            String    @id @default(cuid())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String
  image         String?
  accounts      Account[]
  sessions      Session[]
}
```

#### Model Account
```prisma
model Account {
  id                    String    @id @default(cuid())
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  providerId            String    // "credentials", "google", "apple"
  accountId             String
  userId                String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?   // Hashé avec Better Auth
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@unique([providerId, accountId])
}
```

#### Model Session
```prisma
model Session {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

#### Model Verification
```prisma
model Verification {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  value      String
  expiresAt  DateTime
  identifier String
  
  @@unique([identifier, value])
  @@index([identifier])
}
```

### Variables d'Environnement

```env
# Database URL (depuis Neon Dashboard)
DATABASE_URL="postgres://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require"

# URL directe pour migrations (optionnel, sans pooling)
DIRECT_URL="postgres://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require"
```

### Scripts Database

```bash
# Générer le client Prisma
npm run db:generate

# Créer/appliquer les migrations
npm run db:migrate

# Push le schéma (dev uniquement)
npx prisma db push

# Ouvrir Prisma Studio (UI)
npm run db:studio

# Seeder la base (compte démo)
npm run db:seed
```

### Branching de Base de Données

**Créer une branche pour chaque feature** :

```bash
# Via Neon CLI
npm i -g neonctl
neonctl branches create --name feature-payments

# Ou via l'interface Neon Dashboard
# Dashboard > Branches > Create Branch
```

**Intégration Vercel Preview** :
Neon crée automatiquement une branch DB pour chaque preview deployment :

```
main branch       → Production deployment
feature-branch-1  → Preview deployment 1
feature-branch-2  → Preview deployment 2
```


---

## 🔐 Authentification

### Better Auth Configuration

#### Providers Disponibles
1. **Email/Password** : Auth classique avec hash bcrypt
2. **Google OAuth** : Social login Google
3. **Apple Sign In** : Social login Apple

#### Variables d'Environnement Requises
```env
# Better Auth Secret (32+ caractères)
BETTER_AUTH_SECRET="votre-secret-minimum-32-caracteres"

# URL de l'application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="votre-client-id"
GOOGLE_CLIENT_SECRET="votre-client-secret"

# Apple Sign In (optionnel)
APPLE_CLIENT_ID="votre-apple-client-id"
APPLE_CLIENT_SECRET="votre-apple-client-secret"
```

#### Flow d'Authentification

```typescript
// 1. Configuration Better Auth (src/lib/auth.ts)
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: { ... },
    apple: { ... }
  }
});

// 2. Client auth (src/lib/auth-client.ts)
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// 3. Hook côté client
const { data: session, isPending } = authClient.useSession();

// 4. Middleware protection (middleware.ts)
// Redirige vers /auth/login si non authentifié
```

#### Compte Démo
```bash
npm run db:seed
# Crée : romain.ecarnot@gmail.com / mprnantes
```

#### Protection des Routes

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession();
  
  if (!session && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 🌍 Internationalisation

### Configuration next-intl

#### Locales Supportées
- **FR** : Français (locale par défaut)
- **EN** : Anglais

#### Structure
```
src/locales/
├── fr/
│   └── common.json       # Traductions françaises
└── en/
    └── common.json       # Traductions anglaises
```

#### Format des Traductions
```json
{
  "pages": {
    "home": {
      "title": "Accueil",
      "hero": {
        "title": "Bienvenue sur MPR In Cloud",
        "description": "Plateforme de rééducation..."
      }
    }
  },
  "navigation": {
    "home": "Accueil",
    "neuro": "Exercices Neuro",
    "ortho": "Exercices Ortho"
  }
}
```

#### Usage dans les Composants

**Server Components** :
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('pages.home');
  
  return <h1>{t('title')}</h1>;
}
```

**Client Components** :
```typescript
"use client";
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('navigation');
  
  return <nav>{t('home')}</nav>;
}
```

#### Changement de Langue
```typescript
// Switcher de langue
<Link href={pathname} locale="en">English</Link>
<Link href={pathname} locale="fr">Français</Link>
```

#### Metadata i18n
```typescript
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'fr': '/fr',
        'en': '/en',
      },
    },
  };
}
```

---

## 🎨 Design System

### Tailwind CSS Configuration

#### Variables CSS (globals.css)
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --primary: 222.2 47.4% 11.2%;
    /* ... */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

#### Utility Helper (cn)
```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### shadcn/ui Components

#### Components Disponibles
- **Button** : Variants (default, destructive, outline, ghost, link)
- **Card** : Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Extensibles avec `npx shadcn-ui add [component]`

#### Button Example
```typescript
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">
  Click me
</Button>
```

#### Card Example
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
</Card>
```

### Optimisations React

#### React.memo pour Composants Purs
```typescript
export const Card = React.memo<CardProps>(({ className, ...props }) => {
  return <div className={cn("rounded-lg", className)} {...props} />;
});
Card.displayName = "Card";
```

---

## ⚡ Performance & Optimisations

### Score Performance Cible
- **Score** : 90+/100
- **Architecture optimisée** pour performance maximale

### Optimisations Implémentées

#### 1. Configuration Next.js (next.config.ts)
```typescript
{
  compress: true,                    // Compression gzip/brotli
  poweredByHeader: false,            // Masquer X-Powered-By
  reactStrictMode: true,             // Mode strict React
  experimental: {
    optimizeCss: true,               // Optimisation CSS
  },
  optimizePackageImports: [          // Tree-shaking
    "lucide-react",
    "@radix-ui/react-slot",
    "clsx",
    "tailwind-merge"
  ],
}
```

#### 2. Images
```typescript
images: {
  formats: ['image/avif', 'image/webp'],  // Formats modernes
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

#### 3. Fonts Optimisées
```typescript
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",              // Évite FOIT
  preload: true,                // Précharge prioritaire
  adjustFontFallback: true,     // Ajustement fallback
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif"
  ],
});
```

#### 4. Headers de Performance
```typescript
// Cache-Control pour assets statiques
{
  source: "/images/:all*(svg|jpg|png)",
  headers: [
    {
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable"
    }
  ]
}
```

#### 5. Headers de Sécurité
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy

### Core Web Vitals Cibles

| Métrique | Cible |
|----------|-------|
| **LCP** (Largest Contentful Paint) | < 2.5s |
| **FID** (First Input Delay) | < 100ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 |
| **FCP** (First Contentful Paint) | < 1.8s |
| **TTI** (Time to Interactive) | < 3.8s |

---

## 🧪 Tests

**Le guide complet des tests a été déplacé vers un fichier dédié.**

📋 **Voir** : [`specs/TESTS_GUIDE.md`](TESTS_GUIDE.md) pour :
- Tests unitaires (Vitest)
- Tests E2E (Playwright)
- Tests Performance & Accessibilité (Chrome DevTools)
- Workflow TDD
- Bonnes pratiques et objectifs de coverage

### Résumé

| Framework | Usage | Commande |
|-----------|-------|----------|
| **Vitest** | Tests unitaires | `npm test` |
| **Playwright** | Tests E2E | `npm run test:e2e` |
| **Chrome DevTools** | Performance & A11y | Via MCP |

### Objectifs

- ✅ Coverage : 80%+ (statements, functions, lines)
- ✅ Performance : Score 90+/100
- ✅ Accessibilité : WCAG 2.1 AA
- ✅ Tests avant chaque PR

---

## 📊 Monitoring & Error Tracking

### Sentry Configuration

#### Installation
```bash
npm install @sentry/nextjs
```

#### Variables d'Environnement
```env
NEXT_PUBLIC_SENTRY_DSN="https://[key]@[org].ingest.sentry.io/[project]"
SENTRY_ORG="votre-org-slug"
SENTRY_PROJECT="votre-project-slug"
SENTRY_AUTH_TOKEN="votre-auth-token"
```

#### Configuration

**Client** (`instrumentation-client.ts`) :
```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,           // 10% des transactions
  replaysSessionSampleRate: 0.1,   // 10% des sessions
  replaysOnErrorSampleRate: 1.0,   // 100% si erreur
  environment: process.env.NODE_ENV,
});
```

**Server** (`instrumentation.ts`) :
```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,         // Profiling
  integrations: [
    prismaIntegration(),           // Integration Prisma
  ],
});
```

#### Usage

```typescript
import { captureError, captureMessage, setUserContext } from "@/lib/sentry";

// Capturer une erreur
try {
  await riskyOperation();
} catch (error) {
  captureError(error, {
    tags: { feature: "payment" },
    extra: { userId: "123" },
  });
}

// Capturer un message
captureMessage("Limite atteinte", "warning");

// Définir contexte utilisateur
setUserContext({
  id: user.id,
  email: user.email,
  name: user.name,
});
```

#### Fonctionnalités
- ✅ Error tracking (client & server)
- ✅ Performance monitoring
- ✅ Session Replay (avec masquage automatique)
- ✅ Browser Tracing
- ✅ Profiling serveur
- ✅ Integration Prisma
- ✅ Filtrage données sensibles

---

## 🔒 Sécurité

### Mesures Implémentées

#### 1. Headers de Sécurité
```typescript
// next.config.ts
headers: [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block"
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin"
  }
]
```

#### 2. Authentification Sécurisée
- ✅ Hashing bcrypt pour mots de passe
- ✅ Tokens session sécurisés
- ✅ HTTPS obligatoire en production
- ✅ OAuth2 pour social login

#### 3. Database Security
- ✅ Prisma ORM (prévient SQL injection)
- ✅ Parameterized queries
- ✅ Type-safety automatique

#### 4. Variables d'Environnement
- ✅ `.env*` dans `.gitignore`
- ✅ Pas de secrets hardcodés
- ✅ Validation recommandée (zod)

#### 5. Dépendances
```bash
# Vérifier vulnérabilités
npm audit

# Mettre à jour
npm update

# Nettoyer dépendances inutilisées
npx depcheck
```

---

## ♿ Accessibilité

### Conformité WCAG 2.1 AA

#### Sémantique HTML
```html
✅ <header>, <nav>, <main>, <section>, <footer>
✅ <h1> unique par page
✅ Hiérarchie de headings correcte (h1 → h2 → h3)
```

#### Navigation Accessible
```typescript
✅ Skip to content link
✅ aria-label sur navigation
✅ aria-current pour page active
✅ sr-only pour screen readers
✅ focus-visible:ring pour keyboard navigation
```

#### Contraste
```css
✅ Texte : ratio minimum 4.5:1
✅ UI components : ratio minimum 3:1
✅ Mode sombre respectant les ratios
```

#### Focus Management
```css
✅ focus-visible:ring-2 sur éléments interactifs
✅ Pas de outline: none sans alternative
✅ Ordre de tabulation logique
```

#### Screen Readers
```typescript
✅ Attributs alt sur images
✅ aria-label sur boutons icônes
✅ aria-hidden sur décorations
✅ Annonces live regions si nécessaire
```

---

## 🚀 Déploiement

### Environnements

#### Développement
```bash
npm run dev
# URL: http://localhost:3000
```

#### Build Production
```bash
npm run build
npm run start
# URL: http://localhost:3000
```

### Plateforme de Déploiement : Vercel

**Vercel** est la plateforme officielle et recommandée pour déployer des applications Next.js.

#### Plans Vercel

##### Capacités Vercel

| Fonctionnalité | Disponibilité |
|----------------|---------------|
| **Déploiements** | ✅ Illimité |
| **Preview Deployments** | ✅ Illimité |
| **Bande passante** | ✅ Configurée |
| **Build Time** | ✅ Optimisé |
| **Projets** | ✅ Illimité |
| **Domaine personnalisé** | ✅ Inclus |
| **SSL automatique** | ✅ Inclus |
| **Edge Functions** | ✅ Disponible |
| **Serverless Functions** | ✅ Disponible |
| **Image Optimization** | ✅ Automatique |
| **Logs** | ✅ Configuré |
| **Collaboration** | ✅ Disponible |
| **Protection par mot de passe** | ✅ Disponible |
| **Analytics avancés** | ✅ Intégré |
| **Support** | ✅ Disponible |
| **DDoS Protection** | ✅ Avancée |

#### Déploiement Vercel CLI

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement preview
vercel

# Déploiement production
vercel --prod

# Configuration
vercel env add BETTER_AUTH_SECRET
vercel env add DATABASE_URL
```

#### Déploiement via Git (Recommandé)

1. Push sur GitHub/GitLab
2. Vercel détecte et déploie automatiquement
3. Preview URL générée pour chaque PR
4. Merge vers `main` → Production automatique

**Voir le guide détaillé** : `specs/VERCEL_DEPLOYMENT_GUIDE.md`

### Cloudflare - CDN & Sécurité

**Cloudflare** est utilisé comme couche de CDN, sécurité et DNS devant Vercel.

#### Rôle de Cloudflare

```
Utilisateur → Cloudflare → Vercel → Neon DB
              ↑
          Cache + Sécurité
```

**Cloudflare agit comme** :
1. **DNS** : Résolution ultra-rapide du domaine
2. **CDN** : Cache des assets statiques (images, CSS, JS)
3. **Proxy** : Masque l'IP origin de Vercel
4. **Firewall** : Protection DDoS et WAF
5. **Optimiseur** : Compression, minification, HTTP/3

#### Configuration Cloudflare

##### Configuration DNS pour Vercel

```
# Record A (domaine racine)
Type: A
Name: @
Value: 76.76.21.21
Proxy: ✅ Activé (orange cloud)

# Record CNAME (www)
Type: CNAME
Name: www
Value: cname.vercel-dns.com
Proxy: ✅ Activé
```

##### Settings Optimaux

**SSL/TLS** :
```
Mode: Full (strict)
Always Use HTTPS: ✅ ON
Automatic HTTPS Rewrites: ✅ ON
Minimum TLS Version: 1.2
```

**Speed** :
```
Auto Minify: ✅ JS, CSS, HTML
Brotli: ✅ ON
HTTP/3 (QUIC): ✅ ON
Early Hints: ✅ ON
```

**Caching** :
```
Caching Level: Standard
Browser Cache TTL: 4 hours
Development Mode: OFF (production)
```

**Security** :
```
Security Level: Medium
Bot Fight Mode: ✅ ON
Challenge Passage: 30 minutes
```

##### Page Rules (3 gratuites)

**Rule 1** : Redirection www → non-www
```
Pattern: www.healthincloud.app/*
Action: Forwarding URL (301)
Target: https://healthincloud.app/$1
```

**Rule 2** : Cache agressif pour assets statiques
```
Pattern: healthincloud.app/_next/static/*
Actions:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 year
```

**Rule 3** : Bypass cache pour API
```
Pattern: healthincloud.app/api/*
Action: Cache Level: Bypass
```

#### Avantages pour MPR In Cloud

##### 1. **Performance**
- **Latence réduite** : Edge servers à Paris (~10-20ms vs 150ms)
- **Cache intelligent** : Assets statiques instantanés
- **HTTP/3** : Protocole moderne activé
- **Compression** : Brotli automatique

##### 2. **Sécurité Médicale**
- **Protection DDoS** : Données patients protégées
- **WAF** : Filtre les attaques (SQL injection, XSS)
- **HTTPS forcé** : Chiffrement obligatoire
- **Rate Limiting** : Limite les tentatives de connexion

##### 3. **Monitoring**
- **Analytics temps réel** : Trafic, pays, devices
- **Logs** : Toutes les requêtes tracées
- **Alertes** : Notification si attaque détectée

#### Activation de Cloudflare

✅ **Avec domaine personnalisé** (`healthincloud.app`)
- Configuration rapide (10 minutes)
- Performance optimale (+50%)
- Sécurité renforcée

#### 🐳 Self-Hosted (Alternative)
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Variables d'Environnement Production

```env
# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://healthincloud.app"

# Database (Neon DB)
DATABASE_URL="postgres://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require"
DIRECT_URL="postgres://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require"

# Auth
BETTER_AUTH_SECRET="votre-secret-32-chars-production"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Sentry
NEXT_PUBLIC_SENTRY_DSN="..."
SENTRY_ORG="..."
SENTRY_PROJECT="..."
SENTRY_AUTH_TOKEN="..."

# Linear (optionnel)
LINEAR_API_KEY="..."
```

### Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Build réussi (`npm run build`)
- [ ] Tests passent (`npm run test:run`)
- [ ] Linter OK (`npm run lint`)
- [ ] Sentry configuré
- [ ] Analytics configuré
- [ ] DNS configurés
- [ ] SSL/TLS activé
- [ ] Monitoring actif

---

## 🔄 Workflows de Développement

### Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de dev
npm run build            # Build production
npm run start            # Démarrer en prod
npm run lint             # Linter ESLint
npm run type-check       # Vérification TypeScript

# Database
npm run db:generate      # Générer Prisma Client
npm run db:migrate       # Lancer migrations
npm run db:studio        # Prisma Studio UI
npm run db:seed          # Seeder DB

# Tests
npm test                 # Tests unitaires (watch)
npm run test:run         # Tests unitaires (once)
npm run test:coverage    # Tests avec coverage
npm run test:e2e         # Tests E2E
npm run test:e2e:ui      # Tests E2E UI
```

### Git Workflow

#### Conventional Commits
```bash
feat: add user profile page
fix: correct button alignment in header
docs: update README with new setup steps
style: format code with prettier
refactor: simplify auth logic
test: add tests for Button component
chore: update dependencies
```

#### Branches
```bash
main            # Production
develop         # Développement
feature/xxx     # Nouvelles fonctionnalités
fix/xxx         # Corrections de bugs
hotfix/xxx      # Corrections urgentes
```

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test:run
      - run: npm run build
```

---

## 🎯 Priorités & Roadmap

**La roadmap détaillée du projet a été déplacée vers un fichier dédié.**

📋 **Voir** : [`ROADMAP.md`](../ROADMAP.md) pour le suivi complet de la progression

### Vue d'ensemble

| Score Global | 8/10 ⭐ |
|--------------|---------|

**Phase actuelle** : Phase 1 - MVP (Sprint 1-2)

**Priorités immédiates** :
1. 🔴 Infrastructure Production (Neon DB, Vercel, Cloudflare)
2. 🔴 UI/UX Essentiels (Footer, Header mobile, Landing page)
3. 🔴 Tests Essentiels (Auth, Navigation, E2E)
4. 🔴 Monitoring Production (Sentry, Analytics)

**Prochaines étapes** : Phase 2 - Core Features (Sprint 3-4)
- Exercices Neuro/Ortho complets
- Système de progression
- Dashboard enrichi
- Analytics & Insights

---

## 📝 Notes Importantes

### Best Practices à Suivre

#### React
- ✅ Server Components par défaut
- ✅ "use client" seulement si nécessaire
- ✅ React.memo() pour composants purs coûteux
- ✅ Hooks personnalisés pour logique réutilisable

#### TypeScript
- ✅ Mode strict activé
- ✅ Pas de `any` (sauf cas exceptionnels avec eslint-disable)
- ✅ Interfaces explicites pour props
- ✅ Types explicites sur fonctions publiques

#### CSS / Tailwind
- ✅ Utility-first approach
- ✅ Helper `cn()` pour merger classes
- ✅ Responsive mobile-first
- ✅ Variables CSS pour theming

#### Sécurité
- ✅ Jamais de secrets hardcodés
- ✅ Validation des inputs utilisateur
- ✅ Sanitization des données
- ✅ Headers de sécurité configurés

#### Performance
- ✅ Images optimisées (AVIF/WebP)
- ✅ Fonts preload
- ✅ Code splitting automatique
- ✅ React.memo pour éviter re-renders

---

## 📚 Ressources & Documentation

### Documentation Officielle
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon DB Documentation](https://neon.tech/docs)
- [Neon + Prisma Guide](https://neon.tech/docs/guides/prisma)
- [Neon + Vercel Integration](https://neon.tech/docs/guides/vercel)
- [Better Auth Documentation](https://www.better-auth.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [next-intl Documentation](https://next-intl-docs.vercel.app)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

### Fichiers de Documentation Projet
- `README.md` : Vue d'ensemble
- `QUICK_START.md` : Guide démarrage rapide
- `ROADMAP.md` : 🗺️ Roadmap fonctionnelle et suivi de progression
- `CONTRIBUTING.md` : Guide contributeurs
- `OPTIMIZATIONS.md` : Détails optimisations
- `TESTING_SETUP.md` : Guide configuration tests
- `PLAYWRIGHT_SETUP.md` : Guide Playwright E2E
- `SENTRY_SETUP.md` : Configuration Sentry
- `LINEAR_SETUP.md` : Intégration Linear
- `NODE_UPGRADE_SUMMARY.md` : Migration Node 20
- `specs/PRODUCT_GUIDE.md` : 📱 Guide produit (vision, personas, fonctionnalités, parcours, métriques)
- `specs/BEST_PRACTICES_AUDIT.md` : 🔍 Audit qualité & bonnes pratiques
- `specs/SCORES.md` : 📊 Scores & métriques détaillées (score global 9/10)
- `specs/TECHNICAL_SPECIFICATIONS.md` : Spécifications techniques complètes
- `specs/VERCEL_DEPLOYMENT_GUIDE.md` : Guide de déploiement Vercel détaillé
- `specs/MCP_GUIDE.md` : 🔌 Guide complet des MCP installés et configurés
- `specs/TESTS_GUIDE.md` : 🧪 Guide complet des tests (unitaires, E2E, performance, accessibilité)

---

## 🆘 Support & Contact

### Pour les Développeurs
1. Consulter la documentation ci-dessus
2. Vérifier les issues existantes (si GitHub)
3. Ouvrir une nouvelle issue si nécessaire
4. Consulter `CONTRIBUTING.md` pour le workflow

### Équipe Projet
- **Organisation** : MPR Nantes
- **Projet Linear** : mpr-in-cloud
- **Contact** : romain.ecarnot@gmail.com

---

**Document créé le** : Octobre 2025  
**Dernière mise à jour** : Octobre 2025  
**Version** : 1.0.0  
**Statut** : ✅ Production Ready (après tests complets)

