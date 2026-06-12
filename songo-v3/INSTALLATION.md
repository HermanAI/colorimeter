# Installation Songo 237 V3

## Prérequis
- PHP 7.4+
- MySQL 5.7+
- XAMPP ou serveur local

## Étapes d'installation

### 1. Extraire les fichiers
```bash
# Dans xampp/htdocs/ ou votre racine web
cd C:\xampp\htdocs  # ou /var/www/html
copier le dossier songo-v3
```

### 2. Créer la base de données
```bash
mysql -u root -p < songo-v3/sql/schema.sql
```
OU via phpMyAdmin :
1. Ouvrir http://localhost/phpmyadmin
2. Aller à l'onglet SQL
3. Copier-coller le contenu de `sql/schema.sql`
4. Exécuter

### 3. Vérifier config.php
```php
// songo-v3/php/config.php
define('DB_HOST', 'localhost');   // Votre host
define('DB_USER', 'root');        // Votre user
define('DB_PASS', '');            // Votre password
define('DB_NAME', 'songo_db');    // Votre DB
```

### 4. Lancer le serveur

#### Avec XAMPP
- Démarrer Apache et MySQL
- Accéder à : http://localhost/songo-v3/

#### Avec PHP intégré
```bash
cd songo-v3
php -S localhost:8000
# Accéder à : http://localhost:8000/
```

### 5. Tester
1. Ouvrir deux navigateurs/onglets
2. Chacun à http://localhost/songo-v3/
3. L'un crée une partie → reçoit un CODE
4. L'autre rejoint avec le code
5. Jouer !

## Dépannage

### Erreur "Partie introuvable"
- Vérifier que la DB est créée : `SHOW DATABASES;`
- Vérifier le code est correct

### Erreur "NetworkError"
- Vérifier que PHP est actif
- Ouvrir la console (F12) pour voir les détails

### Erreur "Connection refused"
- MySQL n'est pas lancé
- Démarrer MySQL via XAMPP

## Améliorations V3
- ✅ Respect strict du mouvement clockwise
- ✅ Gestion CORS améliorée
- ✅ Moteur de jeu robuste
- ✅ Validation stricte
- ✅ Code organisé et modulaire
