import { exercises } from "/shared/data/exercises.js";
import { createElement, initFooterYear } from "/shared/scripts/ui.js";

const renderExerciseCard = (exercise) => {
  const title = createElement("h2", {
    className: "exercise-card__title",
    textContent: exercise.name,
  });

  const header = createElement(
    "div",
    { className: "exercise-card__header" },
    [
      title,
      createElement("span", {
        className: "badge",
        textContent: exercise.level,
      }),
    ],
  );

  const description = createElement("p", {
    className: "exercise-card__description",
    textContent: exercise.description,
  });

  const tags = createElement(
    "div",
    { className: "exercise-card__tags" },
    exercise.tags.map((tag) =>
      createElement("span", { className: "tag-pill", textContent: tag }),
    ),
  );

  const actions = createElement(
    "div",
    { className: "exercise-card__actions" },
    [
      createElement("a", {
        className: "primary-button",
        textContent: "Commencer",
        attrs: {
          href: exercise.href,
          "aria-label": `Commencer l'exercice ${exercise.name}`,
        },
      }),
    ],
  );

  return createElement(
    "article",
    {
      className: "exercise-card surface-card surface-card--interactive",
      attrs: { tabindex: "0" },
    },
    [header, description, tags, actions],
  );
};

const renderExerciseList = () => {
  const grid = document.querySelector(".exercise-grid");
  if (!grid) {
    return;
  }

  exercises.forEach((exercise) => {
    grid.appendChild(renderExerciseCard(exercise));
  });
};

const bootstrap = () => {
  renderExerciseList();
  initFooterYear();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

