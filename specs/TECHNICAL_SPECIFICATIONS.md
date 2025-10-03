# 📋 Spécifications Techniques - MPR In Cloud

**Projet** : MPR In Cloud (Health Ortho)  
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

---

## 🎯 Vue d'Ensemble

### Description
MPR In Cloud est une plateforme de rééducation orthophonique et neuropsychologique développée pour le service MPR de Nantes. L'application propose des exercices interactifs pour la rééducation cognitive et vocale.

### Objectifs
- ✅ Interface sombre mobile-first
- ✅ Conformité WCAG 2.1 AA
- ✅ Support multilingue (FR prioritaire, EN disponible)
- ✅ Progressive Web App (PWA)
- ✅ Performance optimale (score 90+)
- ✅ Expérience utilisateur inspirée d'iOS

### Utilisateurs Cibles
- Patients en rééducation
- Professionnels de santé (orthophonistes, neuropsychologues)
- Personnel médical du service MPR

---

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

| Service | Plan | Usage |
|---------|------|-------|
| **Vercel** | Hobby/Pro | Hosting Next.js & déploiement |
| **Cloudflare** | Free/Pro | CDN, DNS, Sécurité, Cache |
| **Neon DB** | Free/Scale | PostgreSQL serverless |

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

### Tarification Neon DB

#### Plan Gratuit (Free Tier)
- ✅ **3 GB Storage**
- ✅ **191 heures compute/mois** (suffisant pour projets en développement)
- ✅ **3 branches max**
- ✅ **Point-in-time recovery** (7 jours)
- ✅ **Parfait pour démarrer** et MVP

#### Plan Scale ($19/mois)
- ✅ **10 GB Storage inclus** (puis $3.50/GB supplémentaire)
- ✅ **Compute illimité**
- ✅ **Branches illimitées**
- ✅ **Point-in-time recovery** (30 jours)
- ✅ **Recommandé pour production**

> **Note** : Le plan gratuit est largement suffisant pour le développement et les premiers utilisateurs. Vous pouvez upgrader quand nécessaire.

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

### Score Performance
- **Avant** : 72/100
- **Objectif** : 90+/100

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

### Framework de Test

#### Tests Unitaires (Vitest)
```bash
npm test                # Mode watch
npm run test:run        # Une fois
npm run test:coverage   # Avec coverage
```

**Configuration** : `vitest.config.mts`
```typescript
{
  environment: "jsdom",
  include: ["src/__tests__/**/*.test.{ts,tsx}"],
  plugins: [react()],
}
```

#### Tests E2E (Playwright)
```bash
npm run test:e2e         # Tous navigateurs
npm run test:e2e:ui      # Interface UI
npm run test:e2e:debug   # Mode debug
npm run test:e2e:report  # Rapport HTML
```

**Navigateurs** : Chromium, Firefox, Mobile Chrome

### Exemples de Tests

#### Test Utils
```typescript
// src/__tests__/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("should merge classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
```

#### Test Component
```typescript
// src/__tests__/components/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render button", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

#### Test E2E
```typescript
// e2e/homepage.spec.ts
import { test, expect } from "@playwright/test";

