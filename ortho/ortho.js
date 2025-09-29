import { trackProgress } from "../shared/js/analytics.js";
import {
  buildFooter,
  buildHeader,
  openModal,
  showToast,
} from "../shared/js/components.js";
import {
  ensureSessionId,
  exportStatsToCsv,
  exportStatsToJson,
} from "../shared/js/storage.js";
import {
  createObservable,
  focusElement,
  lazyImport,
  to,
} from "../shared/js/utils.js";
import { orthoExercises } from "./exercices_ortho.js";
import { createElement, initFooterYear } from "/shared/scripts/ui.js";

const appRoot = document.getElementById("app-root");
const main = document.getElementById("contenu-principal");

const state = createObservable({
  activeModule: null,
  timeline: [],
  stats: {
    completion: 0,
    accuracy: 0,
    sessions: 0,
  },
  loading: true,
  modules: [],
});

function init() {
  ensureSessionId();
  const header = buildHeader({ current: "ortho", onNavigate: handleNavigate });
  const footer = buildFooter();
  document.getElementById("app-header")?.replaceWith(header);
  document.getElementById("app-footer")?.replaceWith(footer);

  renderSkeleton();
  attachEvents();
  loadModules();
}

function handleNavigate(target) {
  window.location.href = target === "home" ? "/" : "/neuro/neuro.html";
}

function renderSkeleton() {
  if (!main) return;
  const template = document.createElement("template");
  template.innerHTML = `
    <div class="container">
      <section class="therapy-hero" aria-labelledby="orthophonie-title">
        <p class="badge">Programme orthophonie clinique</p>
        <h2 id="orthophonie-title" class="therapy-hero__title">Renforcez articulation et diction</h2>
        <p class="therapy-hero__description">Travaillez les diadococinésies, les virelangues et la coordination respiratoire.
          Chaque module enregistre vos progrès et génère des statistiques exportables.</p>
        <div class="cta-group">
          <a class="primary-button" href="#modules">Explorer les modules</a>
          <button class="secondary-button" data-action="open-stats">Voir les statistiques</button>
        </div>
      </section>

      <section class="therapy-stats" aria-label="Statistiques globales">
        ${renderStatCard("Taux de complétion", "completion", "%")}
        ${renderStatCard("Précision articulatoire", "accuracy", "%")}
        ${renderStatCard("Sessions réalisées", "sessions", "")}
      </section>

      <section id="modules" class="module-grid" aria-label="Modules d'orthophonie"></section>

      <section aria-label="Historique des séances">
        <h3>Chronologie des exercices récents</h3>
        <div class="timeline" data-role="timeline"></div>
      </section>
    </div>
  `;

  main.innerHTML = "";
  main.append(template.content);

  focusElement(main.querySelector("h2"));
}

function renderStatCard(label, key, suffix) {
  const value = state.get().stats[key];
  return `
    <article class="stat-card">
      <p class="stat-card__value">${value}${suffix}</p>
      <p class="stat-card__label">${label}</p>
    </article>
  `;
}

function renderModuleCard(module) {
  const article = document.createElement("article");
  article.className = "module-card surface-card surface-card--interactive";
  article.setAttribute("tabindex", "0");
  article.innerHTML = `
    <div class="module-card__header">
      <h3 class="module-card__title">${module.title}</h3>
      <span class="badge">${module.level}</span>
    </div>
    <p>${module.description}</p>
    <div class="module-card__meta">
      <span>${module.duration} min</span>
      <span>${module.exercises.length} exercices</span>
    </div>
    <div class="module-card__actions">
      <a class="primary-button" href="${module.entryPoint}">Lancer</a>
      <button class="secondary-button" data-action="preview" data-module="${module.id}">Aperçu</button>
      <button class="secondary-button" data-action="stats" data-module="${module.id}">Statistiques</button>
    </div>
  `;
  return article;
}

