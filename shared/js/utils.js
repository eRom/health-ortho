/**
 * Planifie une tâche en idle si disponible, sinon utilise requestAnimationFrame.
 * @param {() => void} callback
 */
export const requestIdleTask = (callback) => {
  if (typeof window === "undefined") {
    return;
  }
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => callback());
  } else {
    window.requestAnimationFrame(() => callback());
  }
};

/**
 * Synchronise l'attribut data-motion en fonction de prefers-reduced-motion.
 */
export const setupPrefersReducedMotion = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return;
  }
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const applyMotionPreference = (event) => {
    document.body.dataset.motion = event.matches ? "reduce" : "auto";
    document.body.setAttribute("data-reduced-motion", String(event.matches));
  };
  applyMotionPreference(media);
  media.addEventListener("change", applyMotionPreference);
};

/**
 * Observable minimaliste pour gérer l'état partagé.
 */
export class Observable {
  constructor(initialValue) {
    this.value = initialValue;
    this.subscribers = new Set();
  }

  /**
   * @param {(value: any) => void} callback
   * @returns {() => void} unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.value);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * @param {any} nextValue
   */
  next(nextValue) {
    this.value = nextValue;
    this.subscribers.forEach((callback) => callback(nextValue));
  }
}

/**
 * Mémoïse une fonction pure avec un cache simple.
 * @template T
 * @param {(args: any[]) => T} fn
 * @returns {(args: any[]) => T}
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
