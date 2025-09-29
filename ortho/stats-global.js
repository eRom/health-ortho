import { computeScore, toWeeklyHistogram } from '../shared/js/analytics.js';
import { loadStats } from '../shared/js/storage.js';

export default async function renderGlobalStats() {
  const stats = await loadStats('ortho');
  const weekly = toWeeklyHistogram(stats.map((entry) => entry.payload));
  const globalScore = computeScore(
    average(stats.map((entry) => entry.payload.completion || 0)),
    average(stats.map((entry) => entry.payload.accuracy || 0))
  );

  return `
    <section aria-label="Scores globaux">
      <p><strong>Score composite :</strong> ${globalScore}/100</p>
      <p><strong>Sessions totales :</strong> ${stats.length}</p>
    </section>
    <section aria-label="Histogramme hebdomadaire">
      <h3>Progression hebdomadaire</h3>
      <ul>
        ${weekly
          .map(
            (week) => `<li><span>${week.week}</span> – ${week.sessions} sessions, complétion moyenne ${week.completion}%</li>`
          )
          .join('')}
      </ul>
    </section>
  `;
}

function average(values) {
  if (!values.length) return 0;
  const sum = values.reduce((total, current) => total + current, 0);
  return Math.round(sum / values.length);
}

