import { computeScore } from '../shared/js/analytics.js';
import { loadStats } from '../shared/js/storage.js';

export default async function renderModuleStats(moduleId) {
  const stats = await loadStats(`ortho:${moduleId}`);
  if (!stats.length) {
    return '<p>Aucune donnée disponible pour ce module.</p>';
  }

  const sessions = stats.map((entry) => entry.payload);
  const averageCompletion = average(sessions.map((session) => session.completion));
  const averageAccuracy = average(sessions.map((session) => session.accuracy));
  const score = computeScore(averageCompletion, averageAccuracy);

  return `
    <section>
      <p><strong>Score moyen :</strong> ${score}/100</p>
      <p><strong>Complétion moyenne :</strong> ${averageCompletion}%</p>
      <p><strong>Précision moyenne :</strong> ${averageAccuracy}%</p>
      <p><strong>Sessions :</strong> ${sessions.length}</p>
    </section>
    <section>
      <h3>Historique détaillé</h3>
      <ul>
        ${sessions
          .map(
            (session) => `
              <li>
                <strong>${new Date(session.metadata?.occurredAt || session.occurredAt || Date.now()).toLocaleString('fr-FR')}</strong>
                – complétion ${session.completion}%, précision ${session.accuracy}%
              </li>
            `
          )
          .join('')}
      </ul>
    </section>
  `;
}

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

