import { createObservable } from './utils.js';

const historySupported = typeof window !== 'undefined' && 'history' in window && 'pushState' in window.history;

/**
 * Simple router basé sur History API.
 */
export function createRouter(initialPath = window.location.pathname) {
  const state = createObservable({ path: initialPath });

  if (historySupported) {
    window.addEventListener('popstate', () => {
      state.set({ path: window.location.pathname });
    });
  }

  return {
    subscribe: state.subscribe,
    navigate(path) {
      if (historySupported) {
        window.history.pushState({}, '', path);
      } else {
        window.location.href = path;
      }
      state.set({ path });
    },
    getPath() {
      return state.get().path;
    },
  };
}

export default { createRouter };

