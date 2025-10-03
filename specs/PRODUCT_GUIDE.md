# 📱 Guide Produit - Health In Cloud

**Projet** : Health In Cloud  
**Type** : Spécifications Produit (non-technique)  
**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2025

---

## 📖 Table des Matières

1. [Vision & Stratégie](#vision--stratégie)
2. [Personas Détaillés](#personas-détaillés)
3. [Catalogue des Fonctionnalités](#catalogue-des-fonctionnalités)
4. [User Flows & Parcours](#user-flows--parcours)
5. [Métriques de Succès](#métriques-de-succès)

---

## 🎯 Vision & Stratégie

### Description du Produit

**Health In Cloud** est une plateforme web de rééducation orthophonique et neuropsychologique développée pour le service MPR (Médecine Physique et de Réadaptation) de Nantes. 

L'application propose des exercices interactifs permettant aux patients de travailler leur rééducation cognitive et vocale de manière autonome et ludique, tout en permettant aux professionnels de santé de suivre leur progression.

### Vision Produit

> **À court terme (6-12 mois)** : Offrir une plateforme accessible et engageante pour la rééducation orthophonique et neuropsychologique des patients du service MPR de Nantes.

> **À moyen terme (1-2 ans)** : _[À définir]_ Élargir à d'autres services/établissements ? Ajouter de nouveaux types d'exercices ?

> **À long terme (2-3 ans)** : _[À définir]_ Vision globale du produit ?

### Problème Résolu

#### Pour les Patients
- ❌ **Problème** : Difficulté à pratiquer les exercices de rééducation en dehors des séances avec le professionnel
- ✅ **Solution** : Accès 24/7 à des exercices interactifs depuis n'importe où
- 💡 **Valeur** : Autonomie, flexibilité, progression mesurable

#### Pour les Professionnels de Santé
- ❌ **Problème** : Manque de suivi entre les séances
- ✅ **Solution** : Dashboard de suivi 
- 💡 **Valeur** : Meilleur suivi patient

### Différenciation

**Ce qui distingue Health In Cloud :**
- ✅ **Mobile-first** : Optimisé pour une utilisation sur smartphone/tablette
- ✅ **Interface sombre** : Réduit la fatigue oculaire, idéal pour sessions longues
- ✅ **Accessibilité WCAG 2.1 AA** : Accessible aux personnes en situation de handicap
- ✅ **Progressive Web App (PWA)** : Installable, fonctionne comme une app native
- ✅ **Multilingue** : Support FR/EN dès le départ

### Contraintes & Réglementations

#### Données de Santé
- 🔒 **RGPD** : Conformité obligatoire (données personnelles)

---

## 👥 Personas Détaillés

### Persona 1 : Marie, Patiente en Rééducation 🧑‍🦰

**Profil**
- **Âge** : 48 ans
- **Pathologie** : AVC ischémique, troubles cognitifs, aphasie
- **Contexte** : En suivi au service MPR de Nantes
- **Niveau de compétence technologique** : Peu familiarisée avec les outils numériques

**Besoins**
- 🎯 Pratiquer ses exercices de rééducation à domicile
- 📊 Voir sa progression et rester motivée
- 🕐 Exercices courts et adaptés à son niveau
- 🔔 Rappels pour ne pas oublier de s'entraîner

**Frustrations**
- 😓 Difficulté à se souvenir des exercices montrés en séance
- 📉 Manque de feedback entre les séances
- 🤔 Ne sait pas si elle fait les exercices correctement

**Objectifs**
- ✅ Récupérer ses capacités cognitives/vocales
- ✅ Regagner confiance en elle

**Citation**
> _"J'aimerais pouvoir m'entraîner chez moi comme je le fais avec mon orthophoniste, et voir si je progresse."_

---

### Persona 2 : Dr. Typhaine, Orthophoniste 👩‍⚕️

**Profil**
- **Âge** : 43 ans
- **Expérience** : Orthophoniste au service MPR de Nantes
- **Patients** : 20-30 patients suivis
- **Niveau tech** : Intermédiaire à avancé

**Besoins**
- 📋 Prescrire/recommander des exercices spécifiques à ses patients
- 📊 Suivre la progression de ses patients entre les séances

**Frustrations**
- 😓 Manque de visibilité sur la pratique à domicile
- 📉 Difficulté à mesurer l'assiduité des patients
- 🤔 Pas de données objectives entre les consultations

**Objectifs**
- ✅ Optimiser la rééducation de ses patients
- ✅ Encourager la pratique autonome
- ✅ Améliorer l'engagement patient

**Citation**
> _"J'aimerais pouvoir suivre la pratique de mes patients à domicile et adapter mes recommandations en conséquence."_

---

## 🎮 Catalogue des Fonctionnalités

### Fonctionnalités Actuelles

#### 🔐 Authentification & Profils

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| **Inscription/Connexion** | Email/Password, Google OAuth, Apple Sign In | 🔴 Critique |
| **Gestion profil** | Modification nom, email, mot de passe | 🔴 Critique |
| **Internationalisation** | Changement de langue FR/EN | 🟡 Important |
| **Thème sombre** | Interface dark mode par défaut | 🟢 Nice-to-have |

#### 🏠 Pages Principales

| Page | Description |
|------|-------------|
| **Landing Page** | Page d'accueil publique |
| **Page Merci** | Merci à toute l'équipe du MPR de Nantes |
| **Dashboard** | Vue d'ensemble utilisateur |
| **Profil** | Page de profil utilisateur |
| **Header** | Navigation principale |
| **Footer** | Liens et informations |

#### 🧠 Exercices Neuropsychologiques

| Exercice | Description |
|----------|-------------|
| **Empans de lettres** | Test de mémoire de travail |
| _[À compléter]_ | Autres exercices neuro ? |

**Fonctionnalités Empans :**
- 🔊 Lecture audio des lettres
- ⏱️ Timing configurable
- 📊 Score et feedback immédiat
- 📈 Historique des performances

#### 🗣️ Exercices Orthophoniques

| Exercice | Description |
|----------|-------------|
| **Diadococinésie Complexe** | Répétition rapide de syllabes |
| **Virelangues** | Phrases difficiles à prononcer |
| _[À compléter]_ | Autres exercices ortho ? |


#### 📱 Fonctionnalités Mobile Avancées

- [ ] **Mode offline** : Exercices disponibles sans connexion
- [ ] **Notifications push** : Rappels d'exercices, encouragements
- [ ] **Synchronisation** : Sync automatique quand connexion rétablie

---

## 📊 User Flows & Parcours

### Flow 1 : Première Visite & Inscription

```
┌─────────────────────────────────────────────────────┐
│            Parcours Nouveau Patient                 │
└─────────────────────────────────────────────────────┘

1. 🌐 Landing Page (healthincloud.app)
   │
   ├─ Lecture description plateforme
   ├─ Découverte des exercices disponibles
   └─ Clic sur "Commencer" ou "S'inscrire"
   │
   ↓
2. 📝 Page Inscription/Connexion
   │
   ├─ Choix méthode :
   │  ├─ Email + Mot de passe
   │  ├─ Google OAuth
   │  └─ Apple Sign In
   │
   ↓
3. ✅ Compte créé → Redirection Dashboard
   │
   ↓
4. 🏠 Dashboard (première visite)
   │
   ├─ Message de bienvenue
   ├─ Guide rapide (optionnel)
   ├─ Proposition d'exercices de démarrage
   └─ Aucune progression affichée
   │
   ↓
5. 🎯 Premier Exercice
   │
   ├─ Choix catégorie (Neuro ou Ortho)
   ├─ Sélection exercice (ex: Empans)
   ├─ Instructions/Tutorial
   ├─ Réalisation exercice
   └─ Score + Encouragement
   │
   ↓
6. 🔄 Retour Dashboard
   │
   └─ Affichage première progression !
```

### Flow 2 : Session Quotidienne Typique

```
┌─────────────────────────────────────────────────────┐
│         Parcours Patient Régulier                   │
└─────────────────────────────────────────────────────┘

1. 📱 Ouverture App (PWA ou Web)
   │
   ↓
2. 🔐 Connexion (session persistante ou reconnexion)
   │
   ↓
3. 🏠 Dashboard
   │
   ├─ Visualisation progression globale
   ├─ Streak en cours (ex: "7 jours consécutifs 🔥")
   ├─ Exercices suggérés du jour
   └─ Dernières performances
   │
   ↓
4. 🎯 Sélection Exercice
   │
   ├─ Via suggestions
   ├─ Via navigation (Neuro/Ortho)
   └─ Via historique
   │
   ↓
5. 🧠 Réalisation 2-3 Exercices (15-20 min)
   │
   ├─ Exercice 1 : Empans → Score : 8/10 ✅
   ├─ Exercice 2 : Virelangues → Score : 7/10 ✅
   └─ Exercice 3 : Diadococinésie → Score : 9/10 ✅
   │
   ↓
6. 📊 Feedback & Encouragement
   │
   ├─ "Excellent ! +5% cette semaine 📈"
   ├─ "Nouveau record personnel 🏆"
   └─ "Prochain objectif : 90/100"
   │
   ↓
7. 🔄 Retour Dashboard ou Déconnexion
   │
   └─ Progression mise à jour
```

### Flow 3 : Consultation Progression

```
┌─────────────────────────────────────────────────────┐
│       Parcours Consultation Statistiques            │
└─────────────────────────────────────────────────────┘

1. 🏠 Dashboard
   │
   ↓
2. 📊 Clic sur "Voir ma progression détaillée"
   │
   ↓
3. 📈 Page Progression
   │
   ├─ Graphique évolution globale (7j/30j/3m)
   ├─ Progression par catégorie :
   │  ├─ Neuro : 65% ██████░░░░
   │  └─ Ortho : 72% ███████░░░
   ├─ Exercices complétés : 24/50
   ├─ Temps total pratiqué : 4h 30min
   ├─ Streak actuel : 7 jours 🔥
   └─ Meilleur score : 9.5/10 (Empans)
   │
   ↓
4. 🎯 Détail par Exercice
   │
   ├─ Clic sur exercice spécifique
   ├─ Historique des scores
   ├─ Graphique d'évolution
   └─ Recommandations
   │
   ↓
5. 📥 Export (optionnel)
   │
   └─ Téléchargement PDF rapport
```

### Flow 4 : Changement de Langue

```
┌─────────────────────────────────────────────────────┐
│         Parcours Changement Langue FR ↔ EN         │
└─────────────────────────────────────────────────────┘

1. N'importe quelle page
   │
   ↓
2. 🌐 Clic sur sélecteur de langue (Header)
   │
   ├─ 🇫🇷 Français (actif)
   └─ 🇬🇧 English
   │
   ↓
3. Sélection nouvelle langue
   │
   ↓
4. ✅ Rechargement page avec nouvelle langue
   │
   └─ URL mise à jour (/fr → /en)
```

---

## 📈 Métriques de Succès

### KPIs Produit

#### 🎯 Engagement Utilisateur

| Métrique | Cible | Mesure |
|----------|-------|--------|
| **Taux d'activation** | _[À définir]_ 70% ? | % utilisateurs ayant complété ≥1 exercice dans les 7 premiers jours |
| **Utilisateurs actifs mensuels (MAU)** | _[À définir]_ 50 ? 100 ? | Nombre d'utilisateurs uniques par mois |
| **Fréquence d'utilisation** | _[À définir]_ 3x/semaine ? | Nombre moyen de sessions par utilisateur/semaine |
| **Durée session moyenne** | _[À définir]_ 15-20 min ? | Temps moyen passé par session |
| **Taux de rétention J+7** | _[À définir]_ 60% ? | % utilisateurs actifs 7 jours après inscription |
| **Taux de rétention J+30** | _[À définir]_ 40% ? | % utilisateurs actifs 30 jours après inscription |

#### 🎮 Exercices & Progression

| Métrique | Cible | Mesure |
|----------|-------|--------|
| **Taux de complétion exercice** | _[À définir]_ 85% ? | % exercices démarrés et terminés |
| **Exercices par session** | _[À définir]_ 2-3 ? | Nombre moyen d'exercices par session |
| **Progression globale moyenne** | _[À définir]_ +10%/mois ? | Amélioration moyenne des scores sur 1 mois |
| **Streak moyen** | _[À définir]_ 5 jours ? | Durée moyenne des séries consécutives |

#### 💪 Efficacité Rééducation

| Métrique | Cible | Mesure |
|----------|-------|--------|
| **Amélioration scores** | _[À définir]_ +20% en 3 mois ? | Évolution des performances par exercice |
| **Satisfaction utilisateur** | _[À définir]_ 4.5/5 ? | Score NPS ou satisfaction globale |
| **Atteinte objectifs** | _[À définir]_ 70% ? | % utilisateurs atteignant leurs objectifs personnels |

#### 📱 Performance Technique

| Métrique | Cible | Statut |
|----------|-------|--------|
| **Lighthouse Performance** | 90+/100 | 🎯 Objectif |
| **Lighthouse Accessibility** | 95+/100 (WCAG 2.1 AA) | 🎯 Objectif |
| **Temps de chargement** | < 2s (LCP) | 🎯 Objectif |
| **Disponibilité** | 99.9% uptime | 🎯 Objectif |

### Objectifs Quantitatifs

#### 📅 À 3 Mois (Phase 1 - MVP)

- 🎯 **Utilisateurs** : _[À définir]_ 20-30 patients pilotes ?
- 🎯 **Engagement** : _[À définir]_ 60% d'utilisateurs actifs hebdomadaires ?
- 🎯 **Feedback** : Recueillir retours des premiers utilisateurs
- 🎯 **Bugs critiques** : 0 bugs bloquants

#### 📅 À 6 Mois (Phase 2 - Core Features)

- 🎯 **Utilisateurs** : _[À définir]_ 50-100 patients ?
- 🎯 **Engagement** : _[À définir]_ 70% d'utilisateurs actifs hebdomadaires ?
- 🎯 **Progression** : _[À définir]_ 60% des utilisateurs montrant amélioration mesurable ?
- 🎯 **Rétention** : _[À définir]_ 50% de rétention à J+30 ?

#### 📅 À 1 An (Phase 3 - Features Avancées)

- 🎯 **Utilisateurs** : _[À définir]_ 200-500 patients ?
- 🎯 **Engagement** : _[À définir]_ 75% d'utilisateurs actifs hebdomadaires ?
- 🎯 **Satisfaction** : _[À définir]_ NPS > 50 ?
- 🎯 **Expansion** : _[À définir]_ Extension à d'autres services MPR ?

---

**Document créé le** : Octobre 2025  
**Dernière mise à jour** : Octobre 2025  
**Version** : 1.0.0  
**Statut** : 🔄 En construction - À compléter progressivement
