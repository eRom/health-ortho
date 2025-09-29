import { computeScore, toWeeklyHistogram } from '../../shared/js/analytics.js';
import { loadStats } from '../../shared/js/storage.js';

export default async function renderVirelanguesStats(module) {
  const stats = await loadStats(module);
  if (!stats.length) {
    return '<p>Pas encore de statistiques enregistrées.</p>';
  }

  const events = stats.map((entry) => entry.payload);
  const avgCompletion = average(events.map((event) => event.completion));
  const avgAccuracy = average(events.map((event) => event.accuracy));
  const score = computeScore(avgCompletion, avgAccuracy);
  const weekly = toWeeklyHistogram(events);

  return `
    <article>
      <p><strong>Score moyen :</strong> ${score}/100</p>
      <p><strong>Complétion moyenne :</strong> ${avgCompletion}%</p>
      <p><strong>Précision moyenne :</strong> ${avgAccuracy}%</p>
      <p><strong>Sessions :</strong> ${events.length}</p>
    </article>
    <section>
      <h3>Sessions par semaine</h3>
      <ul>
        ${weekly.map((week) => `<li>${week.week} – ${week.sessions} sessions (complétion ${week.completion}%)</li>`).join('')}
      </ul>
    </section>
  `;
}

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

