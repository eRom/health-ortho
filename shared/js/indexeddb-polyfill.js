/* IndexedDB minimal polyfill for IE11 */
(function () {
  if (!('indexedDB' in window) && 'webkitIndexedDB' in window) {
    window.indexedDB = window.webkitIndexedDB;
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
  }
})();

