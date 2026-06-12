# 🎮 Songo 237 - Version 3 Modernisée

## Description du Jeu

Songo 237 est un **jeu de semailles camerounais traditionnel** jouable en multijoueur en temps réel via navigateur.

### Règles Principales
- 🔢 **7 cases** par joueur
- 🌾 **5 graines** par case au démarrage
- 🎯 **40 graines** pour gagner
- ⏰ **Movement Clockwise** (sens des aiguilles)
- 📊 **Capture**: 2, 3 ou 4 graines

## Installation Complète

### Prérequis
- PHP 7.4+
- MySQL 5.7+
- XAMPP ou serveur local

### Étapes

#### 1. Extraire les fichiers
```bash
# Placer le dossier songo-v3 dans:
# Windows: C:\xampp\htdocs
# Mac/Linux: /var/www/html
```

#### 2. Créer la base de données

**Option A: Via CLI**
```bash
mysql -u root -p < songo-v3/sql/schema.sql
```

**Option B: Via phpMyAdmin**
1. Ouvrir http://localhost/phpmyadmin
2. Onglet SQL
3. Copier-coller contenu de `songo-v3/sql/schema.sql`
4. Exécuter

#### 3. Vérifier config.php
```php
// songo-v3/php/config.php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'songo_db');
```

#### 4. Démarrer le serveur

**Avec XAMPP**
- Démarrer Apache et MySQL
- Accéder à: http://localhost/songo-v3/

**Avec PHP intégré**
```bash
cd songo-v3
php -S localhost:8000
# http://localhost:8000/
```

## 🎮 Comment Jouer

1. **Ouvrir deux navigateurs** (ou deux onglets)
2. **Joueur 1**: Clique "Nouvelle Partie"
3. **Copier le code** affiché
4. **Joueur 2**: Colle le code et clique "Rejoindre"
5. **Jouer**: Cliquez les cases vertes

## 📁 Structure des Fichiers

```
songo-v3/
├── index.html                 # Page principale
├── css/
│   └── style.css             # Design
├── js/
│   ├── constants.js          # Règles du jeu
│   ├── engine.js             # Moteur (logic)
│   ├── ui.js                 # Interface (rendu)
│   └── ajax.js               # Communication serveur
├── php/
│   ├── config.php            # Configuration DB
│   ├── game.php              # API REST
│   ├── engine.php            # Moteur PHP
│   └── handlers/             # Endpoints
├── sql/
│   └── schema.sql            # Structure DB
├── .htaccess                 # CORS Headers
├── INSTALLATION.md           # Ce guide
└── README.md                 # Info projet
```

## 🐛 Débogage

### Erreur: "Partie introuvable"
- Vérifier le code est exact
- Vérifier MySQL est actif
- Vérifier songo_db existe

### Erreur: "NetworkError when fetching"
- Apache n'est pas lancé
- Vérifier headers CORS dans config.php
- Ouvrir F12 → Console pour détails

### Erreur: "Connection refused"
- MySQL n'est pas actif
- Démarrer via XAMPP
- Vérifier port 3306

## 💾 Base de Données

### Table: parties
```sql
id              INT PRIMARY KEY
code_partie     VARCHAR(8) UNIQUE
etat           MEDIUMTEXT (JSON)
joueur_nord    VARCHAR(32)
joueur_sud     VARCHAR(32)
created_at     TIMESTAMP
updated_at     TIMESTAMP
```

## 🔍 Commandes Utiles

```bash
# Vérifier les parties
mysql -u root -p
USE songo_db;
SELECT * FROM parties;

# Voir l'état d'une partie
SELECT code_partie, etat FROM parties LIMIT 1\G

# Supprimer une partie
DELETE FROM parties WHERE code_partie='ABC123';
```

## 🎨 Personnalisation

### Changer les couleurs
`css/style.css` - Modifier les variables CSS

### Changer les règles
`js/constants.js` - Modifier GAME_CONFIG

### Changer le polling
`js/ajax.js` - Modifier POLLING_INTERVAL

## 📊 Architecture

```
Client (Navigateur)
    ↓
    ├── UI (Affichage)
    ├── Engine (Logique)
    └── AJAX (Communication)
           ↓
        Serveur PHP
           ↓
         MySQL DB
```

## 🚀 Améliorations V3

✅ Moteur de jeu robuste
✅ Respect strict des règles
✅ CORS headers optimisés
✅ Validation stricte côté serveur
✅ Code modulaire et lisible
✅ Documentation complète
✅ Gestion d'erreurs améliorée

## 📝 Notes

- Chaque partie obtient un code unique de 6 caractères
- Les états sont stockés en JSON
- Polling toutes les 2 secondes
- Aucune dépendance externe

## 🆘 Besoin d'aide?

1. Consulter INSTALLATION.md
2. Vérifier les logs (F12)
3. Vérifier les erreurs PHP
4. Vérifier la connexion DB

---

**Version**: 3.0
**Date**: 12/06/2026
**Statut**: ✅ Production Ready
