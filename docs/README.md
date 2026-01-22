# 📚 Centre de Documentation - Memoria

Bienvenue dans la documentation technique du projet **Memoria**. Ce dossier contient toutes les ressources nécessaires pour comprendre l'architecture, le modèle de données et le fonctionnement du rendu côté serveur (SSR).

---

## 🗺️ Sommaire des guides

- [🗄️ Base de données](./database/01-guide-sql.md) : Schémas et UUID v7.
- [🛡️ Validation](./backend/03-validation-zod.md) : Sécuriser les données avec Zod.
- [🚨 Gestion des erreurs](./backend/02-error-handling.md) : Flux Express 5 et erreurs.
- [🎨 Frontend](./frontend/views-and-layout.md) : Organisation des vues EJS.

---

## 🗺️ Vue d'ensemble de la structure

L'application suit une architecture **MVC (Modèle-Vue-Contrôleur)** avec un rendu dynamique via EJS. La documentation est découpée selon ces piliers :

```text
docs/
├── logic/              # ⚙️ Contrôleurs & Navigation (Le "C")
├── database/           # 🗄️ Modèle de données & SQL (Le "M")
├── backend/            # 🛠️ Configuration serveur & Sécurité
└── frontend/           # 🎨 Vues EJS & Design (Le "V")
```

---

## 📖 Guides détaillés

| Section            | Document                                                | Description                                                                    |
| :----------------- | :------------------------------------------------------ | :----------------------------------------------------------------------------- |
| **Logique Métier** | [**Architecture MVC**](./logic/02-architecture-mvc.md)  | Liste des routes Express, actions du contrôleur et flux de données.            |
| **Données**        | [**Guide SQL**](./database/01-guide-sql.md)             | Schéma de la base de données, explications des types et triggers.              |
| **Plomberie**      | [**Connexion DB**](./backend/01-database-connection.md) | Configuration du pool de connexion PostgreSQL.                                 |
| **Interface**      | [**Views & Layout**](./frontend/views-and-layout.md)    | Structure des fichiers `.ejs`, utilisation des partials et gestion des assets. |

---

## 🛠️ Stack Technique Documentée

- **Runtime** : Node.js (Mode ES Modules)
- **Serveur** : Express.js v5 (Gestion native des promesses)
- **Base de données** : PostgreSQL 18+ (UUID v7)
- **Validation** : Zod
- **Moteur de template** : EJS (Server-Side Rendering)
- **Style** : CSS natif / Tailwind CSS

---

## 🖼️ Ressources Graphiques

Les schémas d'architecture et les modèles relationnels (MCD/MLD) sont disponibles dans le dossier :
👉 [`/docs/database/assets/`](./database/assets/)

---

## ✍️ Contribuer à la Doc

Pour maintenir une documentation propre :

1. Utilisez des **liens relatifs** pour naviguer entre les fichiers Markdown.
2. Ajoutez des captures d'écran dans les dossiers `assets/` correspondants.
3. Respectez la nomenclature : `numéro-nom-du-fichier.md` (ex: `01-guide-sql.md`).

---

_Dernière mise à jour : 22/01/2026_

---
