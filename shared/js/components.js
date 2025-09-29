/**
 * Initialise l'année dynamique du pied de page.
 * @param {string} elementId
 */
export const initFooterYear = (elementId = "footer-year") => {
  const footerYearElement = document.getElementById(elementId);
  if (!footerYearElement) {
    return;
  }
  footerYearElement.textContent = String(new Date().getFullYear());
};

/**
 * Créé un élément DOM avec options raccourcies.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {{
 *   className?: string,
 *   textContent?: string,
 *   attrs?: Record<string, string>,
 * }} [options]
 * @param {(HTMLElement | Text)[]} [children]
 * @returns {HTMLElementTagNameMap[K]}
 */
export const createElement = (tag, options = {}, children = []) => {
  const element = document.createElement(tag);
  if (options.className) {
    element.className = options.className;
  }
  if (options.textContent) {
    element.textContent = options.textContent;
  }
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  children.forEach((child) => {
    element.appendChild(child);
  });
  return element;
};