test("should load homepage", async ({ page }) => {
  await page.goto("/fr");
  await expect(page).toHaveTitle(/MPR In Cloud/);
});
```

### Objectifs Coverage

| Type | Cible |
|------|-------|
| **Statements** | 80%+ |
| **Branches** | 75%+ |
| **Functions** | 80%+ |
| **Lines** | 80%+ |

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

##### 🆓 Plan Hobby (Gratuit)

**Parfait pour démarrer le projet !**

| Fonctionnalité | Limite | Suffisant pour ? |
|----------------|---------|------------------|
| **Déploiements** | ♾️ Illimité | ✅ Oui |
| **Preview Deployments** | ♾️ Illimité | ✅ Oui |
| **Bande passante** | 100 GB/mois | ✅ Oui (< 10k visiteurs/mois) |
| **Build Time** | 6,000 minutes/mois | ✅ Oui |
| **Projets** | ♾️ Illimité | ✅ Oui |
| **Domaine personnalisé** | ✅ Inclus | ✅ Oui |
| **SSL automatique** | ✅ Inclus | ✅ Oui |
| **Edge Functions** | 100,000 invocations/jour | ✅ Oui |
| **Serverless Functions** | 100 GB-hours/mois | ✅ Oui |
| **Image Optimization** | 1,000 images/mois | ⚠️ Limité |
| **Logs** | 1 jour de rétention | ⚠️ Limité |
| **Membres d'équipe** | 1 seul utilisateur | ⚠️ Solo |

**Idéal pour** :
- ✅ Développement & MVP
- ✅ Projets personnels
- ✅ Beta privée (< 100 utilisateurs)
- ✅ Validation du produit
- ✅ Applications avec trafic modéré

##### 💎 Plan Pro (20 $/mois)

**Pour passer en production avec une équipe**

| Fonctionnalité | Limite | Différence vs Hobby |
|----------------|---------|---------------------|
| **Bande passante** | 1 TB/mois | 10x plus |
| **Build Time** | 24,000 minutes/mois | 4x plus |
| **Image Optimization** | 5,000 images/mois | 5x plus |
| **Logs** | 3 jours de rétention | 3x plus |
| **Membres d'équipe** | ♾️ Illimité | 🎯 Collaboration |
| **Protection par mot de passe** | ✅ Inclus | 🎯 Nouveau |
| **Analytics avancés** | ✅ Inclus | 🎯 Nouveau |
| **Support prioritaire** | ✅ Inclus | 🎯 Nouveau |
| **DDoS Protection** | ✅ Avancée | 🎯 Meilleure |

**Passer au Pro quand** :
- ⚠️ > 10,000 visiteurs/mois
- ⚠️ > 80 GB de bande passante utilisée
- ⚠️ Besoin de plusieurs développeurs
- ⚠️ Logs et monitoring nécessaires (> 1 jour)
- ⚠️ Protection de previews par mot de passe

#### Avantages Vercel

- ✅ **Intégration Next.js native** : Créé par la même équipe
- ✅ **Edge Network global** : CDN ultra-rapide dans 70+ villes
- ✅ **Preview Deployments** : URL unique pour chaque branche Git
- ✅ **Zero-config** : Détection automatique du framework
- ✅ **Analytics intégré** : Web Vitals & métriques
- ✅ **Integration Neon** : Setup DB en 1 clic
- ✅ **Environment Variables** : UI simple pour secrets
- ✅ **Automatic HTTPS** : SSL gratuit et automatique
- ✅ **Git Integration** : GitHub, GitLab, Bitbucket

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

##### Plan Recommandé

**Phase MVP → Production** : **Free Plan** (0 €/mois)

| Fonctionnalité | Free Plan | Pro Plan (19 €/mois) |
|----------------|-----------|----------------------|
| **DNS** | ✅ Illimité | ✅ Illimité |
| **Bande passante** | ✅ Illimitée | ✅ Illimitée |
| **CDN** | ✅ Global | ✅ Global |
| **SSL/TLS** | ✅ Gratuit | ✅ Gratuit |
| **Protection DDoS** | ✅ Gratuite | ✅ Avancée |
| **Analytics** | 24h | 30 jours |
| **WAF** | Basique | ✅ Avancé |
| **Page Rules** | 3 | 20 |

**Recommandation** : Free Plan suffit pour démarrer !

##### DNS Records pour Vercel

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
Pattern: www.mprincloud.com/*
Action: Forwarding URL (301)
Target: https://mprincloud.com/$1
```

**Rule 2** : Cache agressif pour assets statiques
```
Pattern: mprincloud.com/_next/static/*
Actions:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 year
```

