import { defineConfig, devices } from "@playwright/test";

/**
 * Configuration Playwright pour Next.js
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Dossier contenant les tests E2E
  testDir: "./e2e",

  // Timeout par test (30 secondes)
  timeout: 30 * 1000,

  // Nombre de tentatives en cas d'échec
  retries: process.env.CI ? 2 : 0,

  // Nombre de workers (parallélisation)
  workers: process.env.CI ? 1 : undefined,

  // Reporter : HTML pour local, GitHub Actions pour CI
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["html", { open: "on-failure" }]],

  // Configuration globale pour tous les tests
  use: {
    // URL de base de l'application
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",

    // Traces : toujours en cas d'échec
    trace: "retain-on-failure",

    // Screenshots : toujours en cas d'échec
    screenshot: "only-on-failure",

    // Vidéos : toujours en cas d'échec
    video: "retain-on-failure",

    // Timeout des actions (10 secondes)
    actionTimeout: 10 * 1000,

    // Locale par défaut
    locale: "fr-FR",

    // Timezone
    timezoneId: "Europe/Paris",
  },

  // Projets : tests sur différents navigateurs
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    // Mobile (optionnel)
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],

  // Serveur de développement Next.js
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes pour démarrer Next.js
    stdout: "ignore",
    stderr: "pipe",
  },

  // Dossiers de sortie
  outputDir: "test-results/",
});

