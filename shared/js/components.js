/**
 * UI Components Factory
 * --------------------------------------------------------------------------
 * Construit les composants réutilisables (header, footer, cards, modales,
 * toasts) et gère les interactions accessibles.
 */

import { getPreferences, setPreferences } from './storage.js';
import { createId, focusElement, setAria } from './utils.js';

/**
 * Construit le header navigation avec onglets contextuels.
 * @param {{ current: 'home' | 'ortho' | 'neuro', onNavigate: (target: string) => void }} props
 * @returns {HTMLElement}
 */
export function buildHeader({ current, onNavigate }) {
  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <div class="container app-header__inner">
      <a class="app-header__brand" href="/" aria-label="Accueil MPR Nantes">
        <img src="/shared/assets/icons/logo.svg" alt="" width="40" height="40" role="presentation" />
        <div>
          <p class="badge">Programme MPR Nantes</p>
          <h1 class="app-header__title">Rééducation connectée</h1>
        </div>
      </a>
      <nav aria-label="Navigation principale">
        <div class="nav-tabs" role="tablist">
          ${renderTab('home', 'Accueil', current, onNavigate)}
          ${renderTab('ortho', 'Orthophonie', current, onNavigate)}
          ${renderTab('neuro', 'Neuropsychologie', current, onNavigate)}
        </div>
      </nav>
      ${renderPreferences()}
    </div>
  `;

  bindPreferenceControls(header);
  return header;
}

function renderTab(id, label, current, onNavigate) {
  const active = current === id;
  const ariaCurrent = active ? " aria-current='page'" : '';
  const tabId = createId(`tab-${id}`);
  const handleNavigate = `data-action="navigate" data-target="${id}"`;

  return `<button class="nav-tabs__link" id="${tabId}" role="tab" ${ariaCurrent} ${handleNavigate}>${label}</button>`;
}

function renderPreferences() {
  const { theme, textSize } = getPreferences();
  return `
    <div class="inline" role="group" aria-label="Préférences d'affichage">
      <button class="icon-button" data-action="toggle-theme" aria-pressed="${theme === 'dark'}" aria-label="Basculer thème sombre">
        <span class="sr-only">Basculer le thème</span>
        <svg aria-hidden="true" width="20" height="20"><use href="/shared/assets/icons/theme.svg#icon" /></svg>
      </button>
      <button class="icon-button" data-action="increase-text" aria-label="Augmenter taille du texte">
        <span class="sr-only">Augmenter la taille du texte</span>
        <svg aria-hidden="true" width="20" height="20"><use href="/shared/assets/icons/text.svg#larger" /></svg>
      </button>
      <span class="badge" aria-live="polite">Taille: ${textSize.toUpperCase()}</span>
    </div>
  `;
}

function bindPreferenceControls(root) {
  const toggle = root.querySelector('[data-action="toggle-theme"]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const { theme } = getPreferences();
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      setPreferences({ theme: nextTheme });
      document.documentElement.setAttribute('data-theme', nextTheme);
      toggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    });
  }

  const increase = root.querySelector('[data-action="increase-text"]');
  if (increase) {
    increase.addEventListener('click', () => {
      const order = ['md', 'lg', 'xl'];
      const prefs = getPreferences();
      const idx = order.indexOf(prefs.textSize);
      const next = order[(idx + 1) % order.length];
      setPreferences({ textSize: next });
      document.documentElement.style.setProperty('--app-text-size', next);
      const badge = root.querySelector('.badge[aria-live]');
      if (badge) badge.textContent = `Taille: ${next.toUpperCase()}`;
    });
  }
}

/**
 * Construit le footer commun.
 * @returns {HTMLElement}
 */
export function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  footer.innerHTML = `
    <div class="container app-footer__meta">
      <p class="app-footer__version">© 2025 Romain Ecarnot · Version 1.0.0</p>
      <div class="app-footer__links">
        <a class="secondary-button" href="https://fr.tipeee.com/rebondir-apres-lavc-ma-carriere-dans-la-tech" target="_blank" rel="noopener noreferrer">Soutenir le projet</a>
        <a class="link-secondary" href="/remerciement.html">Remerciements</a>
      </div>
    </div>
  `;
  return footer;
}

/**
 * Rend une carte d'exercice depuis une configuration.
 * @param {{ title: string, description: string, tags: string[], progress: number, link: string }} config
 * @returns {HTMLElement}
 */
export function buildExerciseCard({ title, description, tags, progress, link }) {
  const article = document.createElement('article');
  article.className = 'exercise-card surface-card surface-card--interactive';
  article.innerHTML = `
    <div class="exercise-card__header">
      <h2 class="exercise-card__title">${title}</h2>
      <div class="progress-indicator" role="status">
        <span>${progress}%</span>
        <span class="progress-indicator__bar" aria-hidden="true"><span style="transform: scaleX(${progress / 100})"></span></span>
      </div>
    </div>
    <p class="exercise-card__description">${description}</p>
    <div class="platform-card__tags">${tags.map((tag) => `<span class="tag-pill">${tag}</span>`).join('')}</div>
    <div class="platform-card__meta">
      <span>Accessible 24/7</span>
      <a class="link-secondary" href="${link}">Voir le programme</a>
    </div>
    <div class="exercise-card__actions">
      <a class="cta-button" href="${link}" data-analytics="cta-${title.toLowerCase()}">Accéder</a>
    </div>
  `;
  return article;
}

/**
 * Ouvre une modale de statistiques.
 * @param {{ title: string, content: string }} props
 * @returns {HTMLElement}
 */
export function openModal({ title, content }) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="modal__dialog" role="document">
      <div class="modal__header">
        <h2 class="modal__title">${title}</h2>
        <button class="icon-button" data-action="close-modal"><span class="sr-only">Fermer</span>×</button>
      </div>
      <div class="modal__content">${content}</div>
      <div class="modal__actions">
        <button class="secondary-button" data-action="export-json">Exporter JSON</button>
        <button class="secondary-button" data-action="export-csv">Exporter CSV</button>
        <button class="primary-button" data-action="close-modal">Fermer</button>
      </div>
    </div>
  `;

  const previouslyFocused = document.activeElement;
  document.body.append(modal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.closest('[data-action="close-modal"]')) {
      closeModal(modal, previouslyFocused);
    }
  });

  const dialog = modal.querySelector('.modal__dialog');
  focusElement(dialog?.querySelector('.modal__title'));
  trapFocus(modal);
  return modal;
}