**Rule 3** : Bypass cache pour API
```
Pattern: mprincloud.com/api/*
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

##### 3. **Économies**
- **Bande passante** : Illimitée sur Cloudflare (vs limitée sur Vercel)
- **Requêtes** : Moins de hits sur Vercel = facture réduite
- **Images** : Cache = moins d'optimisations Vercel

##### 4. **Monitoring**
- **Analytics temps réel** : Trafic, pays, devices
- **Logs** : Toutes les requêtes tracées
- **Alertes** : Notification si attaque détectée

#### Quand Activer Cloudflare ?

✅ **Dès que vous avez un domaine personnalisé** (`mprincloud.com`)
- Configuration : 10 minutes
- Coût : 0 € (Free Plan)
- Impact : Performance +50%, sécurité renforcée

⏳ **Pas urgent** si vous utilisez `health-ortho.vercel.app`

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
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"

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

## 🔌 MCP (Model Context Protocol)

### MCP Disponibles dans Cursor

Les **Model Context Protocol (MCP)** permettent à l'IA d'interagir directement avec des services externes pour améliorer la productivité du développement.

#### MCP Installés

##### 1. **Context7**
- **Usage** : Documentation des bibliothèques en temps réel
- **Fonctionnalités** :
  - Recherche de documentation Next.js, React, Prisma, etc.
  - Exemples de code à jour
  - Résolution automatique des IDs de librairie
- **Commandes** :
  - `resolve-library-id` : Trouver l'ID d'une librairie
  - `get-library-docs` : Récupérer la documentation

##### 2. **Sentry**
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

##### 3. **Playwright**
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

##### 4. **Linear**
- **Usage** : Gestion de projet et tâches
- **Fonctionnalités** :
  - Lister et créer des issues
  - Gérer les projets et équipes
  - Suivre les cycles de développement
  - Gérer les labels et statuts
  - Créer des commentaires
- **Commandes principales** :
  - `list_issues` : Lister les issues
  - `create_issue` : Créer une nouvelle issue
  - `update_issue` : Mettre à jour une issue
  - `get_issue` : Détails d'une issue
  - `list_projects` : Lister les projets

##### 5. **Shadcn**
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

##### 6. **Prisma** ✅ Nouvellement installé
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
- **Utilité pour ce projet** : ⭐⭐⭐⭐⭐ (Excellent choix !)

#### MCP Recommandés à Installer

##### 7. **GitHub** ✅ Déjà disponible
- **Usage** : Intégration GitHub
- **Fonctionnalités** :
  - Créer et gérer des Pull Requests
  - Lire et commenter des issues
  - Consulter l'historique des commits
  - Gérer les branches
- **Utilité pour ce projet** : ⭐⭐⭐⭐⭐ (Essentiel)

##### 8. **Vercel** (À installer si disponible)
- **Usage** : Déploiement et monitoring
- **Fonctionnalités potentielles** :
  - Consulter les déploiements
  - Voir les logs en temps réel
  - Gérer les variables d'environnement
  - Consulter les métriques analytics
- **Utilité pour ce projet** : ⭐⭐⭐⭐⭐ (Très utile)
- **Status** : ⚠️ À vérifier disponibilité

##### 9. **Neon** (À installer si disponible)
- **Usage** : Gestion base de données
- **Fonctionnalités potentielles** :
  - Gérer les branches de DB
  - Consulter les métriques de performance
  - Voir l'usage compute/storage
  - Gérer les connexions
- **Utilité pour ce projet** : ⭐⭐⭐⭐ (Utile)
- **Status** : ⚠️ À vérifier disponibilité

##### 10. **Cloudflare** (Recommandé pour le domaine personnalisé)
- **Usage** : CDN, DNS, sécurité, performance
- **Fonctionnalités** :
  - Gérer les DNS records (A, CNAME, etc.)
  - Consulter les analytics en temps réel
  - Configurer le WAF (Web Application Firewall)
  - Gérer le cache et les Page Rules
  - Monitoring du trafic
  - Protection DDoS
  - Configuration SSL/TLS
- **Commandes potentielles** :
  - Gestion des DNS records
  - Configuration du cache
  - Analytics et métriques
  - Gestion de la sécurité
- **Utilité pour ce projet** : ⭐⭐⭐⭐⭐ (Très recommandé avec domaine personnalisé)
- **Quand l'utiliser** : Dès que vous configurez `mprincloud.com`

**Avantages pour MPR In Cloud** :
- ✅ **Performance** : CDN global, latence réduite pour patients en France
- ✅ **Sécurité** : Protection DDoS + WAF pour données médicales
- ✅ **DNS** : Le plus rapide du monde (1.1.1.1)
- ✅ **Cache** : Assets statiques ultra-rapides
- ✅ **Gratuit** : Plan Free largement suffisant (bande passante illimitée)

##### 11. **Chrome DevTools** (Très recommandé pour dev)
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
- **Utilité pour ce projet** : ⭐⭐⭐⭐⭐ (Excellent pour objectifs performance & a11y)

**Pourquoi essentiel pour MPR In Cloud** :
- ✅ **Performance 90+** : Objectif du projet → analyse détaillée nécessaire
- ✅ **WCAG 2.1 AA** : Tests d'accessibilité automatisés
- ✅ **PWA** : Debugging Service Workers et cache
- ✅ **Mobile-first** : Tests responsive multi-devices
- ✅ **Debugging avancé** : CSS complexes, animations
- ✅ **Complémentarité** : Parfait avec Playwright MCP (E2E + Debugging)

**Complémentarité avec Playwright** :
```
Playwright MCP    → Tests fonctionnels (ça marche ?)
Chrome DevTools   → Debugging & Optimisation (pourquoi/comment ?)
```

#### Autres MCP Utiles (À Considérer)

##### 12. **NPM/Package Manager** (Si disponible)
- **Usage** : Gestion des dépendances
- **Fonctionnalités potentielles** :
  - Rechercher des packages
  - Vérifier les versions
  - Consulter la documentation npm
  - Détecter les vulnérabilités
- **Utilité pour ce projet** : ⭐⭐⭐⭐ (Très utile)

##### 13. **Slack** (Optionnel)
- **Usage** : Notifications d'équipe
- **Fonctionnalités potentielles** :
  - Envoyer des notifications
  - Intégrer avec CI/CD
  - Alertes d'erreurs Sentry
- **Utilité pour ce projet** : ⭐⭐ (Optionnel, pour équipe)

##### 14. **Figma** (Optionnel)
- **Usage** : Accès aux designs
- **Fonctionnalités potentielles** :
  - Consulter les maquettes
  - Exporter les assets
  - Récupérer les styles (couleurs, fonts)
- **Utilité pour ce projet** : ⭐⭐ (Utile si designs Figma existent)

##### 15. **Google Cloud/Workspace** (Optionnel)
- **Usage** : Services Google
- **Fonctionnalités potentielles** :
  - Gérer OAuth2 (déjà configuré)
  - Accéder à Google Drive
  - Analytics
- **Utilité pour ce projet** : ⭐⭐ (Optionnel, OAuth déjà configuré manuellement)

### Configuration des MCP

Les MCP sont configurés dans le fichier `.cursor/config.json` ou dans les paramètres Cursor.

#### Vérifier les MCP Installés

Dans Cursor :
1. Ouvrir les paramètres (⌘ + ,)
2. Rechercher "MCP" ou "Model Context Protocol"
3. Voir la liste des MCP disponibles et installés

#### Activer un Nouveau MCP

1. Dans Cursor, ouvrir le panneau MCP
2. Rechercher le MCP souhaité
3. Cliquer sur "Install" ou "Enable"
4. Redémarrer Cursor si nécessaire

### Priorités d'Installation MCP

#### Priorité 1 : Essentiels (Déjà installés ✅)
- ✅ Context7 : Documentation en temps réel
- ✅ Sentry : Error tracking
- ✅ Playwright : Tests E2E
- ✅ Linear : Gestion de projet
- ✅ Shadcn : Composants UI
- ✅ Prisma : ORM et migrations 🎉 **Nouvellement installé !**
- ✅ GitHub : Gestion du code

#### Priorité 2 : Très Recommandés
- ⚠️ **Chrome DevTools** : Debugging & Performance (excellent pour objectifs projet)
- ⚠️ **Vercel** : Déploiement et monitoring (à installer si disponible)
- ⚠️ **Neon** : Gestion DB (à installer si disponible)
- ⚠️ **Cloudflare** : CDN/DNS/Sécurité (recommandé avec domaine personnalisé)
- ⚠️ **NPM** : Gestion dépendances (à installer si disponible)

#### Priorité 3 : Optionnels
- 🔵 Slack : Notifications équipe (si équipe collaborative)
- 🔵 Figma : Designs (si maquettes Figma existent)

### Utilisation des MCP dans le Workflow

#### Exemple : Debugging avec Sentry MCP

```
1. Détection d'une erreur dans l'app
2. AI utilise Sentry MCP → search_issues("database connection error")
3. AI analyse les issues retournées
4. AI utilise get_issue_details(issue_id) pour plus de contexte
5. AI propose une solution basée sur les stack traces
6. AI peut update_issue() pour marquer comme résolu
```

#### Exemple : Déploiement avec Vercel MCP

```
1. Code prêt pour déploiement
2. AI utilise Vercel MCP → list_deployments()
3. AI vérifie le dernier déploiement
4. AI consulte les logs si erreurs
5. AI suggère des optimisations basées sur les métriques
```

#### Exemple : Ajout de Composant avec Shadcn MCP

```
1. Besoin d'un composant Dialog
2. AI utilise Shadcn MCP → search_items("dialog")
3. AI récupère get_item_examples("dialog-demo")
4. AI fournit get_add_command("@shadcn/dialog")
5. AI génère le code d'intégration
```

#### Exemple : Gestion DB avec Prisma MCP

```
1. Modification du schéma Prisma nécessaire
2. AI utilise Prisma MCP → explore schema
3. AI identifie les relations existantes
4. AI suggère les modifications optimales
5. AI génère la migration appropriée
6. AI fournit les commandes de migration
```

#### Exemple : Configuration DNS avec Cloudflare MCP

```
1. Besoin de configurer le domaine mprincloud.com
2. AI utilise Cloudflare MCP → list_dns_records()
3. AI vérifie la configuration actuelle
4. AI suggère les records DNS optimaux pour Vercel
5. AI peut créer/mettre à jour les records
6. AI configure le cache et les Page Rules
7. AI active la protection DDoS et le WAF
```

#### Exemple : Debugging CSS avec Chrome DevTools MCP

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
7. AI vérifie avec screenshot avant/après
```

