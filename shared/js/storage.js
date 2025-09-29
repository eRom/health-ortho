/**
 * Storage Service
 * --------------------------------------------------------------------------
 * Encapsule l'accès à localStorage et IndexedDB pour persistances
 * des préférences utilisateurs, statistiques et exports.
 */

import { createId, to } from './utils.js';

const STORAGE_KEYS = {
  preferences: 'mpr.preferences',
  session: 'mpr.session',
};

const DB_NAME = 'mpr-db';
const DB_VERSION = 1;
const STORE_STATS = 'stats';

/**
 * Détection du support localStorage sans générer d'exception.
 * @returns {boolean}
 */
function hasLocalStorage() {
  try {
    const testKey = '__mpr_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage indisponible', error);
    return false;
  }
}

const localStorageAvailable = typeof window !== 'undefined' && hasLocalStorage();

/**
 * Lecture JSON sécurisée dans localStorage.
 * @template T
 * @param {string} key - Clé de stockage.
 * @param {T} fallback - Valeur par défaut.
 * @returns {T}
 */
export function readLocal(key, fallback) {
  if (!localStorageAvailable) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error('Erreur lecture localStorage', { key, error });
    return fallback;
  }
}

/**
 * Écriture JSON sécurisée dans localStorage.
 * @param {string} key
 * @param {unknown} value
 */
export function writeLocal(key, value) {
  if (!localStorageAvailable) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erreur écriture localStorage', { key, error });
  }
}

/**
 * Supprime une clé du localStorage.
 * @param {string} key
 */
export function removeLocal(key) {
  if (!localStorageAvailable) return;
  window.localStorage.removeItem(key);
}

/**
 * Retourne les préférences utilisateur persistées.
 * @returns {{ theme: 'dark' | 'light', audioEnabled: boolean, textSize: 'md' | 'lg' | 'xl' }}
 */
export function getPreferences() {
  return readLocal(STORAGE_KEYS.preferences, {
    theme: 'dark',
    audioEnabled: true,
    textSize: 'md',
  });
}

/**
 * Persiste les préférences utilisateur.
 * @param {Partial<ReturnType<typeof getPreferences>>} next
 */
export function setPreferences(next) {
  writeLocal(STORAGE_KEYS.preferences, {
    ...getPreferences(),
    ...next,
  });
}

/**
 * Retourne l'identifiant de session courant ou en crée un.
 * @returns {string}
 */
export function ensureSessionId() {
  const data = readLocal(STORAGE_KEYS.session, null);
  if (data?.id) return data.id;
  const session = { id: createId('session'), createdAt: Date.now() };
  writeLocal(STORAGE_KEYS.session, session);
  return session.id;
}

/**
 * Initialisation IndexedDB.
 * @returns {Promise<IDBDatabase>}
 */
function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = /** @type {IDBDatabase} */ (request.result);
      if (!db.objectStoreNames.contains(STORE_STATS)) {
        db.createObjectStore(STORE_STATS, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Sauvegarde des statistiques dans IndexedDB.
 * @param {{ id: string, module: string, payload: any, updatedAt?: number }} record
 * @returns {Promise<void>}
 */
export async function saveStats(record) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_STATS], 'readwrite');
    const store = transaction.objectStore(STORE_STATS);
    store.put({
      updatedAt: Date.now(),
      ...record,
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Récupère les statistiques pour un module donné.
 * @param {string} module
 * @returns {Promise<any[]>}
 */
export async function loadStats(module) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_STATS], 'readonly');
    const store = transaction.objectStore(STORE_STATS);
    const request = store.getAll();
    request.onsuccess = () => {
      const result = /** @type {any[]} */ (request.result || []);
      resolve(result.filter((entry) => entry.module === module));
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Export des stats au format JSON.
 * @param {string} module
 * @returns {Promise<string>}
 */
export async function exportStatsToJson(module) {
  const stats = await loadStats(module);
  return JSON.stringify({ module, exportedAt: new Date().toISOString(), stats }, null, 2);
}

/**
 * Export des stats au format CSV.
 * @param {string} module
 * @returns {Promise<string>}
 */
export async function exportStatsToCsv(module) {
  const stats = await loadStats(module);
  if (stats.length === 0) return 'module,timestamp,data\n';
  const rows = stats.map(({ module: mod, updatedAt, payload }) => {
    const serialized = JSON.stringify(payload).replace(/"/g, '""');
    return `${mod},${new Date(updatedAt).toISOString()},"${serialized}"`;
  });
  return ['module,timestamp,data', ...rows].join('\n');
}

/**
 * Import des statistiques depuis un JSON.
 * @param {string} json
 * @returns {Promise<void>}
 */
export async function importStats(json) {
  const db = await openDb();
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed.stats)) return;

  await Promise.all(
    parsed.stats.map((entry) =>
      saveStats({
        id: entry.id || createId('stat'),
        module: entry.module || parsed.module,
        payload: entry.payload,
        updatedAt: entry.updatedAt || Date.now(),
      })
    )
  );
}

/**
 * Purge l'ensemble des données IndexedDB.
 * @returns {Promise<void>}
 */
export async function clearStats() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_STATS], 'readwrite');
    const store = transaction.objectStore(STORE_STATS);
    store.clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Sauvegarde optimisée via queue microtask (utilisé pour synchronisation multi-device)
 * @param {() => Promise<void>} task
 */
export async function queueSync(task) {
  const [error] = await to(task());
  if (error) console.error('Erreur synchronisation', error);
}

export default {
  readLocal,
  writeLocal,
  removeLocal,
  getPreferences,
  setPreferences,
  ensureSessionId,
  saveStats,
  loadStats,
  exportStatsToJson,
  exportStatsToCsv,
  importStats,
  clearStats,
  queueSync,
};

