# 📝 Changelog - Memoria

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.1.0] - 2026-01-26
### Ajouté
- Nouveau système de documentation structuré par domaines (Backend, Database, Logic, Security).
- Guide d'architecture MVC (`docs/logic/02-guide-architecture-mvc.md`).
- Intégration de **Zod** pour la validation des données (`docs/backend/06-guide-validation-zod.md`).

### Changé
- **Refactorisation de la Vue** : Migration de `ejs-mate` vers **EJS Natif** (utilisation des `include` standards).
- Mise à jour du `app.js` pour utiliser les chemins absolus avec `path.join` et `import.meta.url`.
- Organisation des fichiers EJS : séparation stricte entre `pages/` et `partials/`.

### Corrigé
- Erreur de chargement du Dashboard liée à l'absence de variables d'entités non encore créées (Ajout de mocks).
- Chemins relatifs des assets statiques dans le header.

## [1.0.0] - 2026-01-20
### Ajouté
- Initialisation du projet avec Express 5.
- Configuration PostgreSQL avec support natif des UUID v7.
- Structure de base du dossier `src/`.

---
*Note: Ce journal suit la norme [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).*
