# 📋 Guide Complet des Projets

## 🎮 Songo 237 V3 - Jeu Multijoueur

### Description
Songo 237 est un jeu de semailles traditionnel camerounais.
- Multijoueur en temps réel
- Architecture AJAX
- Base de données MySQL
- Respect strict des règles (clockwise)

### Structure
```
songo-v3/
├── index.html              # Page d'accueil
├── css/style.css          # Styles
├── js/
│   ├── constants.js       # Constantes du jeu
│   ├── engine.js          # Moteur de jeu
│   ├── ui.js              # Interface
│   └── ajax.js            # Communication
├── php/
│   ├── config.php         # Configuration DB
│   ├── game.php           # API
│   └── engine.php         # Moteur serveur
├── sql/schema.sql         # Base de données
├── .htaccess              # Headers CORS
└── INSTALLATION.md        # Guide
```

### Installation
1. **Créer la DB**: `mysql -u root -p < songo-v3/sql/schema.sql`
2. **Configurer**: Éditer `php/config.php`
3. **Lancer**: `http://localhost/songo-v3/`

### Fonctionnalités
- ✅ 2 joueurs en temps réel
- ✅ Système de scoring
- ✅ Validation des coups
- ✅ Chat de jeu
- ✅ Historique des mouvements

---

## 📝 Todo List App

### Description
Gestionnaire de tâches moderne avec sauvegarde locale.
- Zéro serveur (Local Storage)
- Filtrage intelligent
- Priorités
- Interface responsive

### Structure
```
todo-app/
├── index.html             # Page principale
├── css/
│   └── todo.css          # Tous les styles
├── js/
│   └── todo.js           # Logique complète
└── README.md             # Documentation
```

### Installation
1. **Ouvrir**: `Ouvrir todo-app/index.html`
2. **Utiliser**: Commencer à ajouter des tâches
3. **C'est tout!** Les données se sauvegardent automatiquement

### Fonctionnalités
- ✅ Ajouter/Éditer/Supprimer tâches
- ✅ Local Storage persistent
- ✅ Filtrage (Tous/Actifs/Complétés)
- ✅ Niveaux de priorité
- ✅ Statistiques en temps réel
- ✅ Interface moderne
- ✅ Mobile friendly

### Local Storage
```javascript
// Vos tâches sont stockées dans:
localStorage.todoAppData

// Format:
[
    {
        id: 1702987123456,
        text: "Ma tâche",
        completed: false,
        priority: "high",
        createdAt: "12/6/2026..."
    }
]
```

---

## 🛠️ Débogage

### Songo 237
```javascript
// Vérifier l'état du jeu
JSON.parse(localStorage.gameState)

// Voir les erreurs
F12 → Console → Chercher les logs

// Vérifier la DB
mysql -u root -p
USE songo_db;
SELECT * FROM parties;
```

### Todo App
```javascript
// Voir toutes les tâches
JSON.parse(localStorage.todoAppData)

// Effacer les données
localStorage.clear()

// Supprimer une clé
localStorage.removeItem('todoAppData')
```

---

## 📱 Support Mobile

- ✅ **Songo 237**: Responsive design
- ✅ **Todo App**: 100% mobile friendly

---

## 🔄 Mise à Jour

Pour obtenir les dernières versions:
```bash
git pull origin main
```

---

## 📞 Support

Consultez les README individuels pour:
- Songo 237: `songo-v3/README.md`
- Todo App: `todo-app/README.md`

---

**Dernière mise à jour**: 12/06/2026 ✨
