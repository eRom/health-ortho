# Plateforme MPR Nantes

Solution web de rééducation orthophonique et neuropsychologique, optimisée pour un usage patient/thérapeute en production.

## Structure

```
/
├── index.html / index.css / index.js
├── shared/
│   ├── css/variables.css, layout.css, components.css, accessibility.css
│   ├── js/components.js, utils.js, storage.js, analytics.js
│   └── data/exercises.js
├── ortho/
│   ├── ortho.html / ortho.css / ortho.js
│   └── ortho-virelangues/, ortho-diadococinesies/
└── neuro/
    ├── neuro.html / neuro.css / neuro.js
    └── neuro-empans/
```

## Installation

```bash
npm install
# Servir via un http-server standard
```

## Scripts

- `index.js` : page d'accueil, rendu dynamique des plateformes, service worker auto.
- `shared/js/*` : composants, utils (Observable), storage (localStorage/IndexedDB), analytics.
- `service-worker.js` : cache offline + fallback.

## Tests

Tests unitaires TODO (`tests/`), recommandation Jest.

## Déploiement

1. Compiler/minifier CSS/JS si nécessaire.
2. Déployer le dossier sur un hébergeur statique configuré avec `.htaccess`.
3. Vérifier `manifest.json`, tests Lighthouse > 90.

## Données

- `shared/data/exercises.js` centralise les exercices.
- Les sous-modules chargent leurs JSON (`phrases.json`, `syllabes.json`, etc.).

## Accessibilité & Performance

- Mode sombre, contrastes > WCAG 2.1 AA.
- Navigation clavier + skip links.
- `prefers-reduced-motion` synchronisé.
- Service worker + offline page.
