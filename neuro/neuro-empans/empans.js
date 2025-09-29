// Configuration de l'application
import { trackExerciseLaunch } from "/shared/js/analytics.js";
import { initFooterYear } from "/shared/js/components.js";
import { saveLatestSession } from "/shared/js/storage.js";

const CONFIG = {
  lettresDisponibles: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "R",
    "S",
    "T",
  ],
  chiffresDisponibles: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  niveauxDifficulte: {
    4: "Débutant",
    5: "Facile",
    6: "Moyen",
    7: "Difficile",
    8: "Expert",
  },
  messagesEncouragement: {
    excellent: "Excellent ! Votre mémoire de travail fonctionne parfaitement !",
    tres_bien: "Très bien ! Vous maîtrisez bien cet exercice !",
    bien: "Bien joué ! Continuez vos efforts !",
    moyen: "Pas mal ! Un peu plus d'entraînement vous aidera !",
    difficile:
      "Ne vous découragez pas ! La pratique améliore les performances !",
  },
  dureeAffichageLettre: 2000,
  dureePauseEntreLettres: 500,
  dureeFeedback: 2000,
  exercicesParSerie: 8,
};

const DIGIT_LABELS = {
  0: "zéro",
  1: "un",
  2: "deux",
  3: "trois",
  4: "quatre",
  5: "cinq",
  6: "six",
  7: "sept",
  8: "huit",
  9: "neuf",
};

const VERSION = "1.0.0";

// État de l'application
let gameState = {
  currentScreen: "home",
  letterCount: 4,
  totalExercises: 8,
  currentExercise: 0,
  score: 0,
  currentSequence: [],
  isDisplayingLetters: false,
  currentLetterIndex: 0,
  symbolType: "letters", // "letters" | "digits"
  soundEnabled: false,
  seriesStartAt: null,
};

// Éléments du DOM - initialisation différée
let elements = {};

const FOCUSABLE_SELECTORS =
  'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let releaseSettingsFocusTrap = null;
let previouslyFocusedElement = null;

// Fonction d'initialisation
function initializeElements() {
  elements = {
    // Écrans
    homeScreen: document.getElementById("home-screen"),
    gameScreen: document.getElementById("game-screen"),
    resultsScreen: document.getElementById("results-screen"),

    // Contrôles d'accueil
    letterCountSelect: document.getElementById("letter-count"),
    startSeriesBtn: document.getElementById("start-series"),
    exerciseCountSelect: document.getElementById("exercise-count"),
    symbolTypeSelect: document.getElementById("symbol-type"),
    enableSoundCheckbox: document.getElementById("enable-sound-checkbox"),
    reverseOrderCheckbox: document.getElementById("reverse-order-checkbox"),

    // Éléments de jeu
    exerciseCounter: document.getElementById("exercise-counter"),
    currentScore: document.getElementById("current-score"),
    letterDisplay: document.getElementById("letter-display"),
    currentLetter: document.getElementById("current-letter"),
    currentLetterAnnouncer: document.getElementById("current-letter-announcer"),
    inputSection: document.getElementById("input-section"),
    userInput: document.getElementById("user-input"),
    userInputLabel: document.getElementById("user-input-label"),
    validateBtn: document.getElementById("validate-answer"),
    feedbackSection: document.getElementById("feedback-section"),
    feedbackMessage: document.getElementById("feedback-message"),
    correctAnswerSpan: document.getElementById("correct-answer"),
    nextExerciseBtn: document.getElementById("next-exercise"),
    restartSeriesBtn: document.getElementById("restart-series"),

    // Éléments de résultats
    finalScore: document.getElementById("final-score"),
    encouragementMessage: document.getElementById("encouragement-message"),
    newSeriesBtn: document.getElementById("new-series"),
    changeLevelBtn: document.getElementById("change-level"),

    // Paramètres
    openSettingsBtn: document.getElementById("open-settings"),
    settingsOverlay: document.getElementById("settings-overlay"),
    settingsDialog: document.querySelector(".settings-dialog"),
    closeSettingsBtn: document.getElementById("close-settings"),
    saveSettingsBtn: document.getElementById("save-settings"),
    inputDurAffichage: document.getElementById("dur-affichage"),
    inputDurPause: document.getElementById("dur-pause"),
    inputDurFeedback: document.getElementById("dur-feedback"),

    notification: document.getElementById("notification"),
    srAnnouncer: document.getElementById("sr-announcer"),
  };

  elements.openSettingsBtn?.setAttribute("aria-expanded", "false");
}

