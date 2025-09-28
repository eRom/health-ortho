const QUOTES = [
  "La rééducation est un chemin, chaque pas compte.",
  "Persévérer, c’est progresser.",
  "La régularité fait la différence.",
  "Rééduquer, c’est avancer ensemble.",
  "Chaque effort construit demain.",
  "La réussite s’appuie sur la constance et le soutien.",
  "La rééducation, ce n’est pas juste un exercice, c’est un engagement.",
];

document.addEventListener("DOMContentLoaded", () => {
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  const quoteElement = document.querySelector('[data-role="home-quote"]');
  if (quoteElement && QUOTES.length > 0) {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    quoteElement.textContent = randomQuote;
  }
});