function closeModal(modal, previous) {
  modal.remove();
  if (previous instanceof HTMLElement) {
    focusElement(previous);
  }
}

function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      focusElement(last);
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      focusElement(first);
    }
  });
}

/**
 * Affiche un toast de feedback.
 * @param {{ message: string, variant?: 'success' | 'error' | 'info' }} options
 * @returns {HTMLElement}
 */
export function showToast({ message, variant = 'info' }) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${variant}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span>${message}</span>`;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 4000);
  return toast;
}

/**
 * Initialise la navigation via attribut data-action.
 * @param {HTMLElement} root
 * @param {(target: string) => void} onNavigate
 */
export function bindNavigation(root, onNavigate) {
  root.addEventListener('click', (event) => {
    const element = /** @type {HTMLElement | null} */ (event.target instanceof HTMLElement ? event.target.closest('[data-action="navigate"]') : null);
    if (!element) return;
    event.preventDefault();
    const target = element.dataset.target;
    if (target) onNavigate(target);
  });
}

/**
 * Met à jour l'état ARIA de la navigation.
 * @param {HTMLElement} root
 * @param {string} current
 */
export function setActiveNav(root, current) {
  root.querySelectorAll('[data-action="navigate"]').forEach((element) => {
    const target = element.getAttribute('data-target');
    setAria(element, 'current', target === current ? 'page' : null);
  });
}

export default {
  buildHeader,
  buildFooter,
  buildExerciseCard,
  openModal,
  showToast,
  bindNavigation,
  setActiveNav,
};

