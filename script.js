const storageKey = "virelangues_state";
const phrases = [
  "Angèle et Gilles en gilet gèlent",
  "La grosse cloche sonne",
  "Papier, panier, piano",
  "Piano, panier / panier, piano",
  "Cinq chiens chassent six chats",
  "Suis-je chez ce cher Serge?",
  "Serge cherche à changer son siège",
  "Je suis juché sur sa chaise",
  "Douze douches douces",
  "En haut la banane et en bas l'ananas",
  "La mouche rousse touche la mousse",
  "La charmante Macha mache en marchant",
  "Une toute petite pépite type",
  "Un plat plein de pâtes plates",
  "La robe rouge de Rosalie est ravissante",
  "Gros rat blanc, rat blanc gras, gros rat blanc gras",
  "Croque quatre crevettes crues et quatre crabes creux",
  "Une meule moud mille moules molles",
  "Si ma tata tâte ta tata, ta tata sera tâtée",
  "Son chat Sacha chante sa chanson sans son",
  "Il fait noir ce soir sur le trottoir, bonsoir",
  "Le singe sage passe, le linge sale pince",
  "Une bête noire se baigne dans une baignoire noire",
  "Si sa saucisse sent, ses six cent six saucisses sentent aussi",
  "Des blancs pains, des bancs peints, des bains pleins",
  "Sous chaque seau se cachent six choux",
  "Bol bleu, bulles blêmes, balles blondes",
  "Petits pois font petit appétit",
  "Ces six chauds chocolats-ci sont-ils aussi chauds quand ces six chocolats-là font leurs shows?",
  "Tonton Tati, ton thé a-t-il ôté ta toux?",
  "Qu'a bu l'âne au lac? L'âne au lac a bu l'eau",
  "Mur usé, trou s'y fait, rat s'y met",
  "Foie frit froid et fruits frais frits",
  "Ce bel enfant est grand, aimant, il s'appelle Jean-Clément",
  "Sous l'oie, le toit plat ploie",
  "Un dragon gradé dégrade un gradé dragon",
  "Les libellules pullulent et l'hurluberlu hurle",
  "Je sèche ces cheveux chez ce cher Serge",
  "Dix-huit doigts droits de druides",
  "Jeanne est trop bonne pour être la femme d'un tel jeune homme",
  "Je crois que je vois la croix de bois de Blois",
  "La pipe au papa du pape Pie pue",
  "Écartons ton carton car ton carton nous gêne",
  "Qui hache un chou, cache un chat",
  "Je suis ce que je suis et si je suis ce que je suis, qu'est-ce que je suis?",
  "Qui caquette et qui quête? Kiki quête et Coco caquette",
  "Un chasseur sachant chasser doit savoir chasser sans son chien",
  "Un chasseur qui chassait a fait sécher ses chaussettes sur une souche sèche",
  "Mare y a, cane y but; pie n'osa, chat rit d'elle",
  "Hélas, l'axe de l'os casse et l'as se désaxe l'os",
  "Est-ce chic et chiche, ou chiche et sans chichis?",
  "Qu'écrit Éric? Éric écrit que Kiki crie et rit",
  "Je dis que tu l'as dit lundi à Didi ce que j'ai dit déjà jeudi, juré!",
  "Lady l'a lu, Lola le loue, Lulu le lit et Lola l'a",
  "Mon père est maire, mon frère est masseur",
  "Je veux et j'exige d'exquises excuses",
  "Zaza zézaie, Zizi zozote",
  "Si ça se passe ainsi, c'est sans souci",
  "Pour qui sont ces serpents qui sifflent sur vos têtes?",
  "Hélas, Éliane n'a ni lianes ni liasses",
  "Brosse la bâche, baisse la broche",
  "Les vers verts levèrent le verre vert vers le ver vert",
  "Ta tentative a été totalement futile!",
  "Pauvre petit pêcheur, prends patience pour pouvoir prendre plusieurs petits poissons",
  "Papa, je ne passe pas par le Pas ni par là-bas au Manitoba",
  "Trois ogres ocre griment trois autres ogres d'encre ocre",
  "Un ananas n'a ni nid ni ninas",
  "À qui sont ces skis qui se cassent! Mais qu'est-ce que ces skis qui se cassent?",
  "La nuit réduit le bruit de la pluie sur les tuiles",
  "Plus la pluie plie la pile de piles, plus la pie épie la pile de piles",
  "Trois crabes crus croissent",
  "Ces miches, quiches et biches en broche m'allèchent",
  "Le poivre fait fièvre à la pauvre pieuvre",
  "Dans la gendarmerie, quand un gendarme rit, tous les gendarmes rient dans la gendarmerie",
  "Le chat sauvage se sauve, le chasseur chauve la chasse",
  "Trente étroites truites et trois étroites truites font trente-trois étroites truites",
  "Rat vit riz, rat mit patte à ras; rat mit patte à riz, riz cuit patte à rat",
  "De son échoppe, ses chats s'échappent, se chopent et s'écharpent",
  "Cache le machin truc muche de chose machin chouette et celui de truc machin chose",
  "Cric crac! La cruelle crapule à crête crépue écrase un criquet et le croque cru",
  "Un pâtissier qui pâtissait chez un tapissier qui tapissait, dit un jour au tapissier qui tapissait : \"Vaut-il mieux pâtisser chez un tapissier qui tapisse ou tapisser chez un pâtissier qui pâtisse?\"",
  "Le fondant du bonbon est dans le fond du bonbon",
  "Fendons le bonbon et le fondant du bonbon fendu fond!",
  "Quand la dinde gloutonne glougloute, toutes les poules saoules gloussent",
  "Où niche la pie? La pie niche haut... Où niche l'oie? L'oie niche bas... Où niche l'hibou? L'hibou niche ni haut ni bas!",
  "Que lit Lili sous ces lilas-là? Lili lit l'Iliade",
  "Le drain du frein du train craint le grain et les brins de crin",
  "Seize jacinthes sèchent dans seize sachets secs",
  "Les mots doux sonnent faux dans sa bouche",
  "La roue sur la rue roule; la rue sous la roue reste",
  "Sachez, mon cher Sasha, que Natasha n'attacha pas son chat!",
  "Maman m'a mis ma mains sur mamie, mais mamie m'as mis ma mie dans ma main",
  "Au bout du pont la cane y couve",
  "Trois gros rats gris dans trois gros trous ronds rongent trois gros croûtons ronds",
  "L'harmonica de Monique est en harmonie avec l'harmonium de Monique, car l'harmonium de Monique est harmonieux",
  "Si six cents scies scient six cents saucisses, six cent six scies scieront six cent six saucissons"
];

