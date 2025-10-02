import { expect, test } from "@playwright/test";

test.describe("Authentification", () => {
  test("devrait afficher la page de login", async ({ page }) => {
    await page.goto("/fr/auth/login");

    // Vérifier l'URL
    await expect(page).toHaveURL(/\/fr\/auth\/login/);

    // Vérifier que le formulaire de login est présent
    const emailInput = page.getByRole("textbox", {
      name: /email|e-mail/i,
    });
    const passwordInput = page.getByLabel(/password|mot de passe/i);

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("devrait afficher une erreur avec des identifiants invalides", async ({
    page,
  }) => {
    await page.goto("/fr/auth/login");

    // Remplir le formulaire avec des identifiants invalides
    await page.getByRole("textbox", { name: /email/i }).fill("test@example.com");
    await page.getByLabel(/password|mot de passe/i).fill("wrongpassword");

    // Soumettre le formulaire
    await page.getByRole("button", { name: /connexion|sign in|login/i }).click();

    // Attendre et vérifier le message d'erreur
    // Adapter selon votre implémentation
    const errorMessage = page.locator('[role="alert"], .error, [data-error]');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("devrait bloquer l'accès au dashboard sans authentification", async ({
    page,
  }) => {
    // Essayer d'accéder au dashboard sans être connecté
    await page.goto("/fr/dashboard");

    // Devrait rediriger vers la page de login
    await expect(page).toHaveURL(/\/fr\/auth\/login/);
  });

  test("devrait avoir un lien vers la création de compte (si disponible)", async ({
    page,
  }) => {
    await page.goto("/fr/auth/login");

    // Chercher un lien vers la création de compte
    const signupLink = page.getByRole("link", {
      name: /sign up|créer un compte|s'inscrire/i,
    });

    // Si le lien existe, vérifier qu'il est visible
    if (await signupLink.isVisible()) {
      await expect(signupLink).toBeVisible();
    }
  });
});