// Gestion des paramètres persistés (localStorage)
const SETTINGS_KEY = "neuro-settings-v1";
const PROGRESS_KEY = "empan_progression"; // historique des séries

function msToSeconds(ms) {
  return Math.round(ms / 100) / 10; // arrondi au 1/10e
}

function secondsToMs(sec) {
  const n = Number(sec);
  return isNaN(n) ? 0 : Math.round(n * 1000);
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (typeof s.dureeAffichageLettre === "number")
      CONFIG.dureeAffichageLettre = s.dureeAffichageLettre;
    if (typeof s.dureePauseEntreLettres === "number")
      CONFIG.dureePauseEntreLettres = s.dureePauseEntreLettres;
    if (typeof s.dureeFeedback === "number")
      CONFIG.dureeFeedback = s.dureeFeedback;
    if (typeof s.soundEnabled === "boolean") {
      gameState.soundEnabled = s.soundEnabled;
      elements.enableSoundCheckbox.checked = s.soundEnabled;
    }
    if (typeof s.reverseOrder === "boolean") {
      gameState.reverseOrder = s.reverseOrder;
      elements.reverseOrderCheckbox.checked = s.reverseOrder;
    }
  } catch (_) {}
}

// Thème: gestion
function saveSettings() {
  const payload = {
    dureeAffichageLettre: CONFIG.dureeAffichageLettre,
    dureePauseEntreLettres: CONFIG.dureePauseEntreLettres,
    dureeFeedback: CONFIG.dureeFeedback,
    reverseOrder: !!gameState.reverseOrder,
    soundEnabled: !!gameState.soundEnabled,
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
    notify("Paramètres enregistrés");
  } catch (e) {
    notify("Impossible d'enregistrer les paramètres", true);
  }
}

function populateSettingsUI() {
  if (!elements.inputDurAffichage) return;
  elements.inputDurAffichage.value = String(
    msToSeconds(CONFIG.dureeAffichageLettre)
  );
  elements.inputDurPause.value = String(
    msToSeconds(CONFIG.dureePauseEntreLettres)
  );
  elements.inputDurFeedback.value = String(msToSeconds(CONFIG.dureeFeedback));
  if (elements.enableSoundCheckbox) {
    elements.enableSoundCheckbox.checked = !!gameState.soundEnabled;
  }
  if (elements.reverseOrderCheckbox) {
    elements.reverseOrderCheckbox.checked = !!gameState.reverseOrder;
  }
}

function applySettingsFromUI() {
  if (!elements.inputDurAffichage) return;
  const aff = secondsToMs(elements.inputDurAffichage.value);
  const pause = secondsToMs(elements.inputDurPause.value);
  const feed = secondsToMs(elements.inputDurFeedback.value);
  // Bornes de sécurité
  CONFIG.dureeAffichageLettre = Math.max(100, aff);
  CONFIG.dureePauseEntreLettres = Math.max(0, pause);
  CONFIG.dureeFeedback = Math.max(300, feed);
  gameState.soundEnabled = !!elements.enableSoundCheckbox?.checked;
  saveSettings();
}

// Fonction pour afficher un écran
function closeSettingsDialog() {
  if (!elements.settingsOverlay) return;
  elements.settingsOverlay.classList.add("hidden");
  elements.settingsOverlay.setAttribute("aria-hidden", "true");
  if (releaseSettingsFocusTrap) {
    releaseSettingsFocusTrap();
    releaseSettingsFocusTrap = null;
  }
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus({ preventScroll: true });
    previouslyFocusedElement = null;
  }
}

function describeRegion(screenName) {
  switch (screenName) {
    case "home":
      return "Écran d'accueil. Configurez votre exercice.";
    case "game":
      return "Exercice en cours. Les symboles vont défiler.";
    case "results":
      return "Résultats de l'exercice.";
    default:
      return "";
  }
}

