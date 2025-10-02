import { expect, test } from "@playwright/test";

test.describe("Page d'accueil", () => {
  test("devrait charger la page d'accueil française", async ({ page }) => {
    await page.goto("/fr");

    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Health Ortho/i);

    // Vérifier que le header est présent
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Vérifier le contenu en français
    await expect(page.locator("body")).toContainText("Bienvenue");
  });

  test("devrait charger la page d'accueil anglaise", async ({ page }) => {
    await page.goto("/en");

    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Health Ortho/i);

    // Vérifier le contenu en anglais
    await expect(page.locator("body")).toContainText("Welcome");
  });

  test("devrait afficher le bouton de navigation", async ({ page }) => {
    await page.goto("/fr");

    // Vérifier que le bouton de navigation existe
    const navButton = page.getByRole("button", { name: /menu|navigation/i });
    await expect(navButton).toBeVisible();
  });
});

