# 🎭 Playwright - Tests End-to-End (E2E)

Guide complet pour utiliser Playwright dans Health Ortho.

---

## ✅ Installation Effectuée

✅ **Package installé** : `@playwright/test`  
✅ **Navigateurs installés** : Chromium, Firefox  
✅ **Configuration créée** : `playwright.config.ts`  
✅ **Tests créés** :
- `e2e/homepage.spec.ts` - Tests de la page d'accueil
- `e2e/navigation.spec.ts` - Tests de navigation
- `e2e/i18n.spec.ts` - Tests d'internationalisation
- `e2e/auth.spec.ts` - Tests d'authentification

---

## 🚀 Lancer les Tests

### Tous les tests (headless)
```bash
npm run test:e2e
```

### Tests avec interface UI
```bash
npm run test:e2e:ui
```

### Tests avec navigateur visible
```bash
npm run test:e2e:headed
```

### Mode Debug (step-by-step)
```bash
npm run test:e2e:debug
```

### Tests sur un navigateur spécifique
```bash
# Chromium seulement
npm run test:e2e:chromium

# Firefox seulement
npm run test:e2e:firefox
```

### Voir le rapport HTML
```bash
npm run test:e2e:report
```

---

## 📁 Structure des Tests

```
e2e/
├── homepage.spec.ts      # Tests page d'accueil
├── navigation.spec.ts    # Tests navigation entre pages
├── i18n.spec.ts         # Tests changement de langue
└── auth.spec.ts         # Tests authentification
```

---

## 💡 Écrire un Test Playwright

### Exemple Basique

```typescript
import { test, expect } from "@playwright/test";

test("Mon premier test", async ({ page }) => {
  // Naviguer vers la page
  await page.goto("/fr");

  // Vérifier le titre
  await expect(page).toHaveTitle(/Health Ortho/);

  // Cliquer sur un bouton
  await page.getByRole("button", { name: /connexion/i }).click();

  // Vérifier l'URL
  await expect(page).toHaveURL(/\/auth\/login/);
});
```

### Test avec Authentification

```typescript
test("Dashboard après login", async ({ page }) => {
  // Aller sur la page de login
  await page.goto("/fr/auth/login");

  // Remplir le formulaire
  await page.getByLabel(/email/i).fill("user@example.com");
  await page.getByLabel(/password/i).fill("password123");

  // Soumettre
  await page.getByRole("button", { name: /connexion/i }).click();

  // Attendre la redirection
  await page.waitForURL(/\/dashboard/);

  // Vérifier qu'on est bien sur le dashboard
  await expect(page.locator("h1")).toContainText("Dashboard");
});
```

### Test de Navigation

```typescript
test("Navigation vers Neuro", async ({ page }) => {
  await page.goto("/fr");

  // Cliquer sur le lien Neuro
  await page.getByRole("link", { name: /neuro/i }).click();

  // Vérifier l'URL
  await expect(page).toHaveURL(/\/neuro/);

  // Vérifier le contenu
  await expect(page.locator("h1")).toContainText("Neuro");
});
```

### Test avec Screenshot

```typescript
test("Vérifier l'apparence du bouton", async ({ page }) => {
  await page.goto("/fr");

  // Prendre un screenshot de la page entière
  await page.screenshot({ path: "screenshot.png", fullPage: true });

  // Prendre un screenshot d'un élément spécifique
  const button = page.getByRole("button", { name: /connexion/i });
  await button.screenshot({ path: "button.png" });
});
```

---

## 🎯 Sélecteurs Recommandés

### Par Rôle (Préféré) ✅

```typescript
// Bouton
page.getByRole("button", { name: /connexion/i });

// Lien
page.getByRole("link", { name: /accueil/i });

// Input texte
page.getByRole("textbox", { name: /email/i });

// Checkbox
page.getByRole("checkbox", { name: /accepter/i });
```

### Par Label ✅

```typescript
page.getByLabel(/email/i);
page.getByLabel(/mot de passe/i);
```

### Par Texte ✅

```typescript
page.getByText("Bienvenue");
page.getByText(/Connexion réussie/i);
```

### Par Test ID (Recommandé pour éléments complexes) ✅

```typescript
// Dans votre composant
<div data-testid="user-profile">...</div>

// Dans le test
page.getByTestId("user-profile");
```

### ❌ À Éviter

```typescript
// ❌ Sélecteurs CSS fragiles
page.locator(".btn-primary");
page.locator("#submit-button");

// ❌ XPath complexe
page.locator("//div[@class='container']//button[1]");
```

---

## 🔍 Assertions Utiles

### Page

```typescript
// URL
await expect(page).toHaveURL(/\/dashboard/);
await expect(page).toHaveURL("http://localhost:3000/fr");

// Titre
await expect(page).toHaveTitle(/Health Ortho/);
await expect(page).toHaveTitle("Health Ortho - Accueil");
```

### Éléments

```typescript
const button = page.getByRole("button", { name: /connexion/i });

// Visibilité
await expect(button).toBeVisible();
await expect(button).toBeHidden();

// Contenu
await expect(button).toContainText("Connexion");
await expect(button).toHaveText("Se connecter");

// Attributs
await expect(button).toHaveAttribute("type", "submit");
await expect(button).toBeEnabled();
await expect(button).toBeDisabled();

// Nombre d'éléments
await expect(page.getByRole("listitem")).toHaveCount(5);
```

---

## 🧪 Organiser vos Tests

### Grouper avec `describe`

```typescript
test.describe("Authentification", () => {
  test("Login avec succès", async ({ page }) => {
    // Test 1
  });

  test("Login avec erreur", async ({ page }) => {
    // Test 2
  });
});
```

