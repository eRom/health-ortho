import { bindNavigation, buildExerciseCard, buildFooter, buildHeader, setActiveNav } from './shared/js/components.js';
import { ensureSessionId, getPreferences } from './shared/js/storage.js';
import { registerServiceWorker } from './shared/js/sw-register.js';
import { createObservable, focusElement } from './shared/js/utils.js';

const appRoot = document.getElementById('app-root');
const main = document.getElementById('contenu-principal');

/**
 * État central de la page d'accueil.
 */
const state = createObservable({
  current: 'home',
  loading: true,
});

function init() {
  ensureSessionId();
  loadPreferences();

  const header = buildHeader({
    current: 'home',
    onNavigate: navigate,
  });
  const footer = buildFooter();

  document.getElementById('app-header')?.replaceWith(header);
  document.getElementById('app-footer')?.replaceWith(footer);

  renderHome();
  bindNavigation(header, navigate);
  registerServiceWorker();

  state.set({ ...state.get(), loading: false });
  appRoot?.setAttribute('data-state', 'ready');
}

function loadPreferences() {
  const { theme, textSize } = getPreferences();
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.setProperty('--app-text-size', textSize);
}

function renderHome() {
  if (!main) return;
  main.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'container';
  container.innerHTML = `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__meta">
        <span class="badge">Programme hospitalier</span>
        <span class="badge">Suivi patient & pro</span>
      </div>
      <h2 id="hero-title" class="hero__headline">Rééducation orthophonique & neuropsychologique</h2>
      <p class="hero__description">Accédez à une bibliothèque interactive d'exercices thérapeutiques personnalisés.
        Suivez les progrès, exportez les données et collaborez avec votre thérapeute.</p>
    </section>
    <section class="platform-grid" aria-label="Choix des plateformes d'exercices"></section>
  `;

  const grid = container.querySelector('.platform-grid');
  if (grid) {
    grid.append(
      buildExerciseCard({
        title: 'Orthophonie',
        description: 'Articulation, diadococinésies, virelangues et suivi des progrès vocaux.',
        tags: ['diction', 'élocution', 'articulation'],
        progress: 68,
        link: '/ortho/ortho.html',
      }),
      buildExerciseCard({
        title: 'Neuropsychologie',
        description: 'Empans, attention sélective, mémoire de travail, fonctions exécutives.',
        tags: ['mémoire', 'attention', 'fonctions exécutives'],
        progress: 54,
        link: '/neuro/neuro.html',
      })
    );
  }

  main.append(container);
  focusElement(container.querySelector('h2'));
}

function navigate(target) {
  state.set({ ...state.get(), current: target });
  setActiveNav(document, target);
  if (target === 'home') {
    renderHome();
  } else {
    window.location.href = target === 'ortho' ? '/ortho/ortho.html' : '/neuro/neuro.html';
  }
}

state.subscribe((value) => {
  appRoot?.setAttribute('data-state', value.loading ? 'loading' : 'ready');
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