function showScreen(screenName, options = {}) {
  const { focus = true } = options;
  // Masquer tous les écrans
  if (elements.homeScreen) elements.homeScreen.classList.remove("active");
  if (elements.gameScreen) elements.gameScreen.classList.remove("active");
  if (elements.resultsScreen) elements.resultsScreen.classList.remove("active");

  elements.homeScreen?.classList.add("hidden");
  elements.homeScreen?.setAttribute("aria-hidden", "true");
  elements.gameScreen?.classList.add("hidden");
  elements.gameScreen?.setAttribute("aria-hidden", "true");
  elements.resultsScreen?.classList.add("hidden");
  elements.resultsScreen?.setAttribute("aria-hidden", "true");

  // Par défaut, masquer le bouton paramètres et profil
  if (elements.openSettingsBtn)
    elements.openSettingsBtn.classList.add("hidden");

  const profileFab = document.querySelector(".profile-fab");
  if (profileFab) profileFab.classList.add("hidden");

  // Afficher l'écran demandé
  let regionToFocus = null;
  switch (screenName) {
    case "home":
      if (elements.homeScreen) {
        elements.homeScreen.classList.add("active");
        elements.homeScreen.classList.remove("hidden");
        elements.homeScreen.setAttribute("aria-hidden", "false");
        regionToFocus = elements.homeScreen;
      }
      // Afficher le bouton paramètres et profil uniquement sur l'écran d'accueil
      if (elements.openSettingsBtn)
        elements.openSettingsBtn.classList.remove("hidden");
      if (profileFab) profileFab.classList.remove("hidden");
      break;
    case "game":
      if (elements.gameScreen) {
        elements.gameScreen.classList.add("active");
        elements.gameScreen.classList.remove("hidden");
        elements.gameScreen.setAttribute("aria-hidden", "false");
        regionToFocus = elements.gameScreen;
      }
      break;
    case "results":
      if (elements.resultsScreen) {
        elements.resultsScreen.classList.add("active");
        elements.resultsScreen.classList.remove("hidden");
        elements.resultsScreen.setAttribute("aria-hidden", "false");
        regionToFocus = elements.resultsScreen;
      }
      break;
  }
  if (focus && regionToFocus) {
    focusRegion(regionToFocus);
    requestAnnouncement(describeRegion(screenName));
  }
  gameState.currentScreen = screenName;
}

// Fonction pour commencer une série
function startSeries() {
  gameState.letterCount = parseInt(elements.letterCountSelect?.value || "4");
  gameState.totalExercises = parseInt(
    elements.exerciseCountSelect?.value || String(CONFIG.exercicesParSerie)
  );
  gameState.symbolType = elements.symbolTypeSelect?.value || "letters";
  gameState.soundEnabled = !!elements.enableSoundCheckbox?.checked;
  gameState.reverseOrder = !!elements.reverseOrderCheckbox?.checked;
  gameState.currentExercise = 0;
  gameState.score = 0;
  gameState.seriesStartAt = Date.now();

  showScreen("game");
  // Précharger audio si activé
  // Cacher le bouton recommencer tant qu'on n'est pas en phase de réponse
  if (elements.restartSeriesBtn)
    elements.restartSeriesBtn.classList.add("hidden");
  AudioService.prepareForSeries(gameState)
    .catch((e) => notify(`Audio non disponible: ${e?.message || e}`, true))
    .finally(() => startNewExercise());
}

// Fonction pour commencer un nouvel exercice
function startNewExercise() {
  gameState.currentExercise++;
  gameState.currentSequence = generateRandomSequence(gameState.letterCount);
  gameState.currentLetterIndex = 0;
  gameState.isDisplayingLetters = true;

  // Mettre à jour l'affichage
  updateGameDisplay();

  if (elements.exerciseCounter) {
    const counterText = elements.exerciseCounter.textContent || "";
    const scoreText = elements.currentScore?.textContent || "";
    const announcement = scoreText
      ? `${counterText}. ${scoreText}`
      : counterText;
    requestAnnouncement(announcement);
  }

  // Masquer les sections de saisie et feedback
  if (elements.inputSection) elements.inputSection.classList.remove("active");
  if (elements.feedbackSection)
    elements.feedbackSection.classList.remove("active");

  // Commencer l'affichage des lettres
  setTimeout(() => {
    displayNextLetter();
  }, 1000);

  // Cacher le bouton recommencer pendant l'affichage des symboles
  if (elements.restartSeriesBtn)
    elements.restartSeriesBtn.classList.add("hidden");
}

