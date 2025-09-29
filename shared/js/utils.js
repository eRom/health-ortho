/**
 * Utils Library
 * --------------------------------------------------------------------------
 * Fournit des fonctions utilitaires génériques utilisées sur l'ensemble
 * de l'application: formatage des dates, gestion des promesses, debounce,
 * gestion ARIA, génération d'IDs, etc.
 *
 * @module utils
 */

const isBrowser = typeof window !== 'undefined';

/**
 * Retourne la date courante formatée selon la locale française.
 * @param {Date | string | number} input - Date à formater.
 * @param {Intl.DateTimeFormatOptions} [options] - Options de formatage personnalisées.
 * @returns {string}
 */
export function formatDate(input, options = {}) {
  const date = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(date);
}

/**
 * Formate une durée (en secondes) en chaîne lisible (mm:ss).
 * @param {number} seconds - Durée en secondes.
 * @returns {string}
 */
export function formatDuration(seconds) {
  const clamped = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(2, '0');
  const remaining = Math.floor(clamped % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${remaining}`;
}

/**
 * Debounce une fonction pour limiter sa fréquence d'exécution.
 * @template {(...args: any[]) => void} Fn
 * @param {Fn} fn - Fonction à limiter.
 * @param {number} delay - Délai en millisecondes.
 * @returns {Fn}
 */
export function debounce(fn, delay = 250) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle une fonction pour exécuter au plus une fois par intervalle.
 * @template {(...args: any[]) => void} Fn
 * @param {Fn} fn - Fonction à limiter.
 * @param {number} interval - Intervalle en millisecondes.
 * @returns {Fn}
 */
export function throttle(fn, interval = 200) {
  let lastTime = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Génère un identifiant unique basé sur l'horodatage & compteur.
 * @param {string} [prefix="id"] - Préfixe de l'ID.
 * @returns {string}
 */
export const createId = (() => {
  let counter = 0;
  return (prefix = 'id') => {
    counter += 1;
    return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
  };
})();

/**
 * Ajoute ou met à jour un attribut ARIA sur un élément.
 * @param {Element} element - Élément cible.
 * @param {string} ariaProp - Propriété ARIA (sans prefix aria-).
 * @param {string|null} value - Valeur à appliquer, ou null pour supprimer.
 */
export function setAria(element, ariaProp, value) {
  if (!element) return;
  const attribute = `aria-${ariaProp}`;
  if (value === null || typeof value === 'undefined') {
    element.removeAttribute(attribute);
  } else {
    element.setAttribute(attribute, String(value));
  }
}

/**
 * Sélectionne un élément et lève une erreur si absent.
 * @template {Element} T
 * @param {string} selector - Sélecteur CSS.
 * @param {ParentNode} [root=document] - Racine de recherche.
 * @returns {T}
 */
export function requireElement(selector, root = document) {
  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Élément requis manquant pour le sélecteur: ${selector}`);
  }
  return element;
}

/**
 * Simule un import dynamique conditionnel côté legacy (IE11).
 * @param {() => Promise<any>} loader - Fonction de chargement.
 * @returns {Promise<any>}
 */
export function lazyImport(loader) {
  if (!isBrowser) return Promise.resolve(null);
  return loader().catch((error) => {
    console.error('Échec du chargement différé', error);
    return null;
  });
}

/**
 * Gestion sécurisée d'une promesse asynchrone avec capture d'erreur.
 * @template T
 * @param {Promise<T>} promise - Promesse à traiter.
 * @returns {Promise<[Error|null, T|null]>}
 */
export async function to(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [/** @type {Error} */ (error), null];
  }
}

/**
 * Calcule un pourcentage arrondi avec garde-fous.
 * @param {number} value - Valeur actuelle.
 * @param {number} total - Valeur totale.
 * @returns {number}
 */
export function percentage(value, total) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

/**
 * Crée un objet observable simple pour centraliser l'état.
 * @template T
 * @param {T} initialValue - Valeur initiale.
 * @returns {{ subscribe: (listener: (value: T) => void) => () => void, set: (value: T) => void, get: () => T }}
 */
export function createObservable(initialValue) {
  let value = initialValue;
  /** @type {Set<(value: typeof value) => void>} */
  const listeners = new Set();

  const notify = () => {
    listeners.forEach((listener) => listener(value));
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      listener(value);
      return () => listeners.delete(listener);
    },
    set(nextValue) {
      value = nextValue;
      notify();
    },
    get() {
      return value;
    },
  };
}

/**
 * Focalise un élément en gérant le fallback pour IE11.
 * @param {HTMLElement | null} element - Élément cible.
 */
export function focusElement(element) {
  if (!element) return;
  if (typeof element.focus === 'function') {
    element.focus({ preventScroll: true });
  } else if (isBrowser) {
    // Fallback IE
    element.setActive?.();
  }
}

/**
 * Crée une promesse résolue après un délai.
 * @param {number} ms - Millisecondes à attendre.
 * @returns {Promise<void>}
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  formatDate,
  formatDuration,
  debounce,
  throttle,
  createId,
  setAria,
  requireElement,
  lazyImport,
  to,
  percentage,
  createObservable,
  focusElement,
  wait,
};

