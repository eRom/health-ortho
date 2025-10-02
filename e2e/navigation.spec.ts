import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("devrait naviguer vers la page Neuro", async ({ page }) => {
    await page.goto("/fr");

    // Cliquer sur le lien Neuro
    await page.getByRole("link", { name: /neuro/i }).first().click();

    // Vérifier l'URL
    await expect(page).toHaveURL(/\/fr\/neuro/);

    // Vérifier que la page Neuro est chargée
    await expect(page.locator("h1, h2")).toContainText(/neuro/i);
  });

  test("devrait naviguer vers la page Ortho", async ({ page }) => {
    await page.goto("/fr");

    // Cliquer sur le lien Ortho
    await page.getByRole("link", { name: /ortho/i }).first().click();

    // Vérifier l'URL
    await expect(page).toHaveURL(/\/fr\/ortho/);

    // Vérifier que la page Ortho est chargée
    await expect(page.locator("h1, h2")).toContainText(/ortho/i);
  });

  test("devrait naviguer vers le dashboard (redirect vers login)", async ({
    page,
  }) => {
    await page.goto("/fr/dashboard");

    // Devrait rediriger vers la page de login
    await expect(page).toHaveURL(/\/fr\/auth\/login/);
  });
});

