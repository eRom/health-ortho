import { getHomeCards } from "/shared/data/exercises.js";
import { trackHomeVisit } from "/shared/js/analytics.js";
import { createElement, initFooterYear } from "/shared/js/components.js";
import { loadLatestSession } from "/shared/js/storage.js";
import {
    requestIdleTask,
    setupPrefersReducedMotion,
} from "/shared/js/utils.js";

const SELECTORS = {
  footerYear: "footer-year",
  appVersion: "app-version",
  platformGrid: '[data-component="platform-grid"]',
  resumeModal: '[data-modal="resume"]',
  resumeModalBody: '[data-modal="resume"] [data-modal-body]',
  heroQuote: '[data-role="home-quote"]',
  toggleTheme: '[data-action="toggle-theme"]',
  openLatest: '[data-action="open-latest"]',
};

const QUOTES = [
  "La rééducation est un chemin, chaque pas compte.",
  "Persévérer, c’est progresser.",
  "La régularité fait la différence.",
  "Rééduquer, c’est avancer ensemble.",
  "Chaque effort construit demain.",
  "La réussite s’appuie sur la constance et le soutien.",
  "La rééducation, ce n’est pas juste un exercice, c’est un engagement.",
];

const APP_VERSION = "1.0.0";

const setHeroQuote = () => {
  const quoteElement = document.querySelector(SELECTORS.heroQuote);
  if (!quoteElement || QUOTES.length === 0) {
    return;
  }
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  quoteElement.textContent = randomQuote;
};

const renderHomeCards = () => {
  const grid = document.querySelector(SELECTORS.platformGrid);
  if (!grid) {
    return;
  }
  const fragment = document.createDocumentFragment();
  getHomeCards().forEach((card) => {
    const actionPrimary = createElement("a", {
      className: "primary-button",
      textContent: "Accéder à la plateforme",
      attrs: { href: card.href, "aria-label": `Accéder à ${card.title}` },
    });

    const actionSecondary = createElement("a", {
      className: "ghost-button ghost-button--compact",
      textContent: "Voir les détails",
      attrs: { href: card.href },
    });

    const cardElement = createElement(
      "article",
      { className: "platform-card surface-card surface-card--interactive" },
      [
        createElement(
          "div",
          { className: "platform-card__header" },
          [
            createElement("h3", {
              className: "platform-card__title",
              textContent: card.title,
            }),
            card.icon
              ? createElement("span", {
                  className: "platform-card__icon",
                  attrs: { role: "img", "aria-hidden": "true" },
                  textContent: "⬤",
                })
              : null,
          ].filter(Boolean),
        ),
        createElement("p", {
          className: "platform-card__description",
          textContent: card.description,
        }),
        createElement(
          "div",
          { className: "platform-card__tags" },
          card.tags.map((tag) =>
            createElement("span", { className: "tag-pill", textContent: tag }),
          ),
        ),
        createElement("div", { className: "platform-card__actions" }, [
          actionPrimary,
          actionSecondary,
        ]),
      ],
    );

    fragment.appendChild(cardElement);
  });
  grid.innerHTML = "";
  grid.appendChild(fragment);
};

const toggleTheme = (button) => {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  button.setAttribute("aria-pressed", String(next === "light"));
  button.textContent = next === "light" ? "Thème sombre" : "Thème clair";
  try {
    window.localStorage.setItem("mpr_theme", next);
  } catch (error) {
    console.warn("Impossible d'enregistrer le thème", error);
  }
};

const loadThemePreference = () => {
  try {
    const stored = window.localStorage.getItem("mpr_theme");
    if (stored) {
      document.documentElement.setAttribute("data-theme", stored);
      const toggle = document.querySelector(SELECTORS.toggleTheme);
      if (toggle) {
        toggle.setAttribute("aria-pressed", String(stored === "light"));
        toggle.textContent =
          stored === "light" ? "Thème sombre" : "Thème clair";
      }
    }
  } catch (error) {
    console.warn("Impossible de charger la préférence de thème", error);
  }
};

const openModal = (modal) => {
  modal.setAttribute("aria-hidden", "false");
  const focusable = modal.querySelector("[data-modal-close]") || modal;
  focusable.focus({ preventScroll: true });
};

const closeModal = (modal) => {
  modal.setAttribute("aria-hidden", "true");
};

const handleResumeClick = () => {
  const modal = document.querySelector(SELECTORS.resumeModal);
  const body = document.querySelector(SELECTORS.resumeModalBody);
  if (!modal || !body) {
    return;
  }
  const latest = loadLatestSession();
  if (!latest) {
    body.innerHTML =
      "<p>Aucune séance récente détectée. Lancez un exercice pour activer cette fonction.</p>";
    openModal(modal);
    return;
  }
  body.innerHTML = `
    <div class="resume-card">
      <h3>${latest.name}</h3>
      <p>Dernière activité le ${new Date(latest.date).toLocaleDateString("fr-FR")}</p>
      <a class="primary-button" href="${latest.href}">Reprendre l'exercice</a>
    </div>
  `;
  openModal(modal);
};

const bindEvents = () => {
  const toggleButton = document.querySelector(SELECTORS.toggleTheme);
  if (toggleButton) {
    toggleButton.addEventListener("click", () => toggleTheme(toggleButton));
  }
  const resumeButton = document.querySelector(SELECTORS.openLatest);
  if (resumeButton) {
    resumeButton.addEventListener("click", handleResumeClick);
  }
  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    const modal = button.closest("[data-modal]");
    if (!modal) {
      return;
    }
    button.addEventListener("click", () => closeModal(modal));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openModalElement = document.querySelector(
        '[data-modal][aria-hidden="false"]',
      );
      if (openModalElement) {
        closeModal(openModalElement);
      }
    }
  });
};

const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const autoRegisterScript = document.querySelector(
    'script[src="/service-worker.js"][data-auto-register="true"]',
  );
  if (!autoRegisterScript) {
    return;
  }
  navigator.serviceWorker
    .register("/service-worker.js")
    .catch((error) =>
      console.error("Service worker registration failed", error),
    );
};

const bootstrap = () => {
  initFooterYear(SELECTORS.footerYear);
  const versionElement = document.getElementById(SELECTORS.appVersion);
  if (versionElement) {
    versionElement.textContent = APP_VERSION;
  }
  setHeroQuote();
  renderHomeCards();
  bindEvents();
  loadThemePreference();
  setupPrefersReducedMotion();
  registerServiceWorker();
  trackHomeVisit();

  requestIdleTask(() => {
    // future enhancements: warm cache, prefetch data, etc.
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
