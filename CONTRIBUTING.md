# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **MPR In Cloud** ! Ce guide vous aidera à démarrer.

---

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Setup du Projet](#setup-du-projet)
- [Standards de Code](#standards-de-code)
- [Process de Pull Request](#process-de-pull-request)
- [Structure du Projet](#structure-du-projet)

---

## 🤝 Code de Conduite

Ce projet suit un code de conduite. En participant, vous vous engagez à maintenir un environnement respectueux et inclusif.

---

## 🚀 Comment Contribuer

### Signaler un Bug 🐛

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](../../issues)
2. Ouvrez une nouvelle issue avec le template "Bug Report"
3. Incluez :
   - Description claire du problème
   - Steps to reproduce
   - Comportement attendu vs actuel
   - Captures d'écran si pertinent
   - Environnement (OS, navigateur, version Node)

### Proposer une Fonctionnalité ✨

1. Ouvrez une issue avec le template "Feature Request"
2. Expliquez :
   - Le problème que ça résout
   - La solution proposée
   - Des alternatives envisagées

### Soumettre du Code 💻

1. Fork le repository
2. Créez une branche depuis `main`
3. Faites vos modifications
4. Soumettez une Pull Request

---

## 🛠️ Setup du Projet

### Prérequis

- **Node.js** 20+ 
- **npm** 10+
- **SQLite** (pour dev local)

### Installation

```bash
# Clone le repository
git clone https://github.com/votre-username/health-ortho.git
cd health-ortho

# Installez les dépendances
npm install

# Générez Prisma Client
npm run db:generate

# Créez le fichier .env
cp .env.example .env
# Éditez .env avec vos valeurs

# Lancez les migrations
npm run db:migrate

# Seedez la base (optionnel)
npm run db:seed

# Lancez le serveur de dev
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

---

## 📐 Standards de Code

### TypeScript

- **Type-safety strict** : pas de `any`
- **Interfaces** pour les props
- **Types explicites** sur les fonctions publiques

```typescript
// ✅ Bon
interface UserProps {
  name: string;
  email: string;
}

function greetUser({ name, email }: UserProps): string {
  return `Hello ${name}`;
}

// ❌ Mauvais
function greetUser(user: any) {
  return `Hello ${user.name}`;
}
```

### React

- **Server Components** par défaut
- **"use client"** seulement si nécessaire
- **React.memo()** pour composants purs et coûteux
- **Hooks personnalisés** dans `src/hooks/`

```typescript
// ✅ Server Component (par défaut)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Client Component (si nécessaire)
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  // ...
}
```

### Naming Conventions

```
✅ Components: PascalCase (Button.tsx, UserProfile.tsx)
✅ Hooks: camelCase avec use prefix (useAuth.ts, useLocalStorage.ts)
✅ Utils: camelCase (formatDate.ts, cn.ts)
✅ Types: PascalCase (User, UserProfile, ButtonProps)
✅ Constants: SCREAMING_SNAKE_CASE (MAX_RETRY, API_URL)
```

### CSS / Tailwind

- **Utility-first** approach
- **cn()** pour merger les classes
- **Éviter** les styles inline sauf cas particulier
- **Responsive** : mobile-first (sm:, md:, lg:)

```tsx
// ✅ Bon
<button className={cn(
  "rounded-lg px-4 py-2",
  "hover:bg-primary/90",
  "sm:px-6 sm:py-3",
  isPrimary && "bg-primary text-white"
)}>
  Click me
</button>
```

### Commits

Format : [Conventional Commits](https://www.conventionalcommits.org/)

```bash
feat: add user profile page
fix: correct button alignment in header
docs: update README with new setup steps
style: format code with prettier
refactor: simplify auth logic
test: add tests for Button component
chore: update dependencies
```

---

## 🔄 Process de Pull Request

### Avant de Soumettre

- [ ] Code compile sans erreurs (`npm run build`)
- [ ] Linter passe (`npm run lint`)
- [ ] Type-check passe (`npm run type-check`)
- [ ] Tests passent (`npm run test:run`)
- [ ] Tests ajoutés si nouvelle fonctionnalité
- [ ] Documentation mise à jour si nécessaire

### PR Checklist

1. **Titre clair** : décrit ce que fait la PR
2. **Description** : 
   - Qu'est-ce qui change ?
   - Pourquoi ?
   - Comment tester ?
3. **Captures d'écran** : si changement UI
4. **Tests** : couvrent les nouvelles fonctionnalités
5. **Pas de conflits** : rebased sur main récent

### Template de PR

```markdown
## 📝 Description
Brief description of what this PR does

## 🎯 Type de Changement
- [ ] 🐛 Bug fix
- [ ] ✨ Nouvelle fonctionnalité
- [ ] 💥 Breaking change
- [ ] 📝 Documentation

## 🧪 Comment Tester
1. Step 1
2. Step 2
3. Expected result

## 📸 Screenshots
(si applicable)

## ✅ Checklist
- [ ] Code compile
- [ ] Tests passent
- [ ] Documentation mise à jour
- [ ] Changements testés localement
```

---

## 📁 Structure du Projet

```
health-ortho/
├── prisma/              # Database schema & migrations
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── [locale]/   # i18n routes
│   │   │   ├── (app)/  # Protected routes
│   │   │   ├── (auth)/ # Auth routes
│   │   │   └── (site)/ # Public routes
│   │   └── api/        # API routes
│   ├── components/     # React components
│   │   ├── ui/         # UI primitives
│   │   └── navigation/ # Navigation components
│   ├── lib/            # Utilities & config
│   │   ├── auth/       # Auth config
│   │   └── i18n/       # i18n config
│   ├── locales/        # Translations (fr, en)
│   └── __tests__/      # Tests
└── ...config files
```

### Où Placer Votre Code ?

| Type | Dossier |
|------|---------|
| Nouvelle page | `src/app/[locale]/(group)/` |
| Composant réutilisable | `src/components/` |
| Composant UI primitif | `src/components/ui/` |
| Hook custom | `src/hooks/` |
| Utility function | `src/lib/` |
| Type global | `src/types/` |
| Test | `src/__tests__/` |

---

## 🧪 Tests

### Lancer les Tests

```bash
# Mode watch
npm test

# Une fois
npm run test:run

# Avec coverage
npm run test:coverage
```

### Écrire des Tests

Voir [TESTING_SETUP.md](./TESTING_SETUP.md) pour plus de détails.

---

## 🎨 Style Guide

### Imports

```typescript
// Order: React → Third-party → Local
import { useState } from "react";
import { clsx } from "clsx";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### Composants

```typescript
// Export par défaut pour les pages/layouts
export default function Page() { ... }

// Export nommé pour les composants réutilisables
export function Button() { ... }
export const Card = () => { ... };
```

---

## ❓ Questions ?

- Ouvrez une [Discussion](../../discussions)
- Rejoignez notre Discord (si applicable)
- Contactez les mainteneurs

---

## 📜 Licence

En contribuant, vous acceptez que votre code soit distribué sous la même licence que le projet.

---

**Merci de contribuer ! 🙏**