function attachEvents() {
  main?.addEventListener("click", async (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;

    const moduleId = target.getAttribute("data-module");
    if (target.matches('[data-action="preview"]')) {
      event.preventDefault();
      const module = state.get().modules.find((mod) => mod.id === moduleId);
      if (module) {
        openModal({
          title: `Aperçu – ${module.title}`,
          content: renderPreviewList(module.exercises),
        });
      }
    }

    if (target.matches('[data-action="stats"]')) {
      event.preventDefault();
      await showModuleStats(moduleId);
    }

    if (target.matches('[data-action="open-stats"]')) {
      event.preventDefault();
      await showGlobalStats();
    }

    if (target.matches('[data-action="export-json"]')) {
      const [statsModal] = document.getElementsByClassName("modal");
      if (!moduleId) {
        const json = await exportStatsToJson("ortho");
        downloadBlob(json, "mpr-ortho-stats.json", "application/json");
        showToast({ message: "Export JSON généré", variant: "success" });
      } else {
        const json = await exportStatsToJson(`ortho:${moduleId}`);
        downloadBlob(json, `mpr-ortho-${moduleId}.json`, "application/json");
        showToast({ message: "Export module JSON généré", variant: "success" });
      }
      statsModal?.remove();
    }

    if (target.matches('[data-action="export-csv"]')) {
      if (!moduleId) {
        const csv = await exportStatsToCsv("ortho");
        downloadBlob(csv, "mpr-ortho-stats.csv", "text/csv");
      } else {
        const csv = await exportStatsToCsv(`ortho:${moduleId}`);
        downloadBlob(csv, `mpr-ortho-${moduleId}.csv`, "text/csv");
      }
      showToast({ message: "Export CSV généré", variant: "success" });
    }
  });
}

function renderPreviewList(items) {
  return `
    <ol>
      ${items
        .map(
          (item) => `
            <li>
              <strong>${item.title}</strong>
              <p>${item.objective}</p>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

async function showModuleStats(moduleId) {
  if (!moduleId) return;
  const { default: moduleStats } = await lazyImport(() =>
    import("./stats-module.js")
  );
  const content = await moduleStats(moduleId);
  openModal({ title: `Statistiques module ${moduleId}`, content });
}

async function showGlobalStats() {
  const { default: globalStats } = await lazyImport(() =>
    import("./stats-global.js")
  );
  const content = await globalStats();
  openModal({ title: "Statistiques globales orthophonie", content });
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

state.subscribe((value) => {
  appRoot?.setAttribute("data-state", value.loading ? "loading" : "ready");
  const statsCards = main?.querySelectorAll(".stat-card__value") || [];
  statsCards.forEach((card, index) => {
    if (!(card instanceof HTMLElement)) return;
    const keys = ["completion", "accuracy", "sessions"];
    const key = keys[index];
    if (key === "sessions") {
      card.textContent = String(value.stats.sessions);
    } else {
      card.textContent = `${value.stats[key]}%`;
    }
  });
});

state.subscribe((value) => {
  if (value.modules.length) {
    const list = main?.querySelector(".module-grid");
    if (list && list.children.length === 0) {
      value.modules.forEach((module) => {
        list.append(renderModuleCard(module));
      });
    }
  }
});

async function loadModules() {
  const [error, data] = await to(
    fetch("/ortho/exercices-ortho.json").then((res) => res.json())
  );
  if (error || !data) {
    showToast({
      message: "Impossible de charger les modules d'orthophonie",
      variant: "error",
    });
    console.error("Chargement modules orthophonie", error);
    state.set({ ...state.get(), loading: false });
    return;
  }
  state.set({ ...state.get(), modules: data.modules, loading: false });
}

document.addEventListener("DOMContentLoaded", init, { once: true });

// Exemple de tracking
window.addEventListener("focus", () => {
  trackProgress({
    module: "ortho",
    exerciseId: "dashboard",
    completion: 100,
    accuracy: 100,
    duration: 10,
    metadata: { occurredAt: Date.now() },
  });
});

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
      createElement("a", {
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
