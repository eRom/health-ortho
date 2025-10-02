# 🧪 Configuration des Tests

Guide pour mettre en place les tests dans l'application MPR In Cloud.

---

## 📦 Installation des Dépendances

```bash
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @vitest/coverage-v8
```

---

## ⚙️ Configuration

### 1. `vitest.config.ts`
✅ **Déjà créé** - Configuration Vitest avec jsdom et alias @/

### 2. `src/test/setup.ts`
✅ **Déjà créé** - Setup des matchers jest-dom

### 3. Scripts package.json

Ajoutez ces scripts dans `package.json` :

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 🎯 Tests Existants

### ✅ `src/__tests__/utils.test.ts`
Tests de la fonction `cn()` qui merge les classes Tailwind.

### ✅ `src/__tests__/components/Button.test.tsx`
Tests complets du composant Button :
- Rendu de base
- Variants (default, destructive, outline)
- Tailles (sm, default, lg)
- État disabled
- Classes custom

---

## 🚀 Lancer les Tests

```bash
# Mode watch (développement)
npm test

# Run une fois
npm run test:run

# Avec interface UI
npm run test:ui

# Avec coverage
npm run test:coverage
```

---

## 📝 Exemples de Tests à Ajouter

### Test d'un Composant Card

```typescript
// src/__tests__/components/Card.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

describe("Card Component", () => {
  it("should render card with title and description", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
      </Card>
    );
    
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});
```

### Test d'une Page

```typescript
// src/__tests__/pages/home.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next-intl
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => ({
    "hero.title": "Welcome",
    "hero.description": "Test description",
  })),
}));

describe("Home Page", () => {
  it("should render hero section", async () => {
    // Test de votre page d'accueil
  });
});
```

### Test d'un Hook Custom

```typescript
// src/__tests__/hooks/useLocalStorage.test.ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

describe("useLocalStorage", () => {
  it("should store and retrieve value", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    
    expect(result.current[0]).toBe("default");
    
    act(() => {
      result.current[1]("new-value");
    });
    
    expect(result.current[0]).toBe("new-value");
  });
});
```

---

## 🎯 Couverture de Tests Recommandée

### Priorité HAUTE

1. **Utils** ✅
   - [x] `cn()` function
   - [ ] Autres helpers si présents

2. **Composants UI** ✅ (partiel)
   - [x] Button
   - [ ] Card
   - [ ] Input (si présent)
   - [ ] Form components

3. **Auth Flows**
   - [ ] Login form
   - [ ] Sign out button
   - [ ] Protected routes

### Priorité MOYENNE

4. **Pages**
   - [ ] Home page rendering
   - [ ] Neuro page rendering
   - [ ] Ortho page rendering
   - [ ] Dashboard page

5. **Navigation**
   - [ ] SiteHeader
   - [ ] LanguageSwitcher
   - [ ] Mobile menu

### Priorité BASSE

6. **Integration Tests**
   - [ ] Auth flow complet
   - [ ] Navigation entre pages
   - [ ] i18n switching

---

## 🔍 Bonnes Pratiques

### ✅ DO

```typescript
// ✅ Tester le comportement, pas l'implémentation
it("should display error when form is invalid", () => {
  // Test le résultat visible par l'utilisateur
});

// ✅ Utiliser screen queries
const button = screen.getByRole("button", { name: /submit/i });

// ✅ Tests isolés et indépendants
beforeEach(() => {
  // Clean state
});
```

### ❌ DON'T

```typescript
// ❌ Tester les détails d'implémentation
it("should call useState with initial value", () => {
  // Trop couplé à l'implémentation
});

// ❌ Utiliser des sélecteurs fragiles
const button = container.querySelector(".button-class");

// ❌ Tests dépendants les uns des autres
```

---

## 📊 Coverage Goals

| Type | Target |
|------|--------|
| **Statements** | 80%+ |
| **Branches** | 75%+ |
| **Functions** | 80%+ |
| **Lines** | 80%+ |

---

## 🐛 Debugging Tests

```bash
# Mode debug avec Node inspector
node --inspect-brk ./node_modules/.bin/vitest --run

# Avec console.log
console.log(screen.debug()); // Dans les tests

# Voir les queries disponibles
screen.logTestingPlaygroundURL();
```

---

## 🔗 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✅ Checklist d'Implémentation

- [x] Installer les dépendances
- [x] Configurer vitest.config.ts
- [x] Créer src/test/setup.ts
- [x] Ajouter scripts npm
- [x] Créer premiers tests (utils, Button)
- [ ] Atteindre 50% de coverage
- [ ] Atteindre 80% de coverage
- [ ] Intégrer dans CI/CD
- [ ] Setup pre-commit hooks avec tests

---

**Prochaine étape** : `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`

