# Linear Integration - Configuration Guide

Guide complet pour configurer l'intégration Linear avec Health Ortho.

---

## ✅ Configuration Effectuée

✅ **Linear Setup** :
- Équipe : Mpr-in-cloud
- Projets : Application NextJS, Neuro Q4 2025, Bug Fixes
- Labels : Bug, Feature, Improvement, Neuro, Ortho, Performance, Critical

✅ **API Routes créées** :
- `/api/sentry-webhook` - Webhook Sentry → Linear
- `/api/test-linear` - Test création de tickets

✅ **Helpers créés** :
- `src/lib/linear.ts` - Fonctions utilitaires Linear

---

## 🔑 Configuration Requise

### 1. Obtenir votre API Key Linear

1. **Allez sur** : https://linear.app/settings/api
2. **Créez une nouvelle API Key** :
   - Name: `Health Ortho Integration`
   - Scopes: `read`, `write`
3. **Copiez la clé** : `lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Ajouter à vos variables d'environnement

Créez/modifiez `.env.local` :

```env
# Linear API Key
LINEAR_API_KEY="lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 3. Configurer le webhook Sentry (optionnel)

Pour l'intégration automatique Sentry → Linear :

1. **Dans Sentry** : Settings → Integrations → Webhooks
2. **URL du webhook** : `https://votre-domaine.com/api/sentry-webhook`
3. **Événements** : Issues → Created

---

## 🚀 Utilisation

### Créer un ticket depuis le code

```typescript
import { createFeatureTicket, createLinearIssue } from "@/lib/linear";

// Créer un ticket de feature
const ticket = await createFeatureTicket({
  title: "✨ Nouvelle fonctionnalité",
  description: "Description détaillée...",
  labels: ["Neuro"],
  project: "Neuro Q4 2025",
});
```

### Créer un ticket d'amélioration

```typescript
const ticket = await createLinearIssue({
  title: "🔧 Optimisation performance",
  description: "Améliorer les performances...",
  priority: 4, // Low
  labels: ["Performance", "Improvement"],
  project: "Application NextJS",
});
```

### Créer un ticket de bug Sentry

```typescript
import { createSentryBugTicket } from "@/lib/linear";

const ticket = await createSentryBugTicket({
  title: "Error in user authentication",
  culprit: "src/lib/auth.ts:45",
  level: "error",
  userCount: 15,
  count: 42,
  permalink: "https://sentry.io/...",
  metadata: { filename: "auth.ts" },
  tags: [{ key: "environment", value: "production" }],
});
```

---

## 🧪 Tests

### Tester la création de tickets

```bash
# Démarrer le serveur
npm run dev

# Tester l'API
curl http://localhost:3000/api/test-linear
```

Cela créera 2 tickets d'exemple dans Linear.

---

## 📊 Structure Linear

### **Équipes**
- **Mpr-in-cloud** : Équipe principale

### **Projets**
- **Application NextJS** : Développement général
- **Neuro Q4 2025** : Exercices neuropsychologiques
- **Bug Fixes** : Corrections critiques

### **Labels**
- 🐛 **Bug** : Bugs et erreurs
- ✨ **Feature** : Nouvelles fonctionnalités
- 🔧 **Improvement** : Améliorations
- 🧠 **Neuro** : Exercices cognitifs
- 🗣️ **Ortho** : Exercices orthophoniques
- ⚡ **Performance** : Optimisations
- 🚨 **Critical** : Bugs critiques

### **Priorités**
- **1** : Urgent (bugs critiques)
- **2** : High (bugs importants)
- **3** : Normal (features, bugs mineurs)
- **4** : Low (améliorations)

---

## 🔄 Intégrations

### **Sentry → Linear**
- Bugs automatiquement créés dans le projet "Bug Fixes"
- Priorité selon le niveau Sentry (error = urgent)
- Labels automatiques selon le contexte

### **GitHub → Linear**
- Référencer les tickets dans les commits : `Fixes LINEAR-123`
- Mettre à jour les tickets lors des PR

### **Playwright → Linear**
- Créer des tickets pour les tests qui échouent
- Tracker les régressions

---

## 📝 Exemples d'Utilisation

### **Développement d'une feature**

1. **Créer le ticket** :
```typescript
const ticket = await createFeatureTicket({
  title: "✨ Empans visuels",
  description: "Développer les exercices...",
  labels: ["Neuro"],
  project: "Neuro Q4 2025",
});
```

2. **Développer** avec référence au ticket
3. **Tester** avec Playwright
4. **Marquer comme Done** dans Linear

### **Correction d'un bug**

1. **Bug détecté** par Sentry → Ticket créé automatiquement
2. **Assigner** à l'équipe concernée
3. **Corriger** le bug
4. **Tester** la régression
5. **Marquer comme résolu** dans Sentry et Linear

---

## 🎯 Prochaines Étapes

1. **Configurer LINEAR_API_KEY** dans `.env.local`
2. **Tester** : `curl http://localhost:3000/api/test-linear`
3. **Configurer webhook Sentry** (optionnel)
4. **Créer vos premiers tickets** pour les features à venir

---

## 🆘 Dépannage

### Erreur "LINEAR_API_KEY not configured"
- Vérifiez que la variable est dans `.env.local`
- Redémarrez le serveur Next.js

### Erreur "Team not found"
- Vérifiez que l'équipe "Mpr-in-cloud" existe dans Linear
- Vérifiez les permissions de l'API Key

### Erreur "Project not found"
- Vérifiez que le projet existe dans l'équipe
- Vérifiez l'orthographe du nom du projet

---

**Linear est maintenant configuré ! 🎉**  
Vous pouvez créer et gérer vos tickets directement depuis votre code.

