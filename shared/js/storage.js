/**
 * Gestion des préférences et états persistés.
 */

const SESSION_KEY = "mpr_latest_session";

/**
 * @typedef {Object} LatestSession
 * @property {string} id
 * @property {string} href
 * @property {string} name
 * @property {string} date ISO string
 */

/**
 * Enregistre la dernière séance lancée.
 * @param {LatestSession} session
 */
export const saveLatestSession = (session) => {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn("Impossible d'enregistrer la séance", error);
  }
};

/**
 * Charge la dernière séance si disponible.
 * @returns {LatestSession | null}
 */
export const loadLatestSession = () => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return {
      id: String(parsed.id ?? ""),
      href: String(parsed.href ?? ""),
      name: String(parsed.name ?? "Exercice"),
      date: String(parsed.date ?? new Date().toISOString()),
    };
  } catch (error) {
    console.warn("Impossible de charger la séance", error);
    return null;
  }
};

/**
 * Initialise une base IndexedDB pour stocker des statistiques.
 * @returns {Promise<IDBDatabase>}
 */
export const openStatsDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB non supporté"));
      return;
    }
    const request = window.indexedDB.open("mpr_stats", 1);
    request.onerror = () =>
      reject(request.error || new Error("indexDB erreur"));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("sessions")) {
        db.createObjectStore("sessions", { keyPath: "id" });
      }
    };
  });
};
