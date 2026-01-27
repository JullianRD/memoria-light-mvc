# 📚 Centre de Documentation - Memoria

Bienvenue dans la documentation technique du projet **Memoria**. Ce dossier contient toutes les ressources nécessaires pour comprendre l'architecture, le modèle de données, la sécurité et le fonctionnement du rendu côté serveur (SSR).

---

## 🗺️ Vue d'ensemble de la structure

L'application suit une architecture **MVC (Modèle-Vue-Contrôleur)** avec un rendu dynamique via EJS. La documentation est organisée par thématiques :

```text
docs/
├── logic/              # ⚙️ Architecture & Concepts POO
├── backend/            # 🛠️ Modèles, Contrôleurs & Configuration
├── database/           # 🗄️ Schémas SQL & Connexion BDD
├── frontend/           # 🎨 Moteur de template EJS
└── security/           # 🛡️ Sécurité & Bonnes Pratiques
```

---

## 📖 Guides par Thématique

### 🏗️ Architecture & Concepts

| Document                                                          | Description                      |
| :---------------------------------------------------------------- | :------------------------------- |
| [**POO (Programmation Orientée Objet)**](./logic/01-guide-poo.md) | Classes, héritage, encapsulation |
| [**Architecture MVC**](./logic/02-guide-architecture-mvc.md)      | Séparation des responsabilités   |

### 🗄️ Base de Données

| Document                                                              | Description                                        |
| :-------------------------------------------------------------------- | :------------------------------------------------- |
| [**Guide SQL**](./database/01-guide-sql.md)                           | Schémas, types de données, triggers et UUID v7     |
| [**Connexion PostgreSQL**](./backend/01-guide-database-connection.md) | Configuration du pool et variables d'environnement |

### 🛠️ Backend (Node.js/Express)

| Document                                                        | Description                                       |
| :-------------------------------------------------------------- | :------------------------------------------------ |
| [**Modèles (Active Record)**](./backend/02-guide-model.md)      | Gestion des données avec le pattern Active Record |
| [**Contrôleurs**](./backend/03-guide-controller.md)             | Logique métier et orchestration                   |
| [**Vues dans MVC**](./backend/04-guide-view.md)                 | Concept général : SSR, CSR, API REST              |
| [**Gestion des Erreurs**](./backend/05-guide-error-handling.md) | Middleware d'erreurs et messages sécurisés        |
| [**Validation avec Zod**](./backend/06-guide-validation-zod.md) | Validation et sanitization des données            |

### 🎨 Frontend (EJS)

| Document                                            | Description                            |
| :-------------------------------------------------- | :------------------------------------- |
| [**Guide EJS Complet**](./frontend/01-guide-ejs.md) | Syntaxe, layouts, partials et sécurité |

### 🛡️ Sécurité

| Document                                                 | Description                                                       |
| :------------------------------------------------------- | :---------------------------------------------------------------- |
| [**Guide de Sécurité**](./security/01-guide-security.md) | Injections SQL, XSS, CSRF, authentification et checklist complète |

---

## 🎯 Parcours de Lecture Recommandé

### 👶 Débutant (Découvrir le projet)