#### Exemple : Optimisation Performance avec Chrome DevTools MCP

```
Scénario : Page dashboard lente à charger

1. AI utilise Chrome DevTools MCP → Performance tab
2. AI enregistre le chargement de /dashboard
3. AI analyse les métriques Core Web Vitals :
   - LCP: 4.2s (❌ trop lent, objectif < 2.5s)
   - FID: 85ms (✅ bon)
   - CLS: 0.05 (✅ bon)
4. AI identifie : Large image non optimisée (2.5MB)
5. AI suggère :
   - Convertir en AVIF/WebP
   - Ajouter priority loading
   - Lazy load pour images en-dessous du fold
6. AI vérifie après optimisation : LCP = 1.8s ✅
```

#### Exemple : Audit Accessibilité avec Chrome DevTools MCP

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

### Workflow Complet de Développement avec MCP

#### Phase 1 : Développement

```
1. Code Feature
   ├─ Context7 MCP → Documentation Next.js/React
   ├─ Shadcn MCP → Ajouter composants UI
   └─ Prisma MCP → Modifications schéma DB

2. Tests Locaux
   ├─ Chrome DevTools MCP → Debugging CSS/JS
   ├─ Chrome DevTools MCP → Tests responsive
   └─ Playwright MCP → Tests E2E basiques

3. Code Review
   └─ GitHub MCP → Créer PR avec contexte
```

