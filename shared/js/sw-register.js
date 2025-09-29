const SW_PATH = '/service-worker.js';

/**
 * Enregistre le service worker pour activer le mode offline.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(SW_PATH)
      .then((registration) => {
        console.info('Service worker actif', registration.scope);
      })
      .catch((error) => {
        console.error('Échec enregistrement service worker', error);
      });
  });
}

export default { registerServiceWorker };

