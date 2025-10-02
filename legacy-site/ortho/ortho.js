import { orthoExercises } from "./exercices_ortho.js";
import { createElement, initFooterYear } from "/shared/scripts/ui.js";

const grid = document.querySelector(".exercise-grid");

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

  const actions = createElement(
    "div",
    { className: "exercise-card__actions" },
    [
      exercise.status === "coming-soon"
        ? createElement("button", {
            className: "primary-button primary-button--warning",
            textContent: "En préparation",
            attrs: {
              type: "button",
              disabled: "disabled",
              "aria-disabled": "true",
            },
          })
        : createElement("a", {
            className: "primary-button",
            textContent: "Accéder à l'exercice",
            attrs: {
              href: exercise.href,
              "aria-label": `Accéder à ${exercise.name}`,
            },
          }),
    ]
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
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