#### Phase 2 : Tests & Optimisation

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

#### Phase 3 : Déploiement

```
1. Pre-deploy
   ├─ Linear MCP → Créer issue déploiement
   └─ Vercel MCP → Vérifier preview deployment

2. Deploy
   ├─ GitHub MCP → Merge PR
   ├─ Vercel MCP → Deploy automatique
   └─ Cloudflare MCP → Vérifier DNS/Cache

3. Post-deploy
   ├─ Chrome DevTools MCP → Tests smoke production
   ├─ Sentry MCP → Vérifier absence d'erreurs
   └─ Linear MCP → Fermer issue
```

#### Phase 4 : Monitoring Production

```
1. Monitoring Continu
   ├─ Sentry MCP → Tracking erreurs temps réel
   └─ Vercel MCP → Analytics & métriques

2. Debugging Production
   ├─ Sentry MCP → Identifier issue
   ├─ Chrome DevTools MCP → Reproduire localement
   ├─ Chrome DevTools MCP → Debugger
   └─ GitHub MCP → Fix PR

3. Support Utilisateurs
   ├─ Linear MCP → Créer ticket depuis feedback
   ├─ Chrome DevTools MCP → Investiguer bug rapporté
   └─ Linear MCP → Update statut ticket
```

### Matrice de Décision : Quel MCP Utiliser ?

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
| **Code review** | GitHub | PRs, comments, merge |
| **Gestion projet** | Linear | Issues, roadmap, cycles |

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

