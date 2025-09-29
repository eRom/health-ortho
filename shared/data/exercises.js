/**
 * Catalogue centralisé des exercices de l'application.
 * Chaque entrée décrit la plateforme cible, les liens et le module associé.
 */

/**
 * @typedef {Object} Exercise
 * @property {string} id Identifiant unique (slug)
 * @property {"ortho"|"neuro"} domain Domaine thérapeutique
 * @property {string} name Nom affiché
 * @property {string} description Résumé de l'exercice
 * @property {string[]} tags Mots-clés utilisés pour les filtres
 * @property {string} level Niveau recommandé
 * @property {string} href URL de l'exercice
 * @property {string} [statsHref] URL vers la page de statistiques
 * @property {string} [dataHref] URL vers les données JSON exploitées par l'exercice
 */

/**
 * Liste exhaustive des exercices disponibles, regroupés par plateforme.
 * @type {{ ortho: Exercise[]; neuro: Exercise[] }}
 */
export const EXERCISES_BY_DOMAIN = {
  ortho: [
    {
      id: "virelangues",
      domain: "ortho",
      name: "Virelangues",
      description:
        "Tirage quotidien de virelangues sans répétition pour travailler l'élocution, la diction et l'articulation.",
      href: "/ortho/ortho-virelangues/virelangues.html",
      statsHref: "/ortho/ortho-virelangues/virelangues.stats.html",
      dataHref: "/ortho/ortho-virelangues/virelangues-data/phrases.json",
      tags: ["diction", "élocution", "articulation"],
      level: "Tous niveaux",
    },
    {
      id: "diadococinesies",
      domain: "ortho",
      name: "Diadococinésies",
      description:
        "Séquences syllabiques chronométrées d'une minute pour renforcer la coordination articulatoire.",
      href: "/ortho/ortho-diadococinesies/diadococinesies.html",
      statsHref: "/ortho/ortho-diadococinesies/diadococinesies.stats.html",
      dataHref: "/ortho/ortho-diadococinesies/diadococinesies-data/syllabes.json",
      tags: ["coordination", "rythme", "articulation"],
      level: "Intermédiaire",
    },
  ],
  neuro: [
    {
      id: "empans",
      domain: "neuro",
      name: "Empans",
      description:
        "Entraînement mémoire & attention basé sur des suites de lettres ou de chiffres à restituer dans l'ordre ou l'inverse.",
      href: "/neuro/neuro-empans/empans.html",
      statsHref: "/neuro/neuro-empans/empans.stats.html",
      dataHref: "/neuro/neuro-empans/empans-data/index.json",
      tags: ["mémoire de travail", "attention"],
      level: "Tous niveaux",
    },
  ],
};

/**
 * Toutes les plateformes (domains) disponibles.
 * @type {Array<Exercise & { domain: "ortho"|"neuro" }>}
 */
export const ALL_EXERCISES = Object.values(EXERCISES_BY_DOMAIN).flat();

/**
 * Retourne la liste des exercices pour un domaine donné.
 * @param {"ortho"|"neuro"} domain
 * @returns {Exercise[]}
 */
export const getExercisesByDomain = (domain) => {
  return EXERCISES_BY_DOMAIN[domain] ?? [];
};

/**
 * Retrouve un exercice par son identifiant.
 * @param {string} id
 * @returns {Exercise | undefined}
 */
export const findExerciseById = (id) => {
  return ALL_EXERCISES.find((exercise) => exercise.id === id);
};

/**
 * Prépare les cartes à afficher sur la page d'accueil.
 * @returns {Array<{ domain: string; title: string; description: string; href: string; tags: string[]; icon?: string }>}
 */
export const getHomeCards = () => {
  return [
    {
      domain: "ortho",
      title: "Orthophonie",
      description:
        "Plateforme dédiée aux exercices d'articulation, de diction et d'élocution.",
      href: "/ortho/ortho.html",
      tags: ["diction", "élocution", "articulation"],
      icon: "/shared/assets/icons/voice.svg",
    },
    {
      domain: "neuro",
      title: "Neuropsychologie",
      description:
        "Modules pour entraîner l'attention, la mémoire de travail et les fonctions exécutives.",
      href: "/neuro/neuro.html",
      tags: ["attention", "mémoire", "fonctions exécutives"],
      icon: "/shared/assets/icons/brain.svg",
    },
  ];
};