// Fonction pour générer une séquence aléatoire
function generateRandomSequence(length) {
  const sequence = [];
  const available =
    gameState.symbolType === "digits"
      ? CONFIG.chiffresDisponibles
      : CONFIG.lettresDisponibles;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    sequence.push(available[randomIndex]);
  }
  return sequence;
}

// Fonction pour afficher la lettre suivante
function displayNextLetter() {
  if (gameState.currentLetterIndex < gameState.currentSequence.length) {
    const letter = gameState.currentSequence[gameState.currentLetterIndex];

    if (elements.currentLetter) {
      // Si le son est activé, afficher l'icône speaker au lieu du symbole
      if (gameState.soundEnabled) {
        elements.currentLetter.innerHTML =
          '<span class="speaker-icon">🔊</span>';
      } else {
        elements.currentLetter.textContent = letter;
      }
    }

    if (elements.currentLetterAnnouncer) {
      const label =
        gameState.symbolType === "digits"
          ? DIGIT_LABELS[letter] || letter
          : letter;
      elements.currentLetterAnnouncer.textContent = label;
    }

    // Toujours afficher le symbole/icône pendant dureeAffichageLettre
    const hideTimer = setTimeout(() => {
      if (elements.currentLetter) {
        elements.currentLetter.textContent = "";
        elements.currentLetter.innerHTML = "";
      }
      gameState.currentLetterIndex++;
      setTimeout(() => {
        if (gameState.currentLetterIndex < gameState.currentSequence.length) {
          displayNextLetter();
        } else {
          endLetterDisplay();
        }
      }, CONFIG.dureePauseEntreLettres);
    }, CONFIG.dureeAffichageLettre);

    // Lancer l'audio en parallèle si activé (sans impacter la durée d'affichage)
    if (gameState.soundEnabled) {
      AudioService.playSymbol(letter).catch((e) =>
        notify(`Erreur audio: ${e?.message || e}`, true)
      );
    }
  }
}

// Fonction pour terminer l'affichage des lettres
function endLetterDisplay() {
  gameState.isDisplayingLetters = false;

  // Afficher la section de saisie
  if (elements.inputSection) {
    elements.inputSection.classList.add("active");
    elements.userInput.value = "";

    // Focus et sélection automatique avec délai pour s'assurer que l'élément est visible
    setTimeout(() => {
      elements.userInput.focus();
      elements.userInput.select();
    }, 100);

    if (elements.userInputLabel) {
      const base = elements.userInputLabel.textContent || "";
      const hint =
        gameState.symbolType === "digits"
          ? `Saisissez ${gameState.letterCount} chiffres.`
          : `Saisissez ${gameState.letterCount} lettres.`;
      requestAnnouncement(`${base} ${hint}`.trim());
    }
  }

  // Afficher le bouton recommencer uniquement pendant la phase de réponse
  if (elements.restartSeriesBtn)
    elements.restartSeriesBtn.classList.remove("hidden");
}

// Fonction pour valider la réponse
function validateAnswer() {
  const userAnswer =
    elements.userInput?.value.toUpperCase().replace(/\s/g, "") || "";
  const correctSequence = gameState.reverseOrder
    ? [...gameState.currentSequence].reverse()
    : gameState.currentSequence;
  const correctAnswer = correctSequence.join("");
  const isCorrect = userAnswer === correctAnswer;

  if (isCorrect) {
    gameState.score++;
  }

  showFeedback(isCorrect, correctAnswer);
}