1. 📖 [Architecture MVC](./logic/02-guide-architecture-mvc.md) - Comprendre la structure
2. 🗄️ [Guide SQL](./database/01-guide-sql.md) - Découvrir le schéma de données
3. 🎨 [Guide EJS](./frontend/01-guide-ejs.md) - Apprendre le rendu des vues
4. 🛡️ [Sécurité - Checklist](./security/01-guide-security.md#-checklist-de-sécurité-obligatoire) - Les bases obligatoires

### 🚀 Intermédiaire (Contribuer au code)

1. 🔧 [POO](./logic/01-guide-poo.md) - Maîtriser les concepts objets
2. 📦 [Modèles](./backend/02-guide-model.md) - Manipuler les données
3. 🎮 [Contrôleurs](./backend/03-guide-controller.md) - Implémenter la logique
4. ✅ [Validation Zod](./backend/06-guide-validation-zod.md) - Sécuriser les entrées
5. 🛡️ [Sécurité Complète](./security/01-guide-security.md) - Protéger l'application

### 🔥 Avancé (Architecture & Optimisation)

1. 🗄️ [Connexion BDD](./backend/01-guide-database-connection.md) - Pool et performances
2. 🚨 [Gestion des Erreurs](./backend/05-guide-error-handling.md) - Robustesse
3. 🌐 [Vues dans MVC](./backend/04-guide-view.md) - SSR vs CSR vs API
4. 🛡️ [Sécurité - OWASP Top 10](./security/01-guide-security.md#-le-top-10-owasp) - Audit complet

---

## 🛠️ Stack Technique Documentée

| Composant           | Technologie          | Version | Documentation                                     |
| :------------------ | :------------------- | :------ | :------------------------------------------------ |
| **Runtime**         | Node.js              | 24+     | [Guide POO](./logic/01-guide-poo.md)              |
| **Serveur**         | Express.js           | 5.x     | [Contrôleurs](./backend/03-guide-controller.md)   |
| **Base de données** | PostgreSQL           | 18+     | [Guide SQL](./database/01-guide-sql.md)           |
| **ORM Pattern**     | Active Record        | Custom  | [Modèles](./backend/02-guide-model.md)            |
| **Validation**      | Zod                  | 4.x     | [Guide Zod](./backend/06-guide-validation-zod.md) |
| **Template Engine** | EJS                  | 4.x     | [Guide EJS](./frontend/01-guide-ejs.md)           |
| **Sécurité**        | Helmet, bcrypt, CSRF | -       | [Guide Sécurité](./security/01-guide-security.md) |

---

## 🖼️ Ressources Graphiques

Les schémas d'architecture et les modèles relationnels (MCD/MLD) sont disponibles dans :
👉 [`/docs/database/assets/`](./database/assets/)

**Ressources disponibles :**

- 📊 Commandes SQL (poster PDF)
- 🖼️ Diagrammes de flux
- 📐 Modèles de données (à venir)

---

## 🔍 Recherche Rapide

### Par Problématique

| Je veux...                   | Document                                                 |
| :--------------------------- | :------------------------------------------------------- |
| **Créer une nouvelle table** | [Guide SQL](./database/01-guide-sql.md)                  |
| **Ajouter une route**        | [Contrôleurs](./backend/03-guide-controller.md)          |
| **Afficher des données**     | [Guide EJS](./frontend/01-guide-ejs.md)                  |
| **Valider un formulaire**    | [Validation Zod](./backend/06-guide-validation-zod.md)   |
| **Sécuriser mon app**        | [Guide Sécurité](./security/01-guide-security.md)        |
| **Gérer les erreurs**        | [Error Handling](./backend/05-guide-error-handling.md)   |
| **Comprendre le MVC**        | [Architecture MVC](./logic/02-guide-architecture-mvc.md) |

### Par Faille de Sécurité

| Vulnérabilité              | Solution              | Document                                                                                               |
| :------------------------- | :-------------------- | :----------------------------------------------------------------------------------------------------- |
| **Injection SQL**          | Requêtes préparées    | [Sécurité - Injection SQL](./security/01-guide-security.md#-injection-sql)                             |
| **XSS**                    | Échappement EJS + CSP | [Sécurité - XSS](./security/01-guide-security.md#-cross-site-scripting-xss)                            |
| **CSRF**                   | Token CSRF            | [Sécurité - CSRF](./security/01-guide-security.md#-cross-site-request-forgery-csrf)                    |
| **Mots de passe en clair** | bcrypt                | [Sécurité - Authentification](./security/01-guide-security.md#-authentification-et-gestion-de-session) |
| **Exposition de données**  | Sérialisation         | [Sécurité - Données Sensibles](./security/01-guide-security.md#-exposition-de-données-sensibles)       |

---

## ✅ Checklist Projet

Avant de passer en production, vérifier :

### 🔴 Obligatoire (Sécurité)

- [ ] `.env` dans `.gitignore`
- [ ] Requêtes SQL préparées
- [ ] Mots de passe hachés (bcrypt)
- [ ] HTTPS activé
- [ ] Helmet configuré
- [ ] Rate limiting actif
- [ ] CSRF protection activée
- [ ] Messages d'erreur génériques

### 🟠 Important (Qualité)

- [ ] Validation Zod sur toutes les entrées
- [ ] Gestion des erreurs centralisée
- [ ] Logs propres (pas de données sensibles)
- [ ] Tests unitaires (à venir)
- [ ] Documentation API (à venir)

### 🟡 Recommandé (Performance)

- [ ] Compression gzip
- [ ] Cache-Control headers
- [ ] Optimisation des requêtes SQL
- [ ] Monitoring (Sentry, etc.)

---

## ✍️ Contribuer à la Documentation

Pour maintenir une documentation de qualité :

### 📝 Règles de Rédaction

1. **Nomenclature** : `numéro-nom-du-fichier.md`
   - Exemple : `01-guide-sql.md`
2. **Structure** :
   - Titre principal (`# 📘`)
   - Sommaire (`## 📑`)
   - Sections numérotées
   - Exemples de code commentés
   - Checklist de fin
3. **Liens** : Toujours relatifs
   - ✅ `[Guide SQL](./database/01-guide-sql.md)`
   - ❌ `[Guide SQL](/docs/database/01-guide-sql.md)`
4. **Assets** : Dans `/assets/` du dossier parent
5. **Code** : Avec syntaxe highlighting et commentaires

### 🎨 Style

````markdown
## 🎯 Titre de Section

### 📋 Sous-titre

**Texte en gras** pour les concepts clés.

| Colonne 1 | Colonne 2 |
| :-------- | :-------- |
| Valeur    | Valeur    |

```javascript
// ✅ Bon exemple
const exemple = "avec commentaires";

// ❌ Mauvais exemple
const bad = "sans explication";
```
````

```

---

## 🔗 Liens Externes Utiles

### 📚 Documentation Officielle
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [EJS Documentation](https://ejs.co/)
- [Zod Documentation](https://zod.dev/)

### 🛡️ Sécurité
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Helmet.js](https://helmetjs.github.io/)

### 🎓 Apprentissage
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [SQL Teaching](https://www.sqlteaching.com/)

---

_Dernière mise à jour : 24/01/2026_
_Mainteneur : helyaTam_

---
```