/**
 * @typedef {Object} StoredState
 * @property {string} date ISO string representing the day of selection
 * @property {string[]} used Array of phrases already used
 * @property {string | null} lastPhrase The most recently displayed phrase
 */

/**
 * Get current day signature (YYYY-MM-DD) to ensure consistent resets.
 * @returns {string}
 */
const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
};

/**
 * Retrieve persisted state from localStorage.
 * @returns {StoredState | null}
 */
const loadState = () => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") {
      return null;
    }
    return {
      date: typeof data.date === "string" ? data.date : "",
      used: Array.isArray(data.used) ? data.used : [],
      lastPhrase: typeof data.lastPhrase === "string" ? data.lastPhrase : null
    };
  } catch (error) {
    console.error("Impossible de charger l'état :", error);
    return null;
  }
};

/**
 * Persist state to localStorage.
 * @param {StoredState} state
 */
const saveState = (state) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error("Impossible d'enregistrer l'état :", error);
  }
};

/**
 * Reset state for a new day.
 * @returns {StoredState}
 */
const resetState = () => {
  const fresh = {
    date: getTodayKey(),
    used: [],
    lastPhrase: null
  };
  saveState(fresh);
  return fresh;
};

/**
 * Select a random phrase not yet used.
 * @param {StoredState} state
 * @returns {string|null}
 */
const getNextPhrase = (state) => {
  const available = phrases.filter((phrase) => !state.used.includes(phrase));
  if (available.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};

/**
 * Animate card on update.
 * @param {HTMLElement} element
 */
const animateCard = (element) => {
  element.classList.remove("fade-enter", "fade-enter-active", "active");
  // Force reflow to restart CSS animations
  void element.offsetWidth;
  element.classList.add("fade-enter");
  requestAnimationFrame(() => {
    element.classList.add("fade-enter-active", "active");
  });
};

const phraseElement = document.getElementById("phrase");
const newPhraseButton = document.getElementById("newPhraseButton");
const resetButton = document.getElementById("resetButton");
const statusElement = document.getElementById("status");

let state = loadState();
const todayKey = getTodayKey();

if (!state || state.date !== todayKey) {
  state = resetState();
}

/**
 * Update the UI with a new phrase.
 * @param {string} phrase
 */
const renderPhrase = (phrase) => {
  phraseElement.textContent = phrase;
  animateCard(phraseElement.parentElement);
};

const updateStatus = () => {
  const remaining = phrases.length - state.used.length;
  if (remaining <= 0) {
    statusElement.textContent =
      "Toutes les phrases ont été affichées aujourd'hui. Réinitialise pour recommencer.";
    newPhraseButton.disabled = true;
    newPhraseButton.setAttribute("aria-disabled", "true");
  } else {
    statusElement.textContent = `${remaining} phrase${remaining > 1 ? "s" : ""} restante${
      remaining > 1 ? "s" : ""
    }`;
    newPhraseButton.disabled = false;
    newPhraseButton.removeAttribute("aria-disabled");
  }
};

const showNextPhrase = () => {
  const phrase = getNextPhrase(state);
  if (!phrase) {
    updateStatus();
    return;
  }
  state.used.push(phrase);
  state.lastPhrase = phrase;
  saveState(state);
  renderPhrase(phrase);
  updateStatus();
};

const scheduleMidnightReset = () => {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = nextMidnight.getTime() - now.getTime();

  window.setTimeout(() => {
    state = resetState();
    renderPhrase("");
    statusElement.textContent = "Nouveau cycle, une phrase arrive...";
    window.requestAnimationFrame(() => {
      showNextPhrase();
    });
    scheduleMidnightReset();
  }, Math.max(msUntilMidnight, 1000));
};

newPhraseButton.addEventListener("click", () => {
  showNextPhrase();
});

resetButton.addEventListener("click", () => {
  state = resetState();
  newPhraseButton.disabled = false;
  newPhraseButton.removeAttribute("aria-disabled");
  statusElement.textContent = "Cycle réinitialisé.";
  showNextPhrase();
});

// Initial render
if (state.lastPhrase) {
  renderPhrase(state.lastPhrase);
  updateStatus();
} else {
  showNextPhrase();
}

scheduleMidnightReset();

window.addEventListener("storage", (event) => {
  if (event.key !== storageKey) {
    return;
  }
  const latest = loadState();
  if (latest && latest.date === getTodayKey()) {
    state = latest;
    if (state.lastPhrase) {
      renderPhrase(state.lastPhrase);
    }
    updateStatus();
  }
});

