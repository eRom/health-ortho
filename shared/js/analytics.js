const ANALYTICS_STORAGE_KEY = "mpr_analytics_events";

const safeRead = () => {
  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Impossible de lire les analytics", error);
    return [];
  }
};

const safeWrite = (events) => {
  try {
    window.localStorage.setItem(
      ANALYTICS_STORAGE_KEY,
      JSON.stringify(events.slice(-200)),
    );
  } catch (error) {
    console.warn("Impossible d'enregistrer les analytics", error);
  }
};

const recordEvent = (type, payload = {}) => {
  const events = safeRead();
  events.push({
    type,
    payload,
    timestamp: new Date().toISOString(),
  });
  safeWrite(events);
};

export const trackHomeVisit = () => {
  recordEvent("home_visit");
};

export const trackExerciseLaunch = ({ id, name }) => {
  recordEvent("exercise_launch", { id, name });
};

export const trackError = (error) => {
  recordEvent("error", { message: error?.message ?? String(error) });
};