// Fonction pour afficher le feedback
function showFeedback(isCorrect, correctAnswer) {
  // Masquer la section de saisie
  if (elements.inputSection) elements.inputSection.classList.remove("active");

  // Afficher la section de feedback
  if (elements.feedbackSection) {
    elements.feedbackSection.classList.add("active");

    if (elements.feedbackMessage) {
      elements.feedbackMessage.textContent = isCorrect
        ? "Correct !"
        : "Incorrect";
      elements.feedbackMessage.className =
        "feedback-message " + (isCorrect ? "correct" : "incorrect");
      if (elements.feedbackMessage.textContent) {
        requestAnnouncement(elements.feedbackMessage.textContent);
      }
    }

    if (elements.correctAnswerSpan && !isCorrect) {
      elements.correctAnswerSpan.textContent = `Réponse correcte: ${correctAnswer}`;
      elements.correctAnswerSpan.style.display = "block";
      requestAnnouncement(elements.correctAnswerSpan.textContent);
    } else if (elements.correctAnswerSpan) {
      elements.correctAnswerSpan.style.display = "none";
    }
  }

  // Passer automatiquement à l'exercice suivant
  setTimeout(() => {
    if (gameState.currentExercise >= gameState.totalExercises) {
      showResults();
    } else {
      startNewExercise();
    }
  }, CONFIG.dureeFeedback);

  // Cacher le bouton recommencer pendant le feedback
  if (elements.restartSeriesBtn)
    elements.restartSeriesBtn.classList.add("hidden");
}

// Fonction pour mettre à jour l'affichage du jeu
function updateGameDisplay() {
  if (elements.exerciseCounter) {
    elements.exerciseCounter.textContent = `Série ${gameState.currentExercise}/${gameState.totalExercises}`;
  }
  if (elements.currentScore) {
    elements.currentScore.textContent = `Score: ${gameState.score}/${gameState.totalExercises}`;
  }
}

// Fonction pour afficher les résultats
function showResults() {
  const percentage = Math.round(
    (gameState.score / gameState.totalExercises) * 100
  );
  let messageKey;

  if (percentage >= 90) messageKey = "excellent";
  else if (percentage >= 75) messageKey = "tres_bien";
  else if (percentage >= 60) messageKey = "bien";
  else if (percentage >= 40) messageKey = "moyen";
  else messageKey = "difficile";

  showScreen("results");

  if (elements.finalScore) {
    elements.finalScore.textContent = `Score: ${gameState.score}/${gameState.totalExercises}`;
    requestAnnouncement(elements.finalScore.textContent);
  }

  if (elements.encouragementMessage) {
    elements.encouragementMessage.textContent =
      CONFIG.messagesEncouragement[messageKey];
    if (elements.encouragementMessage.textContent) {
      requestAnnouncement(elements.encouragementMessage.textContent);
    }
  }

  // Sauvegarde progression: construire l'entrée et persister (silencieux en cas d'erreur)
  try {
    const durationMs = Math.max(
      0,
      Date.now() - (gameState.seriesStartAt || Date.now())
    );
    const entry = {
      timestamp: new Date().toISOString(),
      type: gameState.symbolType === "digits" ? "chiffres" : "lettres",
      nombreSeries: gameState.totalExercises,
      nombreSymboles: gameState.letterCount,
      modeEcoute: !!gameState.soundEnabled,
      ordreInverse: !!gameState.reverseOrder,
      nbBonnesReponses: gameState.score,
      pourcentageBonnesReponses: percentage,
      dureeComplete: durationMs,
    };

    const history = safeReadProgress();
    history.push(entry);
    const limited = history.slice(-2190); // 2 fois/jour * 365 jours * 3 années
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(limited));
  } catch (_) {
    // Silencieux: localStorage plein ou indisponible
  }

  // Ne plus afficher les derniers scores (UI retirée)

  // Libérer les ressources audio après la série
  AudioService.disposeAfterSeries();
}

// Lecture sécurisée de l'historique (données corrompues -> tableau vide)
function safeReadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

// Affiche les 3 derniers pourcentages sous forme "Derniers scores: 75%, 62%, 87%"
function renderRecentScores() {
  const el = document.getElementById("recent-scores");
  if (!el) return;
  const history = safeReadProgress();
  const lastThree = history.slice(-3).map((h) => h.pourcentageBonnesReponses);
  if (lastThree.length === 0) {
    el.textContent = "";
    return;
  }
  el.textContent = `Derniers scores: ${lastThree.join("% , ")}%`;
}