### Score Actuel : 8/10 ⭐

| Catégorie | Score | Status |
|-----------|-------|--------|
| Architecture | 9/10 | ✅ Excellent |
| TypeScript | 10/10 | ✅ Parfait |
| Performance | 9/10 | ✅ Optimisé |
| Sécurité | 9/10 | ✅ Très sécurisé |
| i18n | 10/10 | ✅ Parfait |
| SEO | 10/10 | ✅ Parfait |
| Accessibilité | 9/10 | ✅ Excellent |
| Tests | 7/10 | ⚠️ En cours |
| Documentation | 8/10 | ✅ Complet |
| Error Handling | 8/10 | ✅ Implémenté |

### Priorités Immédiates (Sprint 1-2)

#### 🔴 Priorité HAUTE
1. **UI/UX Essentiels** :
   - [ ] Implémenter Footer
   - [ ] Améliorer header mobile
   - [ ] Optimiser landing page

2. **Tests** :
   - [ ] Atteindre 50% coverage
   - [ ] Tests critiques : auth, navigation, composants UI
   - [ ] Tests E2E des parcours principaux

3. **Production Ready** :
   - [ ] Configurer Sentry production
   - [ ] Setup monitoring & alertes
   - [x] Base de données production (Neon DB configuré)

4. **Fonctionnalités Core** :
   - [ ] Finaliser exercices Neuro
   - [ ] Finaliser exercices Ortho
   - [ ] Système de suivi des progrès

#### 🟡 Priorité MOYENNE (Sprint 3-4)

4. **Analytics** :
   - [ ] Intégrer analytics (Vercel Analytics ou Plausible)
   - [ ] Tracking événements clés
   - [ ] Dashboard métriques

5. **Optimisations Avancées** :
   - [ ] Service Worker PWA
   - [ ] Offline support
   - [ ] Bundle analyzer optimizations

6. **Features Additionnelles** :
   - [ ] Export des résultats (PDF)
   - [ ] Partage de résultats
   - [ ] Interface administration

#### 🟢 Priorité BASSE (Sprint 5+)

7. **Nice to Have** :
   - [ ] Storybook pour composants
   - [ ] Lighthouse CI
   - [ ] A/B testing infrastructure
   - [ ] Multi-tenancy support

### Pages & Composants Principaux

#### Pages Publiques (Route Group: `(site)/`)

##### Landing Page (`/`)
- **Description** : Page d'accueil publique de l'application
- **Statut** : ✅ Implémentée
- **Caractéristiques** :
  - Hero section avec titre et CTA
  - Présentation des fonctionnalités
  - Design moderne et accessible
  - Responsive mobile-first
  - Support i18n (FR/EN)
  - SEO optimisé (metadata dynamiques)
- **Route** : `src/app/[locale]/(site)/page.tsx`

##### Page Merci (`/merci`)
- **Description** : Page de remerciement statique
- **Statut** : ✅ Implémentée
- **Caractéristiques** :
  - Message de remerciement
  - Non protégée (accessible sans auth)
  - Support i18n (FR/EN)
- **Route** : `src/app/[locale]/(site)/merci/page.tsx`

#### Composants de Navigation

##### Header (`SiteHeader`)
- **Description** : En-tête global de l'application
- **Statut** : ✅ Implémenté
- **Emplacement** : `src/components/navigation/site-header.tsx`
- **Caractéristiques** :
  - Logo / Titre de l'application
  - Navigation principale
  - Switcher de langue (FR/EN)
  - Menu utilisateur (si authentifié)
  - Bouton de connexion (si non authentifié)
  - Responsive avec menu mobile
  - Sticky header (optionnel)
  - Support dark mode
