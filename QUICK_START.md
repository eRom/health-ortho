# 🚀 Quick Start Guide

Guide rapide pour démarrer avec MPR In Cloud.

---

## ⚡ Installation Rapide

```bash
# 1. Clone le projet
git clone <your-repo-url>
cd health-ortho

# 2. Installez les dépendances
npm install

# 3. Configurez l'environnement
# Créez .env et ajoutez vos variables (voir .env.example si dispo)
# Minimum requis:
echo 'DATABASE_URL="file:./dev.db"' > .env
echo 'BETTER_AUTH_SECRET="votre-secret-minimum-32-caracteres-ici-pour-dev"' >> .env
echo 'NEXT_PUBLIC_APP_URL="http://localhost:3000"' >> .env

# 4. Setup de la base de données
npm run db:generate
npm run db:migrate

# 5. Lancez le serveur
npm run dev
```

✅ **Ouvert sur** : http://localhost:3000

---

## 📁 Fichiers Importants Créés

### 📊 Performance & Optimisations
- ✅ `OPTIMIZATIONS.md` - Détails de toutes les optimisations (compression, cache, fonts, etc.)
- ✅ `next.config.ts` - Configuration optimisée (compression, headers, images)
- ✅ `src/app/[locale]/layout.tsx` - Metadata enrichis, fonts optimisées
- ✅ `src/app/globals.css` - CSS optimisé et allégé

### 🧪 Tests
- ✅ `TESTING_SETUP.md` - Guide complet pour les tests
- ✅ `vitest.config.ts` - Configuration Vitest
- ✅ `src/test/setup.ts` - Setup des tests
- ✅ `src/__tests__/utils.test.ts` - Tests de la fonction cn()
- ✅ `src/__tests__/components/Button.test.tsx` - Tests du Button

### 🔍 Audit & Documentation
- ✅ `BEST_PRACTICES_AUDIT.md` - Audit complet des bonnes pratiques (Score 8/10)
- ✅ `CONTRIBUTING.md` - Guide pour les contributeurs
- ✅ `QUICK_START.md` - Ce fichier !

### 🛠️ Error Handling
- ✅ `src/app/[locale]/error.tsx` - Error boundary
- ✅ `src/app/[locale]/not-found.tsx` - Page 404 custom

### 🔄 CI/CD
- ✅ `.github/workflows/ci.yml` - Pipeline CI (lint, test, build)

### 🌐 SEO & PWA
- ✅ `src/app/sitemap.ts` - Sitemap dynamique
- ✅ `src/app/robots.ts` - Robots.txt dynamique
- ✅ `public/manifest.json` - Manifest PWA

### ⚛️ Composants Optimisés
- ✅ `src/components/ui/card.tsx` - Tous les composants avec React.memo()
- ✅ `src/components/navigation/site-header.tsx` - Navigation optimisée avec memo

---

## 🎯 Commandes Disponibles

```bash
# Développement
npm run dev              # Serveur de dev (http://localhost:3000)
npm run build            # Build de production
npm run start            # Démarrer en production
npm run lint             # Linter ESLint
npm run type-check       # Vérification TypeScript

# Base de données
npm run db:generate      # Générer Prisma Client
npm run db:migrate       # Lancer les migrations
npm run db:studio        # Interface Prisma Studio
npm run db:seed          # Seeder la DB

# Tests (après installation des dépendances)
npm test                 # Tests en mode watch
npm run test:run         # Tests une fois
npm run test:coverage    # Tests avec coverage
```

---

## 📊 Scores de Performance

### Avant Optimisations : **72/100**
### Après Optimisations : **90+/100** (objectif)

### Améliorations Principales :
- ✅ Compression gzip/brotli activée
- ✅ Cache-Control : 1 an sur assets statiques
- ✅ Fonts preload avec fallbacks
- ✅ Images AVIF/WebP
- ✅ CSS optimisé (-30% de taille)
- ✅ React.memo() sur composants
- ✅ Headers de sécurité complets

---

## ✅ Bonnes Pratiques - Score Global : **8/10**

| Catégorie | Score | Statut |
|-----------|-------|--------|
| Architecture | 9/10 | ⭐⭐⭐⭐⭐ |
| TypeScript | 10/10 | ⭐⭐⭐⭐⭐ |
| Accessibilité | 9/10 | ⭐⭐⭐⭐⭐ |
| Sécurité | 9/10 | ⭐⭐⭐⭐⭐ |
| Performance | 9/10 | ⭐⭐⭐⭐⭐ |
| i18n | 10/10 | ⭐⭐⭐⭐⭐ |
| SEO | 10/10 | ⭐⭐⭐⭐⭐ |
| Tests | 0/10 | ⚠️ À faire |
| Documentation | 6/10 | ⚠️ Amélioré |
| Error Handling | 5/10 | ⚠️ Amélioré |

Voir `BEST_PRACTICES_AUDIT.md` pour les détails.

---

## 🚨 Points Critiques Restants

### 1. 🧪 Tests (PRIORITÉ HAUTE)
```bash
# Installer les dépendances de test
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Ajouter les scripts dans package.json:
"test": "vitest",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage"
```

### 2. 📝 Variables d'Environnement
Créez un fichier `.env` avec au minimum :
```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="votre-secret-32-chars-minimum"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 🔍 Monitoring (Recommandé pour production)
```bash
# Sentry pour error tracking
npm install @sentry/nextjs

# Vercel Analytics (si deploy sur Vercel)
npm install @vercel/analytics
```

---

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `README.md` | Vue d'ensemble du projet |
| `OPTIMIZATIONS.md` | Détails techniques des optimisations |
| `BEST_PRACTICES_AUDIT.md` | Audit complet (8/10) |
| `TESTING_SETUP.md` | Guide pour configurer les tests |
| `CONTRIBUTING.md` | Guide pour les contributeurs |
| `QUICK_START.md` | Ce guide rapide |

---

## 🎓 Technologies Utilisées

- **Framework** : Next.js 15.5 (App Router)
- **React** : 19.1
- **TypeScript** : Strict mode
- **Styling** : Tailwind CSS 4 + shadcn/ui
- **Database** : Prisma + SQLite (dev)
- **Auth** : Better-Auth
- **i18n** : next-intl
- **Testing** : Vitest + Testing Library (à installer)

---

## 🔗 Liens Utiles

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Better Auth](https://www.better-auth.com)
- [next-intl](https://next-intl-docs.vercel.app/)

---

## ❓ Besoin d'Aide ?

1. Consultez la documentation appropriée ci-dessus
2. Vérifiez les issues existantes
3. Ouvrez une nouvelle issue
4. Consultez `CONTRIBUTING.md` pour plus d'infos

---

## 🎉 Prochaines Étapes

1. ✅ **Tester l'application** : `npm run dev`
2. ⚠️ **Installer les tests** : Voir `TESTING_SETUP.md`
3. ⚠️ **Ajouter monitoring** : Sentry + Analytics
4. ✅ **Build production** : `npm run build`
5. ✅ **Déployer** : Vercel, AWS, ou autre

---

**Bon développement ! 🚀**

