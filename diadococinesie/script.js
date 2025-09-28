import { initFooterYear } from "/shared/scripts/ui.js";

const phrases = [
  "tric trac troc",
  "plic plac ploc",
  "flic flac floc",
  "rixe risque",
  "max masque",
  "fixe fisc",
  "obélix obélisque",
  "à toi de jouer",
];

const SESSION_DURATION_MS = 60_000;

const state = {
  remainingMs: SESSION_DURATION_MS,
  timerId: null,
  isRunning: false,
  queue: [],
  queuePosition: 0,
  phrasesCompleted: 0,
  activeIndex: null,
};

const timerDisplay = document.getElementById("timer-display");
const startPauseButton = document.getElementById("start-pause");
const resetButton = document.getElementById("reset");
const currentPhraseText = document.getElementById("current-phrase-text");
const sessionStatsElement = document.getElementById("session-stats");

const shuffleIndices = () => {
  const indices = phrases.map((_, index) => index);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

const updateTimerDisplay = () => {
  if (!timerDisplay) {
    return;
  }
  const totalSeconds = Math.max(0, Math.ceil(state.remainingMs / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
};

const getCurrentCyclePosition = () => {
  const total = phrases.length;
  if (state.phrasesCompleted >= total) {
    return total;
  }
  if (state.isRunning || (state.activeIndex !== null && state.remainingMs < SESSION_DURATION_MS)) {
    return Math.min(state.phrasesCompleted + 1, total);
  }
  return Math.min(state.phrasesCompleted, total);
};

const updateSessionStats = () => {
  if (!sessionStatsElement) {
    return;
  }
  const total = phrases.length;
  if (state.phrasesCompleted >= total && !state.isRunning) {
    sessionStatsElement.textContent = `Cycle terminé : ${total}/${total}`;
    return;
  }
  const current = getCurrentCyclePosition();
  sessionStatsElement.textContent = `Cycle en cours : ${current}/${total}`;
};

const clearTimer = () => {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
};

const prepareQueue = () => {
  state.queue = shuffleIndices();
  state.queuePosition = 0;
};

const prepareCycle = () => {
  prepareQueue();
  state.phrasesCompleted = 0;
  state.activeIndex = null;
};

const applyIdleState = () => {
  clearTimer();
  state.isRunning = false;
  state.remainingMs = SESSION_DURATION_MS;
  updateTimerDisplay();
  startPauseButton.textContent = "Démarrer";
  if (currentPhraseText) {
    currentPhraseText.textContent = "Prêt";
  }
  updateSessionStats();
};

const completeCurrentPhrase = () => {
  if (state.activeIndex !== null) {
    state.phrasesCompleted = Math.min(state.phrasesCompleted + 1, phrases.length);
  }
  state.activeIndex = null;
  applyIdleState();
};

const handleTimerTick = () => {
  state.remainingMs -= 1000;
  if (state.remainingMs <= 0) {
    completeCurrentPhrase();
    if (state.phrasesCompleted >= phrases.length) {
      // Cycle terminé, attendre une nouvelle relance
      prepareCycle();
    }
  } else {
    updateTimerDisplay();
  }
};

const startTimer = () => {
  clearTimer();
  state.timerId = window.setInterval(handleTimerTick, 1000);
};

const startNewPhrase = () => {
  const total = phrases.length;
  if (state.phrasesCompleted >= total) {
    state.phrasesCompleted = 0;
    prepareQueue();
  }
  if (state.queue.length === 0 || state.queuePosition >= state.queue.length) {
    prepareQueue();
  }

  const nextIndex = state.queue[state.queuePosition];
  state.queuePosition += 1;
  state.activeIndex = nextIndex;
  if (currentPhraseText) {
    currentPhraseText.textContent = phrases[nextIndex];
  }
  state.remainingMs = SESSION_DURATION_MS;
  state.isRunning = true;
  startPauseButton.textContent = "Pause";
  updateTimerDisplay();
  updateSessionStats();
  startTimer();
};

const resumePhrase = () => {
  if (state.activeIndex === null || state.isRunning) {
    return;
  }
  state.isRunning = true;
  startPauseButton.textContent = "Pause";
  updateSessionStats();
  startTimer();
};

const pausePhrase = () => {
  if (!state.isRunning) {
    return;
  }
  state.isRunning = false;
  startPauseButton.textContent = "Démarrer";
  clearTimer();
  updateSessionStats();
};

const resetSession = () => {
  clearTimer();
  prepareCycle();
  applyIdleState();
};

const handleStartPause = () => {
  if (state.isRunning) {
    pausePhrase();
    return;
  }

  if (state.activeIndex !== null && state.remainingMs > 0 && state.remainingMs < SESSION_DURATION_MS) {
    resumePhrase();
    return;
  }

  startNewPhrase();
};

const bootstrap = () => {
  if (!timerDisplay || !startPauseButton || !resetButton || !currentPhraseText) {
    return;
  }

  resetSession();
  initFooterYear();

  startPauseButton.addEventListener("click", handleStartPause);
  resetButton.addEventListener("click", resetSession);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}


