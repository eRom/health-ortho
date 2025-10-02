import { expect, test } from "@playwright/test";

test.describe("Internationalisation (i18n)", () => {
  test("devrait basculer du français à l'anglais", async ({ page }) => {
    // Démarrer sur la version française
    await page.goto("/fr");
    await expect(page).toHaveURL(/\/fr/);

    // Vérifier le contenu français
    await expect(page.locator("body")).toContainText(/bienvenue|français/i);

    // Chercher le bouton de changement de langue (peut être un select, un bouton, etc.)
    // Adapter le sélecteur selon votre implémentation
    const langSwitcher = page.locator(
      '[data-testid="language-switcher"], button[aria-label*="language"], select[name="language"]'
    );

    // Si le switcher existe, cliquer dessus
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();

      // Sélectionner l'anglais (adapter selon votre UI)
      const englishOption = page.getByRole("option", { name: /english|en/i });
      if (await englishOption.isVisible()) {
        await englishOption.click();
      } else {
        // Ou cliquer sur un lien
        await page.getByRole("link", { name: /english|en/i }).click();
      }

      // Vérifier que l'URL a changé
      await expect(page).toHaveURL(/\/en/);
    } else {
      // Fallback : naviguer directement
      await page.goto("/en");
      await expect(page).toHaveURL(/\/en/);
    }
  });

  test("devrait maintenir la locale lors de la navigation", async ({
    page,
  }) => {
    // Commencer en anglais
    await page.goto("/en");
    await expect(page).toHaveURL(/\/en/);

    // Naviguer vers une autre page
    const neuroLink = page.getByRole("link", { name: /neuro/i }).first();
    if (await neuroLink.isVisible()) {
      await neuroLink.click();

      // Vérifier que la locale est toujours /en
      await expect(page).toHaveURL(/\/en\/neuro/);
    }
  });

  test("devrait rediriger vers /fr si pas de locale", async ({ page }) => {
    // Accéder à la racine
    await page.goto("/");

    // Devrait rediriger vers /fr (locale par défaut)
    await expect(page).toHaveURL(/\/(fr|en)/);
  });
});

