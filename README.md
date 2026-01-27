# 🐼 Memoria - Ton Deuxième Cerveau

> **Memoria** est un coffre-fort numérique personnel permettant de capturer, organiser et pérenniser tes pépites de savoir : extraits de livres, podcasts, articles, notes personnelles.

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table des matières

- [🎯 Objectif du projet](#-objectif-du-projet)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠 Stack Technique](#-stack-technique)
- [📁 Architecture du projet](#-architecture-du-projet)
- [🚀 Installation & Démarrage](#-installation--démarrage)
- [📚 Documentation](#-documentation)
- [🛡️ Sécurité](#️-sécurité)
- [🎓 Exercices pratiques](#-exercices-pratiques)
- [📊 Modèle de données](#-modèle-de-données)
- [🧪 Scripts utilitaires](#-scripts-utilitaires)
- [🤝 Contribution](#-contribution)
- [📝 License](#-license)

---

## 🎯 Objectif du projet

**Memoria** est une application de gestion de connaissances personnelles (PKM - Personal Knowledge Management) qui te permet de construire ton "deuxième cerveau" numérique.

### 🌟 Pourquoi Memoria ?

- 🧠 **Capitaliser** : Ne perds plus jamais une idée, une citation ou une référence
- 🔗 **Connecter** : Relie tes connaissances grâce aux tags et aux partages
- 🚀 **Progresser** : Analyse ton activité d'apprentissage avec des statistiques
- 🎓 **Apprendre** : Projet pédagogique complet avec architecture MVC professionnelle

---

## ✨ Fonctionnalités

### 📖 Gestion de Contenu

- ✅ **Capture multi-sources** : Livres 📚, Podcasts 🎙️, Articles 📰, Vidéos 🎥, Notes personnelles 📝
- ✅ **Métadonnées riches** : Auteur, source, date, URL, notes personnelles
- ✅ **Organisation flexible** : Système de tags hiérarchiques et recherche avancée
- ✅ **Traçabilité complète** : Horodatage automatique (création/modification)

### 🤝 Collaboration

- ✅ **Partage d'items** : Partage sélectif entre utilisateurs
- ✅ **Gestion des permissions** : Contrôle d'accès granulaire
- ✅ **Historique des événements** : Journalisation des actions utilisateurs

### 📊 Analytics

- ✅ **Statistiques utilisateur** : Nombre d'items, tags utilisés, activité
- ✅ **Vues métier** : Tableaux de bord SQL optimisés
- ✅ **Détection d'anomalies** : Items orphelins, tags inutilisés

---

## 🛠 Stack Technique

### Backend

| Composant           | Technologie          | Version | Rôle                                   |
| :------------------ | :------------------- | :------ | :------------------------------------- |
| **Runtime**         | Node.js              | 24+     | Environnement d'exécution JavaScript   |
| **Framework**       | Express.js           | 5.x     | Serveur HTTP et routing                |
| **Base de données** | PostgreSQL           | 18+     | Stockage relationnel avec UUID v7      |
| **ORM Pattern**     | Active Record        | Custom  | Modèles métier avec logique encapsulée |
| **Validation**      | Zod                  | 3.x     | Schémas de validation type-safe        |
| **Sécurité**        | Helmet, bcrypt, CSRF | -       | Protection contre OWASP Top 10         |

### Frontend

| Composant           | Technologie  | Rôle                             |
| :------------------ | :----------- | :------------------------------- |
| **Template Engine** | EJS          | Server-Side Rendering (SSR)      |
| **CSS Framework**   | Tailwind CSS | Design system utility-first      |
| **Architecture**    | MVC          | Séparation Modèle-Vue-Contrôleur |

### DevOps

- **Modules ES** : `"type": "module"` dans `package.json`
- **Scripts Bash** : Automatisation de la gestion de la BDD
- **Environment Variables** : Configuration sécurisée via `.env`

---

## 📁 Architecture du projet

```text
memoria-light-mvc/
│
├─ 🗄️ database/                    # Intelligence SQL (Cœur de données)
│  ├─ migrations/                  # Évolution du schéma
│  │  ├─ config/                   # 00 à 04 (Roles, Extensions, Types)
│  │  ├─ tables/                   # 01_users → 06_item_tags
│  │  └─ drop/                     # Scripts de nettoyage
│  ├─ seeders/                     # Données de test (01 à 06)
│  ├─ queries/                     # Requêtes de référence (01 à 09)
│  ├─ triggers/                    # Automatisation BDD (timestamps)
│  └─ views/                       # Vues métier SQL (01 à 04)
│
├─ 📚 docs/                        # Centre de Documentation Complète
│  ├─ logic/                       # 🏗️ POO & Architecture MVC
│  ├─ database/                    # 🗄️ Guide SQL & Schémas
│  ├─ backend/                     # 🛠️ Connexion, Modèles, Contrôleurs, Erreurs, Validation
│  ├─ frontend/                    # 🎨 Guide EJS (Templates & Layouts)
│  └─ security/                    # 🛡️ Guide Sécurité OWASP
│
├─ 🎓 practices/                   # Exercices SQL progressifs
│  ├─ 01-sante_des_donnees.md      # Types & Contraintes
│  ├─ 02-jointures.md              # Relations N-N
│  └─ 03-agregation.md             # Statistiques & Vues
│
├─ 🔧 scripts/                     # Automatisation DevOps
│  ├─ init_db.sh                   # Initialisation complète
│  ├─ reset_db.sh                  # Réinitialisation propre
│  └─ nuke_db.sh                   # ⚠️ Suppression totale
│
├─ 💻 src/                         # Code Source Node.js (MVC)
│  ├─ config/                      # Configuration (database.js)
│  ├─ models/                      # Modèles Active Record (Item, Tag)
│  ├─ controllers/                 # Logique métier (ItemController, TagController)
│  ├─ views/                       # Templates EJS (pages & partials)
│  ├─ utils/                       # Utilitaires (generateSlug)
│  └─ app.js                       # Point d'entrée Express
│
└─ 🎨 public/                      # Assets statiques
   ├─ css/                         # Styles (main.css)
   ├─ js/                          # Scripts client (app.js)
   └─ images/                      # Ressources graphiques
```

---

## 🚀 Installation & Démarrage

### Prérequis

- **Node.js** ≥ 24.0.0
- **PostgreSQL** ≥ 18.0
- **npm** ≥ 10.0.0

### 🔧 1. Cloner le dépôt

```bash
git clone https://github.com/votre-username/memoria-light-mvc.git
cd memoria-light-mvc
```

### 📦 2. Installer les dépendances

```bash
npm install
```

### ⚙️ 3. Configuration de l'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le .env avec vos paramètres PostgreSQL
nano .env
```

**Exemple de `.env` :**

```bash
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memoria_db_dev
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres

# Utilisateur applicatif (créé automatiquement)
DB_APP_USER=app_memoria
DB_APP_PASSWORD=mot_de_passe_fort_ici

# Connection String (utilisée par l'app)
DATABASE_URL=postgresql://app_memoria:mot_de_passe_fort_ici@localhost:5432/memoria_db_dev
```

### 🗄️ 4. Initialisation de la base de données

```bash
# Rendre les scripts exécutables (une seule fois)
chmod +x scripts/*.sh

# Initialiser la base de données complète
npm run db:init
```

**Ce script effectue automatiquement :**

1. ✅ Création de la base de données
2. ✅ Création de l'utilisateur applicatif (`app_memoria`)
3. ✅ Installation des extensions PostgreSQL
4. ✅ Création des types personnalisés
5. ✅ Création des tables
6. ✅ Installation des triggers
7. ✅ Création des vues métier
8. ✅ Injection des données de test (seeders)

### 🚀 5. Lancer l'application

```bash
# Mode développement (rechargement automatique)
npm run dev

# Mode production
npm start
```

**L'application sera accessible sur :** [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

### 📖 Guide Complet

Consulte le **[Centre de Documentation détaillé](./docs/README.md)** pour une compréhension approfondie.

### 🗺️ Parcours de Lecture Recommandé

#### 👶 Débutant

1. 📐 [Architecture MVC](./docs/logic/02-guide-architecture-mvc.md) - Comprendre la structure
2. 🗄️ [Guide SQL](./docs/database/01-guide-sql.md) - Découvrir le schéma de données
3. 🎨 [Guide EJS](./docs/frontend/01-guide-ejs.md) - Apprendre le rendu des vues
4. 🛡️ [Sécurité - Checklist](./docs/security/01-guide-security.md#-checklist-de-sécurité-obligatoire)

#### 🚀 Intermédiaire

1. 🔧 [POO en JavaScript](./docs/logic/01-guide-poo.md)
2. 📦 [Modèles Active Record](./docs/backend/02-guide-model.md)
3. 🎮 [Contrôleurs Express](./docs/backend/03-guide-controller.md)
4. ✅ [Validation avec Zod](./docs/backend/06-guide-validation-zod.md)

#### 🔥 Avancé

1. 🗄️ [Connexion PostgreSQL](./docs/backend/01-guide-database-connection.md)
2. 🚨 [Gestion des Erreurs](./docs/backend/05-guide-error-handling.md)
3. 🌐 [Vues dans MVC](./docs/backend/04-guide-view.md)
4. 🛡️ [Sécurité OWASP Top 10](./docs/security/01-guide-security.md)

### 🔍 Documentation par Thématique

| Je veux...                          | Document                                                          |
| :---------------------------------- | :---------------------------------------------------------------- |
| **Créer une nouvelle table**        | [Guide SQL](./docs/database/01-guide-sql.md)                      |
| **Ajouter une route/action**        | [Guide Contrôleur](./docs/backend/03-guide-controller.md)         |
| **Afficher des données dynamiques** | [Guide EJS](./docs/frontend/01-guide-ejs.md)                      |
| **Valider un formulaire**           | [Guide Zod](./docs/backend/06-guide-validation-zod.md)            |
| **Sécuriser mon application**       | [Guide Sécurité](./docs/security/01-guide-security.md)            |
| **Gérer les erreurs proprement**    | [Guide Error Handling](./docs/backend/05-guide-error-handling.md) |

---

## 🛡️ Sécurité

### ✅ Protections Implémentées

| Vulnérabilité OWASP                | Protection                       | Statut |
| :--------------------------------- | :------------------------------- | :----- |
| **A01: Broken Access Control**     | Rôles SQL dédiés                 | ✅     |
| **A02: Cryptographic Failures**    | bcrypt, HTTPS, `.env` sécurisé   | ✅     |
| **A03: Injection SQL**             | Requêtes préparées               | ✅     |
| **A04: Insecure Design**           | Validation Zod + contraintes BDD | ✅     |
| **A05: Security Misconfiguration** | Helmet.js, CSP headers           | ✅     |
| **A06: Vulnerable Components**     | `npm audit` automatique          | ✅     |
| **A07: Authentication Failures**   | Sessions sécurisées, UUID v7     | ✅     |
| **A08: Data Integrity Failures**   | Sérialisation contrôlée          | ✅     |
| **A09: Logging Failures**          | Table `app_events`               | ✅     |
| **A10: SSRF**                      | Validation des URLs              | ✅     |

### 🔒 Configuration Sécurité

```javascript
// Headers de sécurité (Helmet.js)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

// Protection CSRF
app.use(csrf({ cookie: false }));

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max
  }),
);
```

**📖 Documentation complète :** [Guide Sécurité](./docs/security/01-guide-security.md)

---

## 🎓 Exercices pratiques

Le projet inclut un **parcours d'apprentissage SQL progressif** dans `/practices` :

### 📘 Niveau 1 : Santé des Données

**Fichier :** [`01-sante_des_donnees.md`](./practices/01-sante_des_donnees.md)

- Types de données PostgreSQL
- Contraintes (`NOT NULL`, `CHECK`, `UNIQUE`)
- Valeurs par défaut et UUID v7
- **Correction :** [`01-correction-sante_des_donnees.md`](./practices/01-correction-sante_des_donnees.md)

### 📗 Niveau 2 : Jointures

**Fichier :** [`02-connecter_les_points_jointures.md`](./practices/02-connecter_les_points_jointures.md)

- Relations 1-N et N-N
- Jointures (`INNER JOIN`, `LEFT JOIN`)
- Table pivot (`item_tags`)
- **Correction :** [`02-correction-connecter_les_points_jointures.md`](./practices/02-correction-connecter_les_points_jointures.md)

### 📕 Niveau 3 : Agrégation & Vues

**Fichier :** [`03-aggreation_et_vues_metier.md`](./practices/03-aggreation_et_vues_metier.md)

- Fonctions d'agrégation (`COUNT`, `GROUP BY`)
- JSON aggregation (`json_agg`)
- Création de vues SQL
- **Correction :** [`03-correction-aggreation_et_vues_metier.md`](./practices/03-correction-aggreation_et_vues_metier.md)

---

## 📊 Modèle de données

### 📐 Schéma Relationnel

```text
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │    items     │       │     tags     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (UUID v7) │──┐    │ id (UUID v7) │    ┌──│ id (UUID v7) │
│ username     │  │    │ user_id (FK) │────┘  │ name         │
│ email        │  │    │ title        │       │ slug         │
│ password     │  │    │ source_type  │       │ created_at   │
│ created_at   │  │    │ tags[]       │       └──────────────┘
│ updated_at   │  │    │ created_at   │              │
└──────────────┘  │    │ updated_at   │              │
                  │    └──────────────┘              │
                  │           │                      │
                  │           └──────────┬───────────┘
                  │                      │
                  │              ┌──────────────┐
                  │              │  item_tags   │
                  │              │   (PIVOT)    │
                  │              ├──────────────┤
                  │              │ item_id (FK) │
                  │              │ tag_id (FK)  │
                  │              │ created_at   │
                  │              └──────────────┘
                  │
                  └────┐  ┌──────────────┐
                       └──│    shares    │
                          ├──────────────┤
                          │ id (UUID v7) │
                          │ item_id (FK) │
                          │ owner_id(FK) │
                          │ shared_with  │
                          │ created_at   │
                          └──────────────┘
```

### 🔑 Tables Principales

| Table          | Rôle                        | Clés Primaires                  |
| :------------- | :-------------------------- | :------------------------------ |
| **users**      | Comptes utilisateurs        | UUID v7                         |
| **items**      | Contenu capturé             | UUID v7 + `user_id` (FK)        |
| **tags**       | Système d'étiquetage        | UUID v7 + `slug` (UNIQUE)       |
| **item_tags**  | Relation N-N items↔tags     | Composite (`item_id`, `tag_id`) |
| **shares**     | Partages entre utilisateurs | UUID v7 + contraintes métier    |
| **app_events** | Journalisation système      | UUID v7 + événements            |

### 🔍 Vues Métier

Disponibles dans [`database/views/`](./database/views/) :

1. **`items_with_tags_json`** : Agrégation des tags en JSON par item
2. **`orphan_items`** : Détection des items sans tags
3. **`shared_items`** : Vue complète des partages actifs
4. **`user_activity_summary`** : Statistiques d'utilisation par utilisateur

---

## 🧪 Scripts utilitaires

### 📜 Commandes NPM

| Commande           | Action                          | Utilisation              |
| :----------------- | :------------------------------ | :----------------------- |
| `npm run dev`      | Serveur développement (nodemon) | Rechargement automatique |
| `npm start`        | Serveur production              | Sans rechargement        |
| `npm run db:init`  | Initialisation BDD complète     | Première installation    |
| `npm run db:reset` | Réinitialisation propre         | Vider et recréer         |
| `npm run db:nuke`  | ⚠️ Suppression totale           | Base + utilisateur       |

### 🔧 Scripts Bash

**Emplacement :** [`scripts/`](./scripts/)

#### 1. `init_db.sh` - Initialisation Complète

```bash
npm run db:init
```

**Actions :**

1. Crée la base de données `memoria_db_dev`
2. Installe les extensions (`uuid-ossp`)
3. Crée les types personnalisés (`source_type`, `event_type`)
4. Crée les tables dans l'ordre de dépendance
5. Configure l'utilisateur applicatif (`app_memoria`)
6. Applique les triggers automatiques
7. Crée les vues métier
8. Injecte les données de test (seeders)

#### 2. `reset_db.sh` - Réinitialisation

```bash
npm run db:reset
```

**Actions :**

1. Supprime toutes les tables (cascade)
2. Supprime les types personnalisés
3. Réexécute `init_db.sh`

#### 3. `nuke_db.sh` - Suppression Totale

```bash
npm run db:nuke
```

**⚠️ DANGER : Supprime définitivement :**

- La base de données
- L'utilisateur applicatif
- Toutes les données

---

## 🤝 Contribution

### 🌟 Comment Contribuer

1. **Fork** le projet
2. **Clone** ton fork : `git clone https://github.com/ton-username/memoria-light-mvc.git`
3. **Crée une branche** : `git checkout -b feature/ma-fonctionnalite`
4. **Commit** tes changements : `git commit -m "✨ Ajout de ma fonctionnalité"`
5. **Push** vers la branche : `git push origin feature/ma-fonctionnalite`
6. **Ouvre une Pull Request**

### 📋 Guidelines

- ✅ Respecter l'architecture MVC
- ✅ Documenter les nouvelles fonctionnalités
- ✅ Ajouter des tests (à venir)
- ✅ Suivre les conventions de nommage
- ✅ Vérifier la sécurité (OWASP)

### 🐛 Signaler un Bug

Ouvre une [issue](https://github.com/votre-username/memoria-light-mvc/issues) avec :

- Description claire du problème
- Étapes de reproduction
- Comportement attendu vs. réel
- Environnement (OS, Node.js version, PostgreSQL version)

---

## 📝 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

### 📄 Résumé de la Licence MIT

```text
✅ Utilisation commerciale
✅ Modification
✅ Distribution
✅ Usage privé

❌ Responsabilité
❌ Garantie
```

---

## 🙏 Remerciements

- 💚 **PostgreSQL Community** pour la base de données robuste
- 🚀 **Node.js & Express.js** pour l'écosystème backend
- 🎨 **Tailwind CSS** pour le design system
- 🛡️ **OWASP** pour les guidelines de sécurité
- 📚 **Tous les contributeurs** de la documentation et du code

---

<div align="center">

**Fabriqué avec ❤️ pour les amoureux du savoir.**

_Dernière mise à jour : 24/01/2026_

---

### 🔗 Liens Utiles

[📚 Documentation](./docs/README.md) • [🛡️ Sécurité](./docs/security/01-guide-security.md) • [🐛 Issues](https://github.com/votre-username/memoria-light-mvc/issues) • [🤝 Contribuer](#-contribution)

---

[⬆ Retour en haut](#-memoria---ton-deuxième-cerveau)

</div>

---




```
memoria-light-mvc
├─ database
│  ├─ migrations
│  │  ├─ config
│  │  │  ├─ 00_add_database_config.sql
│  │  │  ├─ 01_add_roles_app.sql
│  │  │  ├─ 02_add_permissions_roles_app.sql
│  │  │  ├─ 03_add_extensions.sql
│  │  │  └─ 04_add_types.sql
│  │  ├─ drop
│  │  │  ├─ 01_drop_all_tables.sql
│  │  │  └─ 02_drop_all_types.sql
│  │  └─ tables
│  │     ├─ 01_add_users_table.sql
│  │     ├─ 02_add_tags_table.sql
│  │     ├─ 03_add_items_table.sql
│  │     ├─ 04_add_shares_table.sql
│  │     ├─ 05_add_app_events_table.sql
│  │     └─ 06_add_item_tags_table_pivot.sql
│  ├─ queries
│  │  ├─ 01_get_recent_users.sql
│  │  ├─ 02_find_short_items.sql
│  │  ├─ 03_check_video_sources.sql
│  │  ├─ 05_items_with_authors.sql
│  │  ├─ 07_user_stats_count.sql
│  │  ├─ 08_items_by_tags.sql
│  │  └─ 09_items_with_tags_json.sql
│  ├─ seeders
│  │  ├─ 01_add_users_seeders.sql
│  │  ├─ 02_add_tags_seeders.sql
│  │  ├─ 03_add_items_seeders.sql
│  │  ├─ 04_add_shares_seeders.sql
│  │  ├─ 05_add_item_tags_seeders.sql
│  │  └─ 06_add_app_events_seeders.sql
│  ├─ triggers
│  │  └─ 01_add_trigger_set_timestamp.sql
│  └─ views
│     ├─ 01_items_with_tags_json_view.sql
│     ├─ 02_orphan_items_view.sql
│     ├─ 03_shared_items_view.sql
│     └─ 04_user_activity_summary_view.sql
├─ docs
│  ├─ backend
│  │  ├─ 01-guide-database-connection.md
│  │  ├─ 02-guide-model.md
│  │  ├─ 03-guide-controller.md
│  │  ├─ 04-guide-view.md
│  │  ├─ 05-guide-error-handling.md
│  │  └─ 06-guide-validation-zod.md
│  ├─ database
│  │  ├─ 01-guide-sql.md
│  │  └─ assets
│  │     ├─ commands-sql.png
│  │     └─ postgresql-cheat-sheet-a4.pdf
│  ├─ frontend
│  │  └─ 01-guide-ejs.md
│  ├─ logic
│  │  ├─ 01-guide-poo.md
│  │  └─ 02-guide-architecture-mvc.md
│  ├─ README.md
│  └─ security
│     └─ 01-guide-security.md
├─ LICENSE
├─ package.json
├─ practices
│  ├─ 01-correction-sante_des_donnees.md
│  ├─ 01-sante_des_donnees.md
│  ├─ 02-connecter_les_points_jointures.md
│  ├─ 02-correction-connecter_les_points_jointures.md
│  ├─ 03-aggreation_et_vues_metier.md
│  └─ 03-correction-aggreation_et_vues_metier.md
├─ public
│  ├─ css
│  │  └─ main.css
│  ├─ favicon.ico
│  ├─ images
│  │  └─ logo.svg
│  └─ js
│     └─ app.js
├─ README.md
├─ scripts
│  ├─ init_db.sh
│  ├─ nuke_db.sh
│  └─ reset_db.sh
└─ src
   ├─ app.js
   ├─ config
   │  └─ database.js
   ├─ controllers
   │  └─ ItemController.js
   ├─ models
   │  └─ Item.js
   ├─ utils
   │  └─ generateSlug.js
   └─ views
      ├─ pages
      │  ├─ home.ejs
      │  └─ items
      │     ├─ edit.ejs
      │     ├─ index.ejs
      │     ├─ new.ejs
      │     └─ show.ejs
      └─ partials
         ├─ footer.ejs
         ├─ header.ejs
         └─ navbar.ejs

```