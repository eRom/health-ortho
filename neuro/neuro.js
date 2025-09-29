import { neuroExercises } from "./exercices_neuro.js";
import { trackExerciseLaunch } from "/shared/js/analytics.js";
import { createElement, initFooterYear } from "/shared/js/components.js";
import { saveLatestSession } from "/shared/js/storage.js";

const grid = document.querySelector('[data-role="exercise-grid"]');
const versionElement = document.getElementById("neuro-version");
const PLATFORM_VERSION = "1.0.0";

const renderExerciseCard = (exercise) => {
  const title = createElement("h2", {
    className: "exercise-card__title",
    textContent: exercise.name,
  });

  const header = createElement("div", { className: "exercise-card__header" }, [
    title,
    createElement("span", { className: "badge", textContent: exercise.level }),
  ]);

  const description = createElement("p", {
    className: "exercise-card__description",
    textContent: exercise.description,
  });

  const tags = createElement(
    "div",
    { className: "exercise-card__tags" },
    exercise.tags.map((tag) =>
      createElement("span", { className: "tag-pill", textContent: tag })
    )
  );

  const statsLink = exercise.statsHref
    ? createElement("a", {
        className: "ghost-button ghost-button--compact",
        textContent: "Statistiques",
        attrs: {
          href: exercise.statsHref,
          "aria-label": `Voir les statistiques de ${exercise.name}`,
        },
      })
    : null;

  const actions = createElement(
    "div",
    { className: "exercise-card__actions" },
    [
      exercise.href
        ? createElement("a", {
            className: "primary-button",
            textContent: "Accéder à l'exercice",
            attrs: {
              href: exercise.href,
              "aria-label": `Accéder à ${exercise.name}`,
            },
          })
        : createElement("button", {
            className: "primary-button primary-button--warning",
            textContent: "Bientôt disponible",
            attrs: {
              type: "button",
              disabled: "disabled",
              "aria-disabled": "true",
            },
          }),
      statsLink,
    ].filter(Boolean)
  );

  const card = createElement(
    "article",
    { className: "exercise-card surface-card surface-card--interactive" },
    [header, description, tags, actions]
  );

  if (exercise.href) {
    card.addEventListener("click", (event) => {
      if (!(event.target instanceof HTMLAnchorElement)) {
        trackExerciseLaunch({ id: exercise.id, name: exercise.name });
        saveLatestSession({
          id: exercise.id,
          name: exercise.name,
          href: exercise.href,
          date: new Date().toISOString(),
        });
        window.location.assign(exercise.href);
      }
    });
  }

  return card;
};

const bootstrap = () => {
  if (!grid) {
    return;
  }
  neuroExercises.forEach((exercise) => {
    grid.appendChild(renderExerciseCard(exercise));
  });
  initFooterYear();
  if (versionElement) {
    versionElement.textContent = PLATFORM_VERSION;
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
