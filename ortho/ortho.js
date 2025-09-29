import { orthoExercises } from "./exercices_ortho.js";
import { createElement, initFooterYear } from "/shared/js/components.js";

const grid = document.querySelector('[data-role="exercise-grid"]');
const versionElement = document.getElementById("ortho-version");
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
      createElement("a", {
        className: "primary-button",
        textContent: "Accéder à l'exercice",
        attrs: {
          href: exercise.href,
          "aria-label": `Accéder à ${exercise.name}`,
        },
      }),
      statsLink,
    ].filter(Boolean)
  );

  return createElement(
    "article",
    { className: "exercise-card surface-card surface-card--interactive" },
    [header, description, tags, actions]
  );
};

const bootstrap = () => {
  if (!grid) {
    return;
  }
  orthoExercises.forEach((exercise) => {
    grid.appendChild(renderExerciseCard(exercise));
  });
  initFooterYear();
  if (versionElement) {
    versionElement.textContent = PLATFORM_VERSION;
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
