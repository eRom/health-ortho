import { trackProgress } from '../../shared/js/analytics.js';
import { buildFooter, buildHeader, openModal, showToast } from '../../shared/js/components.js';
import { saveStats } from '../../shared/js/storage.js';
import { createObservable, focusElement, to } from '../../shared/js/utils.js';

const APP_MODULE = 'ortho:virelangues';
const appRoot = document.getElementById('app-root');
const main = document.getElementById('contenu-principal');

const state = createObservable({
  exercises: [],
  currentIndex: 0,
  recording: false,
  metrics: {
    completion: 0,
    accuracy: 0,
    sessions: 0,
  },
  loading: true,
});

function init() {
  const header = buildHeader({ current: 'ortho', onNavigate: handleNavigate });
  const footer = buildFooter();
  document.getElementById('app-header')?.replaceWith(header);
  document.getElementById('app-footer')?.replaceWith(footer);

  renderSkeleton();
  attachEvents();
  loadExercises();
}

function handleNavigate(target) {
  window.location.href = target === 'home' ? '/' : target === 'neuro' ? '/neuro/neuro.html' : '/ortho/ortho.html';
}

function renderSkeleton() {
  if (!main) return;
  main.innerHTML = `
    <div class="container">
      <section class="session-header" aria-labelledby="virelangues-title">
        <div class="session-header__meta">
          <span class="badge">Module virelangues</span>
          <span class="badge" data-role="difficulty"></span>
        </div>
        <h2 id="virelangues-title">Virelangue en cours</h2>
        <p>Écoutez le modèle, répétez et enregistrez-vous pour suivre votre progression.</p>
        <div class="cta-group">
          <button class="primary-button" data-action="play">Lecture modèle</button>
          <button class="secondary-button" data-action="record">Démarrer enregistrement</button>
          <button class="secondary-button" data-action="next">Suivant</button>
          <button class="secondary-button" data-action="stats">Statistiques</button>
        </div>
      </section>

      <section aria-label="Carte de l'exercice" class="exercise-list"></section>

      <section class="stats-summary" aria-label="Synthèse progression">
        ${renderSummaryCard('Complétion', 'completion', '%')}
        ${renderSummaryCard('Précision', 'accuracy', '%')}
        ${renderSummaryCard('Sessions', 'sessions', '')}
      </section>
    </div>
  `;
}

function renderSummaryCard(label, key, suffix) {
  const value = state.get().metrics[key];
  return `
    <article class="stats-summary__card">
      <p class="stats-summary__value" data-metric="${key}">${value}${suffix}</p>
      <p class="stats-summary__label">${label}</p>
    </article>
  `;
}

function attachEvents() {
  main?.addEventListener('click', async (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;

    if (target.matches('[data-action="play"]')) {
      event.preventDefault();
      await playReference();
    }

    if (target.matches('[data-action="record"]')) {
      event.preventDefault();
      toggleRecording();
    }

    if (target.matches('[data-action="next"]')) {
      event.preventDefault();
      goToNextExercise();
    }

    if (target.matches('[data-action="stats"]')) {
      event.preventDefault();
      await openStats();
    }
  });
}

async function loadExercises() {
  const [error, data] = await to(fetch('/ortho/ortho-virelangues/virelangues-data/phrases.json').then((res) => res.json()));
  if (error || !Array.isArray(data)) {
    showToast({ message: 'Impossible de charger les virelangues', variant: 'error' });
    state.set({ ...state.get(), loading: false });
    return;
  }
  state.set({ ...state.get(), exercises: data, loading: false });
  renderExercise();
}

function renderExercise() {
  const { exercises, currentIndex } = state.get();
  const exercise = exercises[currentIndex];
  const list = main?.querySelector('.exercise-list');
  if (!exercise || !list) return;

  list.innerHTML = `
    <article class="exercise-card surface-card surface-card--interactive">
      <header>
        <h3>${exercise.text}</h3>
        <div class="exercise-card__meta">
          <span>${exercise.focus}</span>
          <span>${exercise.difficulty}</span>
        </div>
      </header>
      <div class="exercise-card__actions">
        <button class="primary-button" data-action="play">Écouter</button>
        <button class="secondary-button" data-action="record">${state.get().recording ? 'Arrêter' : 'Enregistrer'}</button>
      </div>
      <div class="waveform" aria-live="polite">Visualisation phonétique</div>
    </article>
  `;

  const difficultyBadge = main?.querySelector('[data-role="difficulty"]');
  if (difficultyBadge) difficultyBadge.textContent = exercise.difficulty;
  focusElement(list.querySelector('h3'));
}

async function playReference() {
  const { exercises, currentIndex } = state.get();
  const exercise = exercises[currentIndex];
  if (!exercise?.audio) return;
  const audio = new Audio(exercise.audio);
  await audio.play();
}

function toggleRecording() {
  const nextRecording = !state.get().recording;
  state.set({ ...state.get(), recording: nextRecording });
  const recordButton = main?.querySelector('[data-action="record"]');
  if (recordButton) {
    recordButton.textContent = nextRecording ? 'Arrêter' : 'Enregistrer';
  }
  if (!nextRecording) {
    persistSession();
  }
}

function goToNextExercise() {
  const { exercises, currentIndex } = state.get();
  const nextIndex = (currentIndex + 1) % exercises.length;
  state.set({ ...state.get(), currentIndex: nextIndex });
  renderExercise();
}

async function persistSession() {
  const payload = {
    module: APP_MODULE,
    completion: computeRandom(60, 95),
    accuracy: computeRandom(50, 90),
    duration: computeRandom(30, 120),
    metadata: { occurredAt: Date.now() },
  };
  await saveStats({
    id: `vl-${Date.now()}`,
    module: APP_MODULE,
    payload,
  });
  await trackProgress({
    module: APP_MODULE,
    exerciseId: state.get().exercises[state.get().currentIndex]?.id || 'unknown',
    completion: payload.completion,
    accuracy: payload.accuracy,
    duration: payload.duration,
    metadata: payload.metadata,
  });
  showToast({ message: 'Session sauvegardée', variant: 'success' });
}

async function openStats() {
  const { default: renderStats } = await import('./virelangues-stats.js');
  const content = await renderStats(APP_MODULE);
  openModal({ title: 'Statistiques virelangues', content });
}

state.subscribe((value) => {
  appRoot?.setAttribute('data-state', value.loading ? 'loading' : 'ready');
  ['completion', 'accuracy', 'sessions'].forEach((key) => {
    const element = main?.querySelector(`[data-metric="${key}"]`);
    if (element) {
      const suffix = key === 'sessions' ? '' : '%';
      element.textContent = `${value.metrics[key]}${suffix}`;
    }
  });
});

document.addEventListener('DOMContentLoaded', init, { once: true });

function computeRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

