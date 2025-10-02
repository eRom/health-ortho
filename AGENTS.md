# Repository Guidelines

## Project Structure & Module Organization
The site ships as a static bundle served directly from the repository root. `index.html`, `merci.html`, and the domain folders (`ortho/`, `neuro/`) are first-class entry points. Each domain keeps its own page markup, feature script (for example `ortho/ortho.js`), and data source (`exercices_*.js`). Shared UI helpers live in `shared/scripts/ui.js`; global tokens and component styles are under `shared/styles/`, while page-specific CSS sits in `styles/`. Visual assets and icons are in `icons/`, `og-image.png`, and related files at the root.

## Build, Test, and Development Commands
- `python3 -m http.server 4173` — quick local preview from the repo root; visit http://localhost:4173.
- `npx serve .` — optional Node-based static server when you prefer live reload via `serve -l 4173`.
- `npm run lint` does not exist; run manual checks in your editor instead.

## Coding Style & Naming Conventions
Use 2-space indentation for HTML, CSS, and JavaScript. Write ES modules with `const` exports and keep helpers pure (see `shared/scripts/ui.js`). Prefer descriptive `kebab-case` class names and keep data constants in camelCase keys. Copy is in French; preserve accents, tone, and SEO metadata such as `meta description` and `link rel="canonical"`. Keep scripts framework-free and avoid introducing bundlers without discussion.

## Testing Guidelines
Manual testing is the norm: rebuild the relevant page, start a local server, and smoke test navigation, interactive controls, and footer year updates in a Chromium browser. Check the developer console for warnings, run Lighthouse or browser accessibility inspectors when you touch layout, and verify assets load with correct relative paths before shipping.

## Commit & Pull Request Guidelines
Adopt the existing long-form, sentence-case commit style: start with a concise summary in present tense, add context in the body if needed, and mention user-visible outcomes. For pull requests, include: what changed, why it matters, manual test notes (e.g., “Tested `ortho/` locally on Chrome”), links to any tracked issue, and before/after screenshots for UI shifts.

## Content & Localization
Default copy is tailored for francophone rehabilitation professionals. Validate new wording with a native speaker when possible, keep terminology consistent across `ortho/` and `neuro/`, and update structured metadata (Open Graph, Twitter card, JSON-LD) whenever titles or descriptions change.
