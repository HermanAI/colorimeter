# 📝 Todo List App - Documentation Complète

## À Propos

Une application de gestion de tâches moderne avec **sauvegarde locale** (Local Storage).

- ⚡ **Zéro serveur** - Fonctionne complètement en local
- 💾 **Persistant** - Les données restent entre les sessions
- 🎨 **Design moderne** - Interface clean et responsive
- 📱 **Mobile friendly** - 100% compatible

## 🚀 Démarrage Rapide

### Installation
1. **Ouvrir** le fichier `todo-app/index.html` dans un navigateur
2. **C'est tout!** L'app est prête à utiliser

### Utilisation

#### Ajouter une tâche
1. Taper dans le champ de texte
2. Cliquer "Add" ou appuyer sur **Entrée**

#### Marquer comme complétée
- Cocher la case ✅

#### Éditer une tâche
1. Cliquer le bouton "Edit"
2. Modifier le texte et la priorité
3. Cliquer "Save"

#### Supprimer une tâche
- Cliquer le bouton "Delete"

#### Filtrer les tâches
- **All** - Toutes les tâches
- **Active** - Tâches non complétées
- **Completed** - Tâches complétées

## 📁 Structure des Fichiers

```
todo-app/
├── index.html          # HTML principal
├── css/
│   └── todo.css       # Tous les styles
├── js/
│   └── todo.js        # Logique + Local Storage
└── README.md          # Documentation
```

## 💾 Local Storage

### Clé de stockage
```javascript
localStorage.todoAppData
```

### Format des données
```javascript
[
    {
        id: 1702987123456,              // ID unique (timestamp)
        text: "Acheter du lait",        // Description de la tâche
        completed: false,               // Statut
        priority: "high",              // high, medium, low
        createdAt: "12/6/2026, 3:45:30" // Date de création
    },
    {
        id: 1702987234567,
        text: "Faire les courses",
        completed: true,
        priority: "medium",
        createdAt: "12/6/2026, 3:46:00"
    }
]
```

## 🎨 Interface

### Sections Principales

**En-tête**
- Titre "My Tasks"
- Sous-titre

**Saisie**
- Champ de texte
- Bouton "Add"
- Filtres (All, Active, Completed)

**Statistiques**
- Total de tâches
- Tâches actives
- Tâches complétées

**Liste**
- Affichage des tâches
- Cases à cocher
- Boutons d'action (Edit, Delete)
- Dates de création

**Actions**
- "Clear Completed" - Supprimer les complétées
- "Delete All" - Supprimer tout

## 🎯 Niveaux de Priorité

| Priorité | Couleur | Utilisation |
|----------|--------|-------------|
| **High** | 🔴 Rouge | Urgent |
| **Medium** | 🟡 Orange | Normal |
| **Low** | 🔵 Bleu | Peut attendre |

## ⌨️ Raccourcis Clavier

| Touche | Action |
|--------|--------|
| **Entrée** | Ajouter la tâche |
| **Échap** | Fermer modal (si modal ouverte) |

## 🔍 Débogage

### Voir toutes les tâches
```javascript
// Dans la console (F12)
JSON.parse(localStorage.todoAppData)
```

### Voir une tâche spécifique
```javascript
app.todos.find(t => t.id === 1702987123456)
```

### Réinitialiser les données
```javascript
localStorage.removeItem('todoAppData')
location.reload()
```

### Voir les statistiques
```javascript
app.getStats()
// Retourne: {total: 5, active: 2, completed: 3}
```

## 🛠️ Code Principal (TodoApp Class)

```javascript
class TodoApp {
    // Initialisation
    constructor()              // Créer instance
    init()                    // Setup

    // Stockage
    loadFromStorage()         // Charger données
    saveToStorage()           // Sauvegarder données

    // CRUD
    addTodo(text)             // Créer tâche
    toggleTodo(id)            // Cocher/Décocher
    deleteTodo(id)            // Supprimer
    updateTodo(id, ...)       // Modifier

    // Gestion
    clearCompleted()          // Supprimer complétées
    deleteAll()              // Supprimer tout
    getFilteredTodos()       // Filtrer
    getStats()               // Obtenir statistiques

    // Interface
    render()                 // Redessiner
    showEditModal(id)        // Ouvrir modal d'édition
    saveEdit(id)             // Sauvegarder édition
}
```

## 🎨 Personnalisation

### Changer les couleurs
Éditer `css/todo.css`:

```css
:root {
    --primary: #6366f1;      /* Couleur principale */
    --success: #10b981;      /* Complété */
    --danger: #ef4444;       /* Supprimer */
}
```

### Changer la clé de stockage
Éditer `js/todo.js`:

```javascript
this.storageKey = 'maClePersonnalisee';
```

### Ajouter une priorité
Éditer le HTML et CSS

## 📊 Améliorations Futures

- [ ] Due dates (dates d'échéance)
- [ ] Categories (catégories)
- [ ] Search (recherche)
- [ ] Dark mode (mode sombre)
- [ ] Drag & drop (réorganisation)
- [ ] Export to CSV (exporter)
- [ ] Recurring tasks (tâches récurrentes)
- [ ] Notifications (notifications)
- [ ] Sync cloud (synchronisation)
- [ ] Collaboration (partage)

## 🔐 Sécurité

- ✅ Données stockées localement (navigateur)
- ✅ Aucun envoi au serveur
- ✅ Protection XSS (escapeHtml)
- ✅ Validation entrées
- ✅ Confirmations avant suppression

## 📱 Responsive Design

- **Desktop**: Vue complète
- **Tablet**: Optimisée
- **Mobile**: Interface adaptée

## 🧪 Tests

### Test basique
1. Ouvrir l'app
2. Ajouter 3 tâches
3. Marquer une comme complétée
4. Fermer le navigateur
5. Rouvrir - Les tâches sont toujours là ✅

### Test Local Storage
```javascript
// Vérifier les données persistes
setTimeout(() => location.reload(), 1000);
// Les tâches doivent rester
```

## 🆘 FAQ

**Q: Où sont stockées mes données?**
R: Dans `localStorage` de votre navigateur. Aucun serveur.

**Q: Mes données seront-elles perdues?**
R: Seulement si vous effacez le cache/cookies.

**Q: Puis-je partager mes tâches?**
R: Non actuellement (future version).

**Q: Combien de tâches puis-je avoir?**
R: Jusqu'à ~5-10MB (limite localStorage).

---

**Version**: 1.0
**Date**: 12/06/2026
**Statut**: ✅ Prête