// Fonction pour recommencer une série
function restartSeries() {
  gameState.currentExercise = 0;
  gameState.score = 0;
  startNewExercise();
}

// Événements
function setupEventListeners() {
  // Bouton commencer une série
  elements.startSeriesBtn?.addEventListener("click", startSeries);

  // Bouton valider réponse
  elements.validateBtn?.addEventListener("click", validateAnswer);

  // Bouton exercice suivant
  elements.nextExerciseBtn?.addEventListener("click", () => {
    if (gameState.currentExercise >= CONFIG.exercicesParSerie) {
      showResults();
    } else {
      startNewExercise();
    }
  });

  // Bouton recommencer série -> retour à l'écran de configuration
  elements.restartSeriesBtn?.addEventListener("click", () => {
    try {
      AudioService.disposeAfterSeries();
    } catch (_) {}
    showScreen("home");
  });

  // Bouton nouvelle série
  elements.newSeriesBtn?.addEventListener("click", () => {
    // Retour à l'écran de configuration (accueil)
    showScreen("home");
  });

  // Export de l'historique en JSON
  const exportBtn = document.getElementById("export-history");
  exportBtn?.addEventListener("click", () => {
    try {
      const history = safeReadProgress();
      const blob = new Blob([JSON.stringify(history, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `empan_progression_${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      notify("Export impossible", true);
    }
  });

  // Bouton changer niveau
  elements.changeLevelBtn?.addEventListener("click", () => {
    showScreen("home");
  });

  // Validation par Entrée dans le champ de saisie
  elements.userInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      validateAnswer();
    }
  });

  // Refocus automatique du champ input quand il devient visible
  elements.userInput?.addEventListener("focus", () => {
    // Sélectionner tout le texte quand le champ reçoit le focus
    setTimeout(() => {
      elements.userInput.select();
    }, 10);
  });

  // Paramètres: ouverture/fermeture/sauvegarde
  elements.openSettingsBtn?.addEventListener("click", () => {
    if (!elements.settingsOverlay || !elements.settingsDialog) return;
    previouslyFocusedElement = document.activeElement;
    populateSettingsUI();
    elements.settingsOverlay.classList.remove("hidden");
    elements.settingsOverlay.setAttribute("aria-hidden", "false");
    trapFocus(elements.settingsDialog);
  });

  elements.closeSettingsBtn?.addEventListener("click", closeSettingsDialog);

  elements.settingsOverlay?.addEventListener("click", (event) => {
    if (event.target === elements.settingsOverlay) {
      closeSettingsDialog();
    }
  });

  elements.saveSettingsBtn?.addEventListener("click", () => {
    applySettingsFromUI();
    closeSettingsDialog();
  });
}

// Initialisation de l'application
function initializeApp() {
  initializeElements();
  loadSettings();
  document.documentElement.setAttribute("data-theme", "dark");
  setupEventListeners();
  showScreen("home", { focus: false });
}

// Démarrage de l'application quand le DOM est chargé
const trainerPanel = document.getElementById("trainer-panel");
const trainerContainer = document.querySelector(".trainer");
const versionElement = document.getElementById("empans-version");

const bootstrap = () => {
  initializeApp();
  initFooterYear();
  if (versionElement) {
    versionElement.textContent = VERSION;
  }
  saveLatestSession({
    id: "empans",
    name: "Empans",
    href: window.location.pathname,
    date: new Date().toISOString(),
  });
  trackExerciseLaunch({ id: "empans", name: "Empans" });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}

// Service Audio (Web Audio API) avec préchargement et synchro
const AudioService = (function () {
  let audioContext = null;
  let letterToBuffer = new Map();
  let outputLatencyMs = 0;
  let preparedForSeries = false;

  async function ensureContext() {
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) throw new Error("Web Audio non supporté");
      audioContext = new Ctx();
    }
    return audioContext;
  }

  function getOutputLatencyMs() {
    // Certaines implémentations exposent baseLatency ou outputLatency
    const base =
      (audioContext &&
        (audioContext.baseLatency || audioContext.outputLatency)) ||
      0;
    return (base || 0) * 1000;
  }

  async function loadBufferForLetter(letter) {
    const url = `medias/${letter}.m4a`;
    const ctx = await ensureContext();
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status} pour ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  function symbolListForState(state) {
    // Précharger les symboles du type sélectionné
    if (state.symbolType === "letters") return CONFIG.lettresDisponibles;
    if (state.symbolType === "digits") return CONFIG.chiffresDisponibles;
    return [];
  }

  async function preloadBuffers(state) {
    const symbols = symbolListForState(state);
    if (symbols.length === 0) return;
    const missing = symbols.filter((s) => !letterToBuffer.has(s));
    if (missing.length === 0) return;
    await ensureContext();
    await Promise.all(
      missing.map(async (s) => {
        try {
          const buf = await loadBufferForLetter(s);
          letterToBuffer.set(s, buf);
        } catch (e) {
          notify(`Échec chargement son ${s}: ${e?.message || e}`, true);
        }
      })
    );
  }

  async function prepareForSeries(state) {
    preparedForSeries = false;
    if (!state.soundEnabled) {
      return; // rien à faire si le son n'est pas utilisé
    }
    await ensureContext();
    outputLatencyMs = getOutputLatencyMs();
    await preloadBuffers(state);
    preparedForSeries = true;
  }

  async function playSymbol(letter) {
    if (!preparedForSeries) return Promise.resolve();
    await ensureContext();
    const buffer = letterToBuffer.get(letter);
    if (!buffer) throw new Error(`Buffer manquant pour ${letter}`);

    return new Promise((resolve, reject) => {
      try {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);

        // Démarrage calé au temps courant + latence de sortie si dispo
        const startAt =
          audioContext.currentTime +
          (audioContext.outputLatency || audioContext.baseLatency || 0);
        source.start(startAt);

        // Résoudre lorsque la lecture est terminée
        source.onended = () => resolve();

        // Sécurité: timeout si aucun onended (certaines implémentations)
        const durationMs = buffer.duration * 1000 + outputLatencyMs + 20;
        setTimeout(() => resolve(), durationMs);
      } catch (e) {
        reject(e);
      }
    });
  }

  function disposeAfterSeries() {
    // On garde les buffers en cache pour la session pour limiter la consommation réseau
    // mais on peut libérer l'AudioContext pour économie d'énergie.
    preparedForSeries = false;
    try {
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    } catch (_) {}
    audioContext = null;
  }

  return {
    prepareForSeries,
    playSymbol,
    disposeAfterSeries,
  };
})();

function notify(message, isError = false) {
  const n = document.getElementById("notification");
  if (!n) return;
  n.textContent = message;
  n.className = isError ? "notification error" : "notification";
  n.style.display = "block";
  clearTimeout(notify._t);
  notify._t = setTimeout(() => {
    n.style.display = "none";
  }, 2500);
}

function focusRegion(region) {
  if (!region) return;
  const cancellable = region.getAttribute("tabindex") === null;
  if (cancellable) region.setAttribute("tabindex", "-1");
  region.focus({ preventScroll: false });
  if (cancellable) {
    region.addEventListener(
      "blur",
      () => {
        region.removeAttribute("tabindex");
      },
      { once: true }
    );
  }
}

function requestAnnouncement(message) {
  if (!message) return;
  if (!elements.srAnnouncer) return;
  elements.srAnnouncer.textContent = "";
  window.requestAnimationFrame(() => {
    elements.srAnnouncer.textContent = message;
  });
}

function trapFocus(container) {
  if (!container) return () => {};
  const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS));
  let createdTabIndex = false;
  if (focusable.length === 0) {
    container.setAttribute("tabindex", "-1");
    container.focus();
    createdTabIndex = true;
  }

  const first = focusable[0] || container;
  const last = focusable[focusable.length - 1] || container;

  function handleKeydown(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  container.addEventListener("keydown", handleKeydown);
  first.focus();

  return () => {
    container.removeEventListener("keydown", handleKeydown);
    if (createdTabIndex) container.removeAttribute("tabindex");
  };
}
