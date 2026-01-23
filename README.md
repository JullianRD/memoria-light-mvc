# 🐼 Memoria - Ton Deuxième Cerveau

> **Memoria** est un coffre-fort numérique personnel permettant de capturer, organiser et pérenniser tes pépites de savoir : extraits de livres, podcasts, articles, notes personnelles.

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table des matières

- [🎯 Objectif du projet](#-objectif-du-projet)
- [🛠 Stack Technique](#-stack-technique)
- [📁 Architecture du projet](#-architecture-du-projet)
- [🚀 Installation & Démarrage](#-installation--démarrage)
- [📚 Documentation](#-documentation)
- [🎓 Exercices pratiques](#-exercices-pratiques)
- [📊 Modèle de données](#-modèle-de-données)
- [🧪 Scripts utilitaires](#-scripts-utilitaires)
- [📝 License](#-license)

---

## 🎯 Objectif du projet

**Memoria** te permet de :

- 📖 **Capturer** tes découvertes (livres, podcasts, articles, vidéos).
- 🏷️ **Organiser** avec un système de tags flexible.
- 🔍 **Retrouver** facilement grâce à des vues SQL optimisées.
- 🤝 **Partager** des items avec d'autres utilisateurs.
- 📊 **Analyser** ton activité d'apprentissage.

---

## 🛠 Stack Technique

- **Backend :** Node.js 24+ (ES Modules) / Express.js 5.x
- **Frontend :** EJS (Server-Side Rendering) & Tailwind CSS
- **Base de données :** PostgreSQL 18+
- **Validation :** Zod (Schémas de données)
- **Sécurité :** UUID v7, hashing, et rôles SQL dédiés.

---

## 📁 Architecture du projet

```text
memoria-light-mvc/
│
├─ 📦 database/                    # Intelligence SQL
│  ├─ migrations/                  # Structure (config, tables, types, extensions)
│  │  ├─ config/                   # 00 à 04 (Roles, Extensions, Types)
│  │  ├─ tables/                   # 01_users à 06_item_tags
│  │  └─ drop/                     # Scripts de nettoyage
│  ├─ seeders/                     # Données de test (01 à 06)
│  ├─ queries/                     # Requêtes de référence (01 à 09)
│  ├─ triggers/                    # 01_add_trigger_set_timestamp.sql
│  └─ views/                       # 01_items_with_tags_json_view.sql, etc.
│
├─ 📚 docs/                        # Centre de Documentation
│  ├─ logic/                       # Architecture MVC (01, 02)
│  ├─ database/                    # Guide SQL & Assets (01)
│  ├─ backend/                     # Connexion (01), Erreurs (02), Zod (03)
│  └─ frontend/                    # Vues EJS et Layouts
│
├─ 🎓 practices/                   # Exercices SQL (01 à 03 + corrections)
│
├─ 🔧 scripts/                     # Automatisation (init_db.sh, reset_db.sh, nuke_db.sh)
│
├─ 💻 src/                         # Code source Node.js (MVC)
│  ├─ config/                      # database.js
│  ├─ controllers/                 # ItemController.js
│  ├─ models/                      # Item.js
│  └─ views/                       # templates EJS (pages & partials)
│
└─ 🎨 public/                      # Assets statiques (CSS, JS, Images)
```

---

## 🚀 Installation & Démarrage

### 1️⃣ Configuration de l'environnement

```bash
cp .env.example .env
# Éditez le .env avec vos accès PostgreSQL
```

### 2️⃣ Initialisation de la base de données

Les scripts automatisent la création de l'utilisateur applicatif et des tables :

```bash
chmod +x scripts/*.sh
npm run db:init   # Lance scripts/init_db.sh
```

### 3️⃣ Lancer l'application

```bash
npm install
npm run dev       # Serveur avec rechargement automatique
```

---

## 📚 Documentation

Consulte le **[Centre de Documentation détaillé](./docs/README.md)** pour approfondir :

| Domaine                 | Guide Principal                                                 |
| :---------------------- | :-------------------------------------------------------------- |
| **Architecture**        | [`02-architecture-mvc.md`](./docs/logic/02-architecture-mvc.md) |
| **Données**             | [`01-guide-sql.md`](./docs/database/01-guide-sql.md)            |
| **Sécurité/Validation** | [`03-validation-zod.md`](./docs/backend/03-validation-zod.md)   |

---

## 🎓 Exercices pratiques

Le projet inclut un parcours d'apprentissage SQL dans `/practices` :

1. **Santé des données** (`01-sante_des_donnees.md`) : Types et contraintes.
2. **Jointures** (`02-connecter_les_points_jointures.md`) : Relations N-N.
3. **Agrégation** (`03-aggreation_et_vues_metier.md`) : Statistiques et Vues.

---

## 📊 Modèle de données

### Tables principales

- `users` : Comptes utilisateurs (UUID v7).
- `items` : Le contenu capturé (livres, liens, etc.).
- `tags` : Système d'étiquetage.
- `shares` : Gestion des partages entre utilisateurs.

### Vues métier (disponibles dans `database/views/`)

- `01_items_with_tags_json_view.sql` : Agrégation des tags par item.
- `04_user_activity_summary_view.sql` : Statistiques d'apprentissage.

---

## 🧪 Scripts utilitaires

| Script             | Action                                            |
| :----------------- | :------------------------------------------------ |
| `npm run db:init`  | Création base + utilisateur + tables + seeds.     |
| `npm run db:reset` | Vide et réinitialise la base proprement.          |
| `npm run db:nuke`  | **Danger** : Supprime tout (base et utilisateur). |

---

## 📝 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**Fabriqué avec ❤️ pour les amoureux du savoir.**
_Dernière mise à jour : 22/01/2026_

[⬆ Retour en haut](#-memoria---ton-deuxième-cerveau)

</div>

---