### Hooks (beforeEach, afterEach)

```typescript
test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto("/fr/auth/login");
    await page.getByLabel(/email/i).fill("user@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /connexion/i }).click();
    await page.waitForURL(/\/dashboard/);
  });

  test("Afficher le profil", async ({ page }) => {
    // Le user est déjà connecté
    await page.getByRole("link", { name: /profil/i }).click();
    // ...
  });

  test("Se déconnecter", async ({ page }) => {
    // Le user est déjà connecté
    await page.getByRole("button", { name: /déconnexion/i }).click();
    // ...
  });
});
```

### Tests Conditionnels

```typescript
test("Uniquement en production", async ({ page }) => {
  test.skip(process.env.NODE_ENV !== "production");
  // Ce test ne s'exécute qu'en production
});

test.only("Debug ce test uniquement", async ({ page }) => {
  // Seul ce test s'exécutera
});

test.skip("Test désactivé temporairement", async ({ page }) => {
  // Ce test est ignoré
});
```

---

## 🌐 Tests Multi-Navigateurs

Par défaut, Playwright exécute les tests sur **Chromium**, **Firefox** et **Mobile Chrome**.

### Exécuter sur tous les navigateurs

```bash
npm run test:e2e
```

### Exécuter sur un navigateur spécifique

```bash
# Chromium seulement
npm run test:e2e:chromium

# Firefox seulement
npm run test:e2e:firefox

# Tous les navigateurs desktop (sans mobile)
npx playwright test --project=chromium --project=firefox
```

---

## 📊 Rapports et Résultats

### Rapport HTML

Après l'exécution des tests :

```bash
npm run test:e2e:report
```

Le rapport HTML s'ouvre automatiquement avec :
- Liste des tests (réussis/échoués)
- Traces vidéo des tests échoués
- Screenshots
- Logs détaillés

### Structure des Résultats

```
test-results/       # Résultats bruts
playwright-report/  # Rapport HTML
```

---

## 🐛 Debugging

### Mode Debug

```bash
npm run test:e2e:debug
```

Cela ouvre :
- L'inspecteur Playwright
- Le navigateur
- Permet d'avancer pas à pas

### Playwright Inspector

Dans votre test, ajoutez :

```typescript
await page.pause(); // Le test s'arrête ici
```

### Traces

Les traces sont automatiquement enregistrées en cas d'échec.

Pour visualiser une trace :

```bash
npx playwright show-trace test-results/.../trace.zip
```

---

## 🎨 Tests Visuels

### Screenshot Comparaison

```typescript
test("Visual regression", async ({ page }) => {
  await page.goto("/fr");

  // Premier run : génère l'image de référence
  // Runs suivants : compare avec la référence
  await expect(page).toHaveScreenshot("homepage.png");
});
```

### Screenshot d'un Élément

```typescript
const header = page.locator("header");
await expect(header).toHaveScreenshot("header.png");
```

---

## 🚀 Best Practices

### ✅ DO

```typescript
// ✅ Utiliser des sélecteurs sémantiques
page.getByRole("button", { name: /connexion/i });

// ✅ Attendre explicitement
await page.waitForURL(/\/dashboard/);
await expect(element).toBeVisible();

// ✅ Tests isolés et indépendants
test.beforeEach(async ({ page }) => {
  // Reset l'état avant chaque test
});

// ✅ Assertions claires
await expect(page.locator("h1")).toHaveText("Bienvenue");
```

### ❌ DON'T

```typescript
// ❌ Sélecteurs CSS fragiles
page.locator(".btn-primary");

// ❌ Timeouts fixes
await page.waitForTimeout(5000); // Ne pas faire !

// ❌ Tests qui dépendent les uns des autres
// Test 1 : créer un user
// Test 2 : utiliser le user créé par Test 1 ❌

// ❌ Assertions vagues
const count = await page.locator("li").count();
expect(count).toBeGreaterThan(0); // Pas assez précis
```

---

## 🔧 Configuration Avancée

### Variables d'Environnement

Créez `.env.test` :

```env
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
DATABASE_URL=file:./test.db
```

### Modifier le Timeout

Dans `playwright.config.ts` :

```typescript
export default defineConfig({
  timeout: 60 * 1000, // 60 secondes par test
  expect: {
    timeout: 10 * 1000, // 10 secondes pour les assertions
  },
});
```

---

## 📚 Ressources

### Documentation Officielle
- [Playwright Docs](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Exemples
- [GitHub Examples](https://github.com/microsoft/playwright/tree/main/examples)
- [Playwright Community](https://github.com/microsoft/playwright/discussions)

---

## 🎯 Prochaines Étapes

1. **Exécuter les tests existants** : `npm run test:e2e`
2. **Ajouter des tests pour vos features** : Créer de nouveaux fichiers `.spec.ts` dans `e2e/`
3. **Intégrer au CI/CD** : Les tests E2E s'exécutent automatiquement sur GitHub Actions
4. **Configurer les alertes** : Être notifié en cas d'échec

---

## 🆘 Problèmes Courants

### Les navigateurs ne se lancent pas

```bash
# Réinstaller les navigateurs
npx playwright install chromium firefox --with-deps
```

### Tests qui timeout

- Augmenter le timeout dans `playwright.config.ts`
- Vérifier que le serveur Next.js démarre correctement
- Utiliser `--headed` pour voir ce qui se passe

### Tests flaky (instables)

- Utiliser `waitForURL` au lieu de `goto` + assertions
- Attendre explicitement que les éléments soient visibles
- Éviter `waitForTimeout()`

---

**Playwright est maintenant configuré ! 🎭**  
Vous pouvez commencer à écrire vos tests E2E pour couvrir tous les parcours utilisateur.

