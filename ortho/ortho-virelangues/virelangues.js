import { trackExerciseLaunch } from "/shared/js/analytics.js";
import { initFooterYear } from "/shared/js/components.js";
import { saveLatestSession } from "/shared/js/storage.js";

const STORAGE_KEY = "virelangues_state";
const DATA_URL = "/ortho/ortho-virelangues/virelangues-data/phrases.json";
const VERSION = "1.0.0";

/**
 * @typedef {Object} StoredState
 * @property {string} date
 * @property {string[]} used
 * @property {string | null} lastPhrase
 */

const SELECTORS = {
  phrase: "phrase",
  status: "status",
  footerYear: "footer-year",
  version: "virelangues-version",
  newPhraseButton: "newPhraseButton",
  resetButton: "resetButton",
};

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
};

const fetchPhrases = async () => {
  const response = await fetch(DATA_URL, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Impossible de charger les phrases (${response.status})`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

const loadState = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return {
      date: typeof parsed.date === "string" ? parsed.date : "",
      used: Array.isArray(parsed.used) ? parsed.used : [],
      lastPhrase: typeof parsed.lastPhrase === "string" ? parsed.lastPhrase : null,
    };
  } catch (error) {
    console.warn("Impossible de charger l'état", error);
    return null;
  }
};

const saveState = (state) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Impossible d'enregistrer l'état", error);
  }
};

const resetState = () => {
  const fresh = {
    date: getTodayKey(),
    used: [],
    lastPhrase: null,
  };
  saveState(fresh);
  return fresh;
};

const getNextPhrase = (state, phrases) => {
  const available = phrases.filter((phrase) => !state.used.includes(phrase));
  if (available.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};

const setVersion = () => {
  const versionElement = document.getElementById(SELECTORS.version);
  if (versionElement) {
    versionElement.textContent = VERSION;
  }
};

const updateStatus = (state, phrases) => {
  const statusElement = document.getElementById(SELECTORS.status);
  const newPhraseButton = document.getElementById(SELECTORS.newPhraseButton);
  if (!statusElement || !newPhraseButton) {
    return;
  }
  const remaining = phrases.length - state.used.length;
  if (remaining <= 0) {
    statusElement.textContent =
      "Toutes les phrases ont été affichées aujourd'hui. Réinitialisez pour recommencer.";
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

const renderPhrase = (phrase) => {
  const phraseElement = document.getElementById(SELECTORS.phrase);
  if (!phraseElement) {
    return;
  }
  phraseElement.textContent = phrase;
  phraseElement.classList.remove("fade-enter", "active");
  void phraseElement.offsetWidth;
  phraseElement.classList.add("fade-enter", "active");
  window.requestAnimationFrame(() => {
    phraseElement.classList.add("fade-enter-active");
  });
};

const showNextPhrase = (state, phrases) => {
  const phrase = getNextPhrase(state, phrases);
  if (!phrase) {
    updateStatus(state, phrases);
    return;
  }
  state.used.push(phrase);
  state.lastPhrase = phrase;
  saveState(state);
  renderPhrase(phrase);
  updateStatus(state, phrases);
  saveLatestSession({
    id: "virelangues",
    name: "Virelangues",
    href: window.location.pathname,
    date: new Date().toISOString(),
  });
  trackExerciseLaunch({ id: "virelangues", name: "Virelangues" });
};

const scheduleMidnightReset = (state, setState, phrases) => {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = Math.max(nextMidnight.getTime() - now.getTime(), 1000);
  window.setTimeout(() => {
    const fresh = resetState();
    setState(fresh);
    renderPhrase("Une nouvelle phrase arrive…");
    updateStatus(fresh, phrases);
    window.requestAnimationFrame(() => {
      showNextPhrase(fresh, phrases);
    });
    scheduleMidnightReset(fresh, setState, phrases);
  }, msUntilMidnight);
};

const bindControls = (stateRef, phrases, setState) => {
  const newPhraseButton = document.getElementById(SELECTORS.newPhraseButton);
  const resetButton = document.getElementById(SELECTORS.resetButton);
  if (newPhraseButton) {
    newPhraseButton.addEventListener("click", () => {
      showNextPhrase(stateRef.current, phrases);
    });
  }
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const fresh = resetState();
      setState(fresh);
      renderPhrase("Cycle réinitialisé. Une nouvelle phrase arrive.");
      updateStatus(fresh, phrases);
      window.requestAnimationFrame(() => {
        showNextPhrase(fresh, phrases);
      });
    });
  }
};

const bootstrap = async () => {
  initFooterYear(SELECTORS.footerYear);
  setVersion();

  let phrases = [];
  try {
    phrases = await fetchPhrases();
  } catch (error) {
    renderPhrase("Impossible de charger les virelangues. Vérifiez votre connexion.");
    console.error(error);
    return;
  }

  const stateRef = { current: loadState() };
  if (!stateRef.current || stateRef.current.date !== getTodayKey()) {
    stateRef.current = resetState();
  }

  const setState = (next) => {
    stateRef.current = next;
  };

  updateStatus(stateRef.current, phrases);
  if (stateRef.current.lastPhrase) {
    renderPhrase(stateRef.current.lastPhrase);
  } else {
    showNextPhrase(stateRef.current, phrases);
  }
  bindControls(stateRef, phrases, setState);
  scheduleMidnightReset(stateRef.current, setState, phrases);

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }
    const latest = loadState();
    if (!latest) {
      return;
    }
    setState(latest);
    if (latest.lastPhrase) {
      renderPhrase(latest.lastPhrase);
    }
    updateStatus(latest, phrases);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