- **Composants enfants** :
  - `UserMenu` : Menu déroulant utilisateur
  - `SignOutButton` : Bouton de déconnexion
  - Language switcher

##### Footer
- **Description** : Pied de page global
- **Statut** : ⚠️ À implémenter
- **Emplacement prévu** : `src/components/navigation/site-footer.tsx`
- **Caractéristiques prévues** :
  - Liens utiles (mentions légales, CGU, contact)
  - Informations MPR Nantes
  - Copyright
  - Liens réseaux sociaux (optionnel)
  - Support i18n

#### Pages d'Authentification (Route Group: `(auth)/`)

##### Page Login (`/auth/login`)
- **Description** : Page de connexion
- **Statut** : ✅ Implémentée
- **Caractéristiques** :
  - Formulaire email/password
  - Validation côté client et serveur
  - Messages d'erreur i18n
  - Redirection après connexion
  - Support Google OAuth (optionnel)
  - Support Apple Sign In (optionnel)
- **Composants** :
  - `LoginForm` : Formulaire de connexion
- **Route** : `src/app/[locale]/(auth)/auth/login/page.tsx`

#### Pages Protégées (Route Group: `(app)/`)

##### Dashboard (`/dashboard`)
- **Description** : Tableau de bord utilisateur
- **Statut** : ⚠️ En cours
- **Accès** : Protégé (authentification requise)
- **Route** : `src/app/[locale]/(app)/dashboard/page.tsx`

##### Exercices Neuro (`/neuro`)
- **Description** : Exercices neuropsychologiques
- **Statut** : ⚠️ En cours
- **Accès** : Protégé
- **Route** : `src/app/[locale]/(app)/neuro/page.tsx`

##### Exercices Ortho (`/ortho`)
- **Description** : Exercices orthophoniques
- **Statut** : ⚠️ En cours
- **Accès** : Protégé
- **Route** : `src/app/[locale]/(app)/ortho/page.tsx`

##### Profil Utilisateur (`/profil`)
- **Description** : Page de profil et paramètres
- **Statut** : ⚠️ En cours
- **Accès** : Protégé
- **Caractéristiques prévues** :
  - Informations personnelles
  - Préférences utilisateur
  - Statistiques de progression
  - Historique des exercices
- **Route** : `src/app/[locale]/(app)/profil/page.tsx`

### Roadmap Fonctionnel

#### Phase 1 : MVP (Actuelle)
- ✅ Authentification
- ✅ Landing page
- ✅ Header avec navigation
- ✅ Page Merci
- ✅ i18n (FR/EN)
- ⚠️ Footer (à implémenter)
- ⚠️ Exercices de base (en cours)
- ⚠️ Dashboard (en cours)
- ⚠️ Profil utilisateur (en cours)

#### Phase 2 : Core Features
- [ ] Exercices Neuro complets
- [ ] Exercices Ortho complets
- [ ] Système de progression
- [ ] Statistiques utilisateur
- [ ] Export de données

#### Phase 3 : Advanced Features
- [ ] Dashboard professionnel
- [ ] Gestion multi-patients
- [ ] Rapports personnalisés
- [ ] API publique
- [ ] Intégrations tierces

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
- `CONTRIBUTING.md` : Guide contributeurs
- `BEST_PRACTICES_AUDIT.md` : Audit qualité code
- `OPTIMIZATIONS.md` : Détails optimisations
- `TESTING_SETUP.md` : Guide configuration tests
- `PLAYWRIGHT_SETUP.md` : Guide Playwright E2E
- `SENTRY_SETUP.md` : Configuration Sentry
- `LINEAR_SETUP.md` : Intégration Linear
- `NODE_UPGRADE_SUMMARY.md` : Migration Node 20
- `specs/TECHNICAL_SPECIFICATIONS.md` : Spécifications techniques complètes
- `specs/VERCEL_DEPLOYMENT_GUIDE.md` : Guide de déploiement Vercel détaillé
- `specs/INFRASTRUCTURE_COSTS.md` : Feuille de route des coûts d'infrastructure

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

