/**
 * Analytics & Progress Tracking
 * --------------------------------------------------------------------------
 * Fournit les fonctions de suivi anonymisé de progression patient, en
 * respectant RGPD et permettant une visualisation statistique dans les
 * modales.
 */

import { ensureSessionId, saveStats } from './storage.js';
import { createId, percentage } from './utils.js';

const ENDPOINT = 'https://analytics.mpr.homeincloud.fr/collect';

/**
 * @typedef {Object} ProgressEvent
 * @property {string} module - Identifiant du module (ex: 'ortho:virelangues').
 * @property {string} exerciseId - Identifiant exercice.
 * @property {number} completion - Pourcentage de complétion (0-100).
 * @property {number} accuracy - Pourcentage de réussite.
 * @property {number} duration - Durée en secondes.
 * @property {Record<string, any>} [metadata] - Données complémentaires.
 */

/**
 * Publie un évènement de progression vers le backend analytique.
 * @param {ProgressEvent} payload
 * @returns {Promise<void>}
 */
export async function trackProgress(payload) {
  const body = {
    eventId: createId('progress'),
    sessionId: ensureSessionId(),
    occurredAt: new Date().toISOString(),
    ...payload,
  };

  await Promise.all([
    sendToEndpoint(body),
    saveStats({
      id: body.eventId,
      module: payload.module,
      payload: body,
    }),
  ]);
}

/**
 * Envoie les données vers l'API analytique avec fallback offline.
 * @param {object} data
 */
async function sendToEndpoint(data) {
  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon(ENDPOINT, blob);
    return;
  }

  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch (error) {
    console.debug('Tracking offline, sera renvoyé via service worker', error);
  }
}

/**
 * Calcule un score composite basé sur complétion & précision.
 * @param {number} completion
 * @param {number} accuracy
 * @returns {number}
 */
export function computeScore(completion, accuracy) {
  const compl = percentage(completion, 100) / 100;
  const accu = percentage(accuracy, 100) / 100;
  return Math.round((compl * 0.6 + accu * 0.4) * 100);
}

/**
 * Transforme une liste d'évènements en histogramme par semaine.
 * @param {ProgressEvent[]} events
 * @returns {{ week: string, completion: number, sessions: number }[]}
 */
export function toWeeklyHistogram(events) {
  const buckets = new Map();
  events.forEach((event) => {
    const date = new Date(event.metadata?.occurredAt || Date.now());
    const yearWeek = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    const acc = buckets.get(yearWeek) || { completion: 0, sessions: 0 };
    acc.completion += event.completion;
    acc.sessions += 1;
    buckets.set(yearWeek, acc);
  });

  return Array.from(buckets.entries()).map(([week, { completion, sessions }]) => ({
    week,
    completion: Math.round(completion / sessions),
    sessions,
  }));
}

/**
 * Calcule le numéro de semaine ISO.
 * @param {Date} date
 * @returns {string}
 */
function getWeekNumber(date) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  return String(Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)).padStart(2, '0');
}

export default {
  trackProgress,
  computeScore,
  toWeeklyHistogram,
};

