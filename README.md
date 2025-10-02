# Health Ortho — Refonte Next.js

Ce dépôt héberge la refonte Next.js de la plateforme MPR de Nantes. Le projet utilise l'App Router, TypeScript et shadcn/ui pour proposer une expérience sombre mobile-first, conforme WCAG 2.1 AA, avec internationalisation (FR prioritaire, EN disponible).

## Scripts disponibles

- `npm run dev` — lance le serveur Next.js en mode développement.
- `npm run build` — génère la version de production.
- `npm run start` — démarre le serveur de production local.
- `npm run lint` — exécute la configuration ESLint fournie par Next.js.
- `npm run db:migrate` — applique les migrations Prisma (SQLite par défaut).
- `npm run db:generate` — régénère le client Prisma après modification du schéma.
- `npm run db:studio` — ouvre Prisma Studio pour explorer les données.
- `npm run db:seed` — (re)crée le compte démo via Better Auth.

Les scripts de tests (Vitest, Playwright) seront ajoutés au fur et à mesure.

## Authentification

- Better Auth gère la session avec stockage SQLite via Prisma (`prisma/schema.prisma`).
- Trois modes de connexion sont prévus : e-mail/mot de passe, Google OAuth et Apple Sign In.
- Renseigne les variables correspondantes dans `.env` à partir de `.env.example` (`BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_*`, `APPLE_*`, etc.).
- L'UI de connexion (`src/app/[locale]/(auth)/auth/login/page.tsx`) consomme le client `better-auth/react` exposé dans `src/lib/auth-client.ts`.
- Le header global affiche l'état de session (nom, logout) en utilisant le hook `useSession`.
- Après configuration, exécute `npm run db:seed` pour générer le compte démo (`romain.ecarnot@gmail.com` / `mprnantes`).

## Architecture en cours

- `src/app` — routes App Router (landing, auth, dashboard, modules, etc.).
- `legacy-site/` — sauvegarde du site statique historique utilisée pour la migration des contenus.
- `public/` — assets publics (icônes, manifestes, médias).
- `src/lib`, `src/components`, `src/data`, `src/locales` — dossiers à venir pour la logique métier, les composants et l'i18n.

## Prochaines étapes

1. Initialiser shadcn/ui et le thème sombre d'inspiration iOS.
2. Mettre en place l'internationalisation FR/EN.
3. Recréer les parcours Landing → Auth → Dashboard → Exercices + Statistiques.
4. Ajouter la couche SEO/PWA et les tests Vitest/Playwright.

La documentation détaillée (installation, déploiement, QA) sera complétée en parallèle de l'avancement.
