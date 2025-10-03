# 🧪 Guide des Tests - Health In Cloud

**Projet** : Health In Cloud  
**Type** : Guide complet des tests unitaires, E2E, performance et accessibilité  
**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2025

---

## 📖 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Tests Unitaires (Vitest)](#tests-unitaires-vitest)
3. [Tests E2E (Playwright)](#tests-e2e-playwright)
4. [Tests Performance & Accessibilité (Chrome DevTools)](#tests-performance--accessibilité-chrome-devtools)
5. [Workflow TDD](#workflow-tdd)
6. [Bonnes Pratiques](#bonnes-pratiques)
7. [Objectifs de Coverage](#objectifs-de-coverage)

---

## 🎯 Vue d'Ensemble

### Stratégie de Test

Health In Cloud adopte une stratégie de test complète et multi-niveaux pour garantir la qualité et la fiabilité de l'application :

```
┌─────────────────────────────────────────────┐
│           Tests Pyramide                    │
├─────────────────────────────────────────────┤
│                                             │
│        E2E (Playwright)                     │  ← Parcours utilisateur complets
│           ▲                                 │
│      ┌────┴────┐                            │
│      │         │                            │
│   Integration  │                            │  ← Tests d'intégration
│      │         │                            │
│  ┌───┴─────────┴───┐                        │
│  │                 │                        │
│  │    Unitaires    │                        │  ← Tests unitaires (Vitest)
│  │    (Vitest)     │                        │
│  └─────────────────┘                        │
│                                             │
│  Performance & A11y (Chrome DevTools)       │  ← Tests transversaux
│                                             │
└─────────────────────────────────────────────┘
```

### Outils de Test

| Outil | Usage | Couverture |
|-------|-------|------------|
| **Vitest** | Tests unitaires & composants | Fonctions, utils, composants React |
| **Playwright** | Tests E2E navigateur | Parcours utilisateur, navigation, formulaires |
| **Chrome DevTools** | Performance & Accessibilité | Core Web Vitals, WCAG 2.1 AA, Lighthouse |
| **Testing Library** | Tests React | Interactions utilisateur, DOM queries |

### Objectifs Qualité

- ✅ **Coverage** : 80%+ pour statements, fonctions, lignes
- ✅ **Performance** : Score Lighthouse 90+/100
- ✅ **Accessibilité** : Conformité WCAG 2.1 AA
- ✅ **E2E** : Parcours critiques couverts (auth, navigation)
- ✅ **Régression** : Tests automatisés sur chaque PR

---

## 🧪 Tests Unitaires (Vitest)

### Configuration

**Fichier** : `vitest.config.mts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Scripts Disponibles

```bash
# Mode watch (recommandé en développement)
npm test

# Exécution unique
npm run test:run

# Avec coverage
npm run test:coverage

# Mode UI (interface graphique)
npm run test:ui
```

### Structure des Tests

```
src/
├── __tests__/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   ├── Card.test.tsx
│   │   └── SiteHeader.test.tsx
│   ├── lib/
│   │   ├── utils.test.ts
│   │   └── auth.test.ts
│   └── hooks/
│       └── useTranslations.test.ts
└── test/
    ├── setup.ts          # Configuration globale
    └── vitest.d.ts       # Types TypeScript
```

### Exemples de Tests

#### Test Utility Function

```typescript
// src/__tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn()', () => {
  it('should merge classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle conditional classes', () => {
    expect(cn('text-base', false && 'text-lg')).toBe('text-base');
  });

  it('should filter falsy values', () => {
    expect(cn('text-base', null, undefined, false, 'font-bold')).toBe('text-base font-bold');
  });
});
```

#### Test React Component

```typescript
// src/__tests__/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

#### Test avec Mock

```typescript
// src/__tests__/lib/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signIn, signOut } from '@/lib/auth-client';

// Mock du client auth
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in with credentials', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ success: true });
    vi.mocked(signIn).mockImplementation(mockSignIn);

    const result = await signIn({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });
});
```

### Bonnes Pratiques Vitest

#### ✅ À Faire

- **Utiliser `describe` pour grouper** : Organiser les tests par fonctionnalité
- **Tests isolés** : Chaque test doit être indépendant
- **Mock les dépendances externes** : API, localStorage, etc.
- **Tester les cas limites** : Valeurs nulles, tableaux vides, erreurs
- **Nommer clairement** : `it('should do X when Y')` plutôt que `it('test 1')`

#### ❌ À Éviter

- Tests dépendants de l'ordre d'exécution
- Tests avec des délais arbitraires (`setTimeout`)
- Tests qui modifient l'état global
- Trop de mocks (signe d'un code trop couplé)

---

## 🎭 Tests E2E (Playwright)

### Configuration

**Fichier** : `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Scripts Disponibles

```bash
# Tous les tests E2E
npm run test:e2e

# Mode UI (recommandé)
npm run test:e2e:ui

# Mode debug
npm run test:e2e:debug

# Rapport HTML
npm run test:e2e:report

# Tests spécifiques
npx playwright test auth.spec.ts
```

### Structure des Tests E2E

```
e2e/
├── auth.spec.ts           # Tests authentification
├── homepage.spec.ts       # Tests page d'accueil
├── navigation.spec.ts     # Tests navigation
├── i18n.spec.ts          # Tests internationalisation
├── dashboard.spec.ts      # Tests dashboard (à créer)
└── exercises.spec.ts      # Tests exercices (à créer)
```

### Exemples de Tests E2E

#### Test Navigation Simple

```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('should load homepage in French', async ({ page }) => {
  await page.goto('/fr');
  await expect(page).toHaveTitle(/MPR In Cloud/);
  await expect(page.locator('h1')).toContainText('Bienvenue');
});

test('should navigate to exercises pages', async ({ page }) => {
  await page.goto('/fr');
  
  // Cliquer sur "Exercices Neuro"
  await page.click('text=Exercices Neuro');
  await expect(page).toHaveURL(/\/neuro/);
  
  // Revenir et cliquer sur "Exercices Ortho"
  await page.goto('/fr');
  await page.click('text=Exercices Ortho');
  await expect(page).toHaveURL(/\/ortho/);
});
```

#### Test Authentification

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/fr/auth/login');
    
    // Remplir le formulaire
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Vérifier redirection vers dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Bienvenue')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/fr/auth/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Vérifier message d'erreur
    await expect(page.locator('text=Identifiants invalides')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login d'abord
    await page.goto('/fr/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Logout
    await page.click('button[aria-label="User menu"]');
    await page.click('text=Se déconnecter');
    
    // Vérifier redirection vers login
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
```

#### Test Internationalisation

```typescript
// e2e/i18n.spec.ts
import { test, expect } from '@playwright/test';

test('should switch language from French to English', async ({ page }) => {
  await page.goto('/fr');
  
  // Vérifier texte en français
  await expect(page.locator('h1')).toContainText('Bienvenue');
  
  // Changer la langue
  await page.click('button[aria-label="Language switcher"]');
  await page.click('text=English');
  
  // Vérifier URL et texte en anglais
  await expect(page).toHaveURL(/\/en/);
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

#### Test Formulaire Complexe

```typescript
// e2e/exercises.spec.ts
import { test, expect } from '@playwright/test';

test('should complete neuro exercise', async ({ page }) => {
  // Login requis
  await page.goto('/fr/auth/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Aller à l'exercice
  await page.goto('/fr/neuro/empans');
  
  // Démarrer l'exercice
  await page.click('button:has-text("Démarrer")');
  
  // Simuler réponses
  await page.fill('input[name="answer"]', '42');
  await page.click('button:has-text("Valider")');
  
  // Vérifier résultat
  await expect(page.locator('text=Correct')).toBeVisible();
  
  // Vérifier sauvegarde progression
  await page.goto('/fr/dashboard');
  await expect(page.locator('text=Exercice empans complété')).toBeVisible();
});
```

### Bonnes Pratiques Playwright

#### ✅ À Faire

- **Utiliser des sélecteurs sémantiques** : `text=`, `role=`, `aria-label`
- **Attendre les éléments** : `await expect().toBeVisible()` plutôt que `waitForTimeout()`
- **Tests isolés** : Chaque test doit pouvoir tourner seul
- **Screenshots en cas d'échec** : Activé par défaut
- **Tests critiques d'abord** : Auth, navigation, parcours principaux

#### ❌ À Éviter

- Sélecteurs CSS fragiles (`.class-name-generated-12345`)
- `waitForTimeout()` (flaky tests)
- Tests dépendants entre eux
- Trop de tests E2E (lents et coûteux)

---

## 🔍 Tests Performance & Accessibilité (Chrome DevTools)

### Chrome DevTools via MCP

Le MCP Chrome DevTools permet de réaliser des audits automatisés de performance et d'accessibilité directement depuis Cursor.

### Tests Performance

#### Objectifs Core Web Vitals

| Métrique | Cible | Excellent | Bon | À Améliorer |
|----------|-------|-----------|-----|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 2.5s | 2.5-4s | > 4s |
| **FID** (First Input Delay) | < 100ms | < 100ms | 100-300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.1 | 0.1-0.25 | > 0.25 |
| **FCP** (First Contentful Paint) | < 1.8s | < 1.8s | 1.8-3s | > 3s |
| **TTI** (Time to Interactive) | < 3.8s | < 3.8s | 3.8-7.3s | > 7.3s |

#### Exemple d'Audit Performance

```
Scénario : Analyser la performance de la page dashboard

1. AI utilise Chrome DevTools MCP → Performance tab
2. AI enregistre le chargement de /dashboard
3. AI analyse les métriques :
   - LCP: 1.8s ✅ (excellent)
   - FID: 85ms ✅ (excellent)
   - CLS: 0.05 ✅ (excellent)
   - FCP: 1.2s ✅ (excellent)
   - TTI: 3.5s ✅ (excellent)
4. AI identifie les optimisations possibles :
   - Image non optimisée : 500KB → Convertir en AVIF
   - JavaScript non utilisé : 150KB → Code splitting
   - Font non préchargée → Ajouter preload
5. AI génère les recommandations spécifiques
```

#### Script Lighthouse

```bash
# Installation
npm install -g lighthouse

# Audit complet
lighthouse https://healthincloud.app --output html --output-path ./report.html

# Audit performance uniquement
lighthouse https://healthincloud.app --only-categories=performance

# Audit accessibilité uniquement
lighthouse https://healthincloud.app --only-categories=accessibility

# Mobile
lighthouse https://healthincloud.app --preset=mobile
```

### Tests Accessibilité

#### Objectifs WCAG 2.1 AA

- ✅ **Contraste** : Ratio minimum 4.5:1 pour texte normal
- ✅ **Navigation clavier** : Tous les éléments interactifs accessibles
- ✅ **ARIA** : Labels et rôles corrects
- ✅ **Sémantique HTML** : Utilisation correcte des balises
- ✅ **Screen readers** : Contenu lisible et compréhensible

#### Exemple d'Audit Accessibilité

```
Scénario : Vérifier conformité WCAG 2.1 AA de la landing page

1. AI utilise Chrome DevTools MCP → Lighthouse → Accessibility
2. AI lance l'audit
3. AI détecte les problèmes :
   - ❌ Contraste insuffisant : color #999 sur #fff (3.2:1 vs 4.5:1 requis)
   - ❌ Boutons sans aria-label
   - ❌ Images décoratives avec alt non vide
   - ✅ Hiérarchie headings correcte
   - ✅ Navigation clavier fonctionnelle
4. AI propose les corrections :
   - Changer color: #999 → #666 (ratio 4.8:1)
   - Ajouter aria-label="Menu principal" sur <nav>
   - Ajouter alt="" sur images décoratives
5. AI re-vérifie après corrections : Score 98/100 ✅
```

#### Checklist Accessibilité Manuelle

```typescript
// Tests à effectuer manuellement

// 1. Navigation clavier
- Tab through all interactive elements
- Enter/Space activate buttons and links
- Escape closes modals and dropdowns
- Arrow keys navigate in menus

// 2. Screen reader
- Read all text content
- Announce interactive elements correctly
- Announce state changes (loading, error, success)
- Announce dynamic content updates

// 3. Zoom
- Page remains functional at 200% zoom
- No horizontal scrolling
- Text remains readable

// 4. Color contrast
- Text vs background >= 4.5:1 (normal text)
- Text vs background >= 3:1 (large text 18pt+)
- UI components vs background >= 3:1
```

---

## 🔄 Workflow TDD (Test-Driven Development)

### Principe

**Test-Driven Development** : Écrire les tests **avant** le code de production.

```
┌─────────────────────────────────────┐
│   Cycle TDD (Red-Green-Refactor)   │
├─────────────────────────────────────┤
│                                     │
│  1. 🔴 RED                          │
│     Écrire un test qui échoue      │
│            ↓                        │
│  2. 🟢 GREEN                        │
│     Écrire le code minimum          │
│     pour passer le test             │
│            ↓                        │
│  3. 🔵 REFACTOR                     │
│     Améliorer le code               │
│     (tests toujours verts)          │
│            ↓                        │
│     Répéter ↻                       │
│                                     │
└─────────────────────────────────────┘
```

### Exemple Pratique

#### 1. 🔴 RED : Écrire le test (qui échoue)

```typescript
// src/__tests__/lib/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/lib/formatDate';

describe('formatDate', () => {
  it('should format date to DD/MM/YYYY', () => {
    const date = new Date('2025-10-03T12:00:00Z');
    expect(formatDate(date)).toBe('03/10/2025');
  });
});

// ❌ Test échoue : formatDate n'existe pas encore
```

#### 2. 🟢 GREEN : Écrire le code minimum

```typescript
// src/lib/formatDate.ts
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// ✅ Test passe
```

#### 3. 🔵 REFACTOR : Améliorer le code

```typescript
// src/lib/formatDate.ts
export function formatDate(date: Date, locale: string = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// ✅ Tests passent toujours + code plus robuste
```

### Workflow pour Nouvelle Fonctionnalité

#### Étape 1 : Définir le comportement attendu

```typescript
// Avant d'écrire le code, définir ce qu'on veut :

// Feature : Système de progression pour exercices
// User Story : "En tant qu'utilisateur, je veux voir ma progression"

// Comportement attendu :
// 1. Calculer le pourcentage de progression
// 2. Afficher visuellement (progress bar)
// 3. Sauvegarder en base de données
// 4. Afficher l'historique
```

#### Étape 2 : Écrire les tests

```typescript
// src/__tests__/lib/progress.test.ts
describe('calculateProgress', () => {
  it('should return 0% when no exercises completed', () => {
    expect(calculateProgress(0, 10)).toBe(0);
  });

  it('should return 100% when all exercises completed', () => {
    expect(calculateProgress(10, 10)).toBe(100);
  });

  it('should return 50% when half exercises completed', () => {
    expect(calculateProgress(5, 10)).toBe(50);
  });
});

// e2e/progress.spec.ts
test('should display progress bar on dashboard', async ({ page }) => {
  await page.goto('/fr/dashboard');
  
  const progressBar = page.locator('[role="progressbar"]');
  await expect(progressBar).toBeVisible();
  await expect(progressBar).toHaveAttribute('aria-valuenow', '50');
});
```

#### Étape 3 : Implémenter le code

```typescript
// src/lib/progress.ts
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// src/components/ProgressBar.tsx
export function ProgressBar({ value }: { value: number }) {
  return (
    <div 
      role="progressbar" 
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="w-full bg-gray-200 rounded-full h-2"
    >
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
```

#### Étape 4 : Vérifier les tests

```bash
# Tests unitaires
npm test

# Tests E2E
npm run test:e2e

# Tests accessibilité
npm run test:e2e -- --project=accessibility

# Coverage
npm run test:coverage
```

---

## ✅ Bonnes Pratiques

### Règles d'Or

#### 1. **Test Automatique Systématique**
- ✅ Écrire des tests pour chaque nouvelle fonctionnalité
- ✅ Ajouter des tests pour chaque bug corrigé
- ✅ Maintenir les tests à jour avec le code

#### 2. **Tests Lisibles et Maintenables**
```typescript
// ❌ Mauvais
it('test 1', () => {
  expect(fn(1, 2)).toBe(3);
});

// ✅ Bon
it('should add two numbers correctly', () => {
  expect(add(1, 2)).toBe(3);
});
```

#### 3. **Tests Indépendants**
```typescript
// ❌ Mauvais : Tests dépendants
let userId: string;

it('should create user', () => {
  userId = createUser();
});

it('should find user', () => {
  expect(findUser(userId)).toBeTruthy(); // Dépend du test précédent
});

// ✅ Bon : Tests isolés
it('should create user', () => {
  const userId = createUser();
  expect(userId).toBeTruthy();
});

it('should find user', () => {
  const userId = createUser();
  expect(findUser(userId)).toBeTruthy();
});
```

#### 4. **Arrange-Act-Assert (AAA)**
```typescript
it('should filter active users', () => {
  // Arrange : Préparer les données
  const users = [
    { name: 'Alice', active: true },
    { name: 'Bob', active: false },
  ];

  // Act : Exécuter l'action
  const result = filterActiveUsers(users);

  // Assert : Vérifier le résultat
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Alice');
});
```

#### 5. **Coverage N'est Pas Tout**
- ✅ Viser 80%+ de coverage
- ❌ Ne pas sacrifier la qualité pour le coverage
- ✅ Tester les cas limites et erreurs
- ✅ Tester les parcours utilisateur critiques

### Workflow Git avec Tests

```bash
# 1. Créer une branche
git checkout -b feature/progress-bar

# 2. Écrire les tests (TDD)
# ... écrire les tests ...

# 3. Vérifier que les tests échouent
npm test

# 4. Implémenter le code
# ... écrire le code ...

# 5. Vérifier que les tests passent
npm test

# 6. Vérifier le coverage
npm run test:coverage

# 7. Tests E2E
npm run test:e2e

# 8. Commit
git add .
git commit -m "feat: add progress bar component with tests"

# 9. Push
git push origin feature/progress-bar

# 10. CI/CD vérifie automatiquement tous les tests
```

---

## 📊 Objectifs de Coverage

### Coverage Cibles

| Type | Cible Minimum | Objectif Idéal |
|------|---------------|----------------|
| **Statements** | 80% | 90%+ |
| **Branches** | 75% | 85%+ |
| **Functions** | 80% | 90%+ |
| **Lines** | 80% | 90%+ |

### Exceptions au Coverage

Certains fichiers peuvent être exclus du coverage :

```typescript
// vitest.config.mts
coverage: {
  exclude: [
    'node_modules/',
    'src/test/',
    '**/*.d.ts',
    '**/*.config.*',
    '**/mockData',
    'src/app/**', // Next.js app directory (testés via E2E)
  ],
}
```

### Rapport de Coverage

```bash
# Générer le rapport
npm run test:coverage

# Ouvrir le rapport HTML
open coverage/index.html

# Le rapport affiche :
# - Pourcentage global
# - Coverage par fichier
# - Lignes non couvertes (en rouge)
# - Branches non couvertes
```

### Améliorer le Coverage

```typescript
// 1. Identifier les fichiers à faible coverage
// Via le rapport HTML : coverage/index.html

// 2. Ajouter des tests pour les cas non couverts
describe('calculateDiscount', () => {
  // ✅ Cas nominal
  it('should apply 10% discount for regular users', () => {
    expect(calculateDiscount(100, 'regular')).toBe(90);
  });

  // ✅ Cas limite : discount max
  it('should apply 50% max discount for premium users', () => {
    expect(calculateDiscount(100, 'premium')).toBe(50);
  });

  // ✅ Cas erreur : type invalide
  it('should throw error for invalid user type', () => {
    expect(() => calculateDiscount(100, 'invalid')).toThrow();
  });

  // ✅ Cas limite : montant négatif
  it('should return 0 for negative amount', () => {
    expect(calculateDiscount(-10, 'regular')).toBe(0);
  });
});
```

---

## 🎯 Checklist Avant Chaque PR

### Tests Obligatoires

- [ ] **Tests unitaires** : Tous les tests passent (`npm test`)
- [ ] **Tests E2E** : Parcours critiques OK (`npm run test:e2e`)
- [ ] **Linter** : Pas d'erreurs (`npm run lint`)
- [ ] **TypeScript** : Pas d'erreurs de type (`npm run type-check`)
- [ ] **Build** : Build réussit (`npm run build`)
- [ ] **Coverage** : Minimum 80% maintenu (`npm run test:coverage`)

### Tests Recommandés

- [ ] **Performance** : Lighthouse score 90+ (via Chrome DevTools MCP)
- [ ] **Accessibilité** : WCAG 2.1 AA (via Chrome DevTools MCP)
- [ ] **Tests manuels** : Tester la feature en local
- [ ] **Responsive** : Tester sur mobile/tablet

### Documentation

- [ ] **Commentaires** : Code complexe documenté
- [ ] **Tests documentés** : Scénarios clairs
- [ ] **README** : Mis à jour si nécessaire

---

**Document créé le** : Octobre 2025  
**Dernière mise à jour** : Octobre 2025  
**Version** : 1.0.0  
**Statut** : ✅ Guide complet des tests configurés

