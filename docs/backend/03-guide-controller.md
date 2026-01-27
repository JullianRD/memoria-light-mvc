# 📘 Documentation Générale - Les Contrôleurs

Ce document explique le rôle, le fonctionnement et les bonnes pratiques des **Contrôleurs** dans notre architecture MVC.

---

## 📑 Sommaire

- [🎯 Qu'est-ce qu'un Contrôleur ?](#-quest-ce-quun-contrôleur-)
- [🏗️ Architecture & Responsabilités](#️-architecture--responsabilités)
- [📡 Flux de données détaillé](#-flux-de-données-détaillé)
- [🔧 Anatomie d'un Contrôleur](#-anatomie-dun-contrôleur)
- [📋 Convention de Nommage (Resource Controller)](#-convention-de-nommage-resource-controller)
- [🔄 Pattern PRG (Post-Redirect-Get)](#-pattern-prg-post-redirect-get)
- [⚠️ Gestion des Erreurs](#️-gestion-des-erreurs)
- [🛡️ Bonnes Pratiques](#️-bonnes-pratiques)
- [❌ Anti-patterns à éviter](#-anti-patterns-à-éviter)

---

## 🎯 Qu'est-ce qu'un Contrôleur ?

Le **Contrôleur** est le **"Chef d'orchestre"** de l'application MVC. C'est la couche intermédiaire qui coordonne le flux entre les requêtes utilisateur et les données.

### 🧠 Rôle principal

```text
┌─────────────────────────────────────────────────┐
│  Le Contrôleur ne FAIT PAS le travail,         │
│  il DÉLÈGUE et COORDONNE                        │
└─────────────────────────────────────────────────┘
```

**Ses missions :**

1. 📥 **Recevoir** la requête HTTP depuis le routeur
2. 🔍 **Extraire** les données pertinentes (`req.body`, `req.params`, `req.query`)
3. 📞 **Appeler** les méthodes du Modèle pour accéder aux données
4. 🎨 **Préparer** la réponse (choisir la vue ou rediriger)
5. ⚠️ **Gérer** les erreurs et codes HTTP appropriés

### 🎭 Métaphore du restaurant

| Rôle          | Équivalent MVC | Responsabilité                |
| :------------ | :------------- | :---------------------------- |
| **Client**    | Utilisateur    | Passe commande (requête HTTP) |
| **Serveur**   | Contrôleur     | Prend la commande, coordonne  |
| **Cuisinier** | Modèle         | Prépare le plat (requête SQL) |
| **Assiette**  | Vue            | Présente le plat (HTML)       |

Le serveur (contrôleur) ne cuisine pas, il fait le lien !

---

## 🏗️ Architecture & Responsabilités

### 📊 Table de Responsabilités

| Composant      | Ce qu'il DOIT faire                                                                                                                                      | Ce qu'il ne doit JAMAIS faire                                                                                                     |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Contrôleur** | • Valider les données entrantes<br>• Gérer `req` et `res`<br>• Appeler les méthodes du Modèle<br>• Choisir la vue ou rediriger<br>• Gérer les codes HTTP | • Écrire des requêtes SQL<br>• Se connecter à la BDD<br>• Générer du HTML directement<br>• Contenir de la logique métier complexe |
| **Modèle**     | • Exécuter les requêtes SQL<br>• Valider les données métier<br>• Transformer les résultats                                                               | • Faire des redirections<br>• Rendre des vues<br>• Accéder à `req` ou `res`                                                       |
| **Vue**        | • Transformer les données en HTML<br>• Gérer la présentation                                                                                             | • Faire des appels BDD<br>• Contenir de la logique métier                                                                         |

---

## 📡 Flux de données détaillé

Voici le cycle complet d'une requête HTTP dans notre architecture :

```text
┌─────────────────────────────────────────────────────────────┐
│                    FLUX COMPLET MVC                         │
└─────────────────────────────────────────────────────────────┘

    [1] Utilisateur tape : http://localhost:3000/items
                              │
                              ▼
    ┌─────────────────────────────────────┐
    │         NAVIGATEUR                  │
    │  Envoie : GET /items                │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │         SERVEUR EXPRESS             │
    │  (app.js / index.js)                │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │         ROUTEUR                     │
    │  router.get("/items", ...)          │
    │  Trouve : ItemController.index      │
    └──────────────┬──────────────────────┘
                   │
    [2] Routeur appelle la méthode du contrôleur
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │      CONTRÔLEUR                     │
    │  ItemController.index(req, res)     │
    │  ┌───────────────────────────────┐  │
    │  │ 1. Pas de validation ici      │  │
    │  │    (pas de params)            │  │
    │  │                               │  │
    │  │ 2. Appel au Modèle            │──┼──┐
    │  └───────────────────────────────┘  │  │
    └─────────────────────────────────────┘  │
                                             │
    [3] Le contrôleur demande les données    │
                                             │
                                             ▼
    ┌─────────────────────────────────────────┐
    │         MODÈLE                          │
    │  Item.findAll()                         │
    │  ┌───────────────────────────────────┐  │
    │  │ const query = "SELECT * FROM..."  │  │
    │  │ const result = await pool.query() │──┼──┐
    │  └───────────────────────────────────┘  │  │
    └─────────────────────────────────────────┘  │
                                                 │
    [4] Requête SQL vers PostgreSQL              │
                                                 │
                                                 ▼
    ┌──────────────────────────────────────────────┐
    │       BASE DE DONNÉES                        │
    │  PostgreSQL (memoria_db_dev)                 │
    │  Table : item                                │
    │  ┌────────────────────────────────────────┐  │
    │  │ id │ title        │ content  │ ...     │  │
    │  │ 1  │ Promises     │ async... │         │  │
    │  │ 2  │ Arrow Func   │ () => {} │         │  │
    │  └────────────────────────────────────────┘  │
    └──────────────┬───────────────────────────────┘
                   │
    [5] Retourne les résultats au Modèle
                   │
                   ▼
    ┌─────────────────────────────────────────┐
    │         MODÈLE                          │
    │  return result.rows;                    │
    └──────────────┬──────────────────────────┘
                   │
    [6] Retourne au Contrôleur
                   │
                   ▼
    ┌─────────────────────────────────────────┐
    │      CONTRÔLEUR                         │
    │  const items = await Item.findAll();    │
    │  ┌───────────────────────────────────┐  │
    │  │ 3. Prépare la réponse             │  │
    │  │ res.render("items/index", {items})│──┼──┐
    │  └───────────────────────────────────┘  │  │
    └─────────────────────────────────────────┘  │
                                                 │
    [7] Le contrôleur passe les données à la vue │
                                                 │
                                                 ▼
    ┌──────────────────────────────────────────────┐
    │         VUE (EJS)                            │
    │  pages/items/index.ejs                       │
    │  ┌────────────────────────────────────────┐  │
    │  │ <% items.forEach(item => { %>          │  │
    │  │   <h2><%= item.title %></h2>           │  │
    │  │ <% }) %>                               │  │
    │  └────────────────────────────────────────┘  │
    │  Résultat : HTML généré                      │
    └──────────────┬───────────────────────────────┘
                   │
    [8] HTML envoyé au navigateur
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │         NAVIGATEUR                  │
    │  Affiche la page HTML               │
    └─────────────────────────────────────┘
```

---

## 🔧 Anatomie d'un Contrôleur

### Structure de base

```javascript
/**
 * @fileoverview Contrôleur pour gérer les Items (Pépites)
 */

// Import du modèle pour accéder aux données
import { Item } from "../models/Item.js";

/**
 * @class ItemController
 * @description Gère les opérations CRUD sur les Items
 */
class ItemController {
  /**
   * Affiche la liste de tous les items
   * @async
   * @param {Object} req - Objet requête Express
   * @param {Object} res - Objet réponse Express
   */
  async index(req, res) {
    try {
      // 1. Récupération des données via le Modèle
      const items = await Item.findAll();

      // 2. Rendu de la vue avec les données
      res.render("pages/items/index", { items });
    } catch (error) {
      // 3. Gestion des erreurs
      console.error("❌ Erreur:", error);
      res.status(500).send("Erreur serveur");
    }
  }

  // Autres méthodes CRUD...
}

// Export d'une instance unique (Singleton)
export default new ItemController();
```

### 🧩 Les 3 parties d'une méthode de contrôleur

```javascript
async methodName(req, res) {
  try {
    // ═══════════════════════════════════════════
    // PARTIE 1 : EXTRACTION & VALIDATION
    // ═══════════════════════════════════════════
    const { param1, param2 } = req.body;
    const id = req.params.id;

    // Validation basique
    if (!param1) {
      return res.status(400).send("Paramètre manquant");
    }

    // ═══════════════════════════════════════════
    // PARTIE 2 : LOGIQUE MÉTIER (appel au Modèle)
    // ═══════════════════════════════════════════
    const result = await Model.someMethod(param1, param2);

    // Vérification du résultat
    if (!result) {
      return res.status(404).send("Ressource non trouvée");
    }

    // ═══════════════════════════════════════════
    // PARTIE 3 : RÉPONSE
    // ═══════════════════════════════════════════
    // Option A : Rendu d'une vue
    res.render("page", { data: result });

    // Option B : Redirection (Pattern PRG)
    // res.redirect("/items");

    // Option C : JSON (API REST)
    // res.json(result);

  } catch (error) {
    // ═══════════════════════════════════════════
    // GESTION DES ERREURS
    // ═══════════════════════════════════════════
    console.error("❌ Erreur:", error);
    res.status(500).send("Erreur serveur");
  }
}
```

---

## 📋 Convention de Nommage (Resource Controller)

Nous suivons la convention **REST** pour nommer nos méthodes :

| Méthode     | Route             | Verbe HTTP | Action                            | Retour           |
| :---------- | :---------------- | :--------- | :-------------------------------- | :--------------- |
| **index**   | `/items`          | GET        | Liste toutes les ressources       | Vue (liste)      |
| **show**    | `/items/:id`      | GET        | Affiche une ressource             | Vue (détails)    |
| **create**  | `/items/create`   | GET        | Formulaire de création            | Vue (formulaire) |
| **store**   | `/items`          | POST       | Enregistre une nouvelle ressource | Redirection      |
| **edit**    | `/items/:id/edit` | GET        | Formulaire de modification        | Vue (formulaire) |
| **update**  | `/items/:id`      | PUT/PATCH  | Met à jour une ressource          | Redirection      |
| **destroy** | `/items/:id`      | DELETE     | Supprime une ressource            | Redirection      |

### 📝 Note sur les verbes HTTP en HTML

HTML ne supporte nativement que `GET` et `POST`. Solutions :

```javascript
// ❌ Impossible en HTML pur
<form method="PUT" action="/items/1">

// ✅ Solution 1 : POST avec route explicite
<form method="POST" action="/items/1/update">

// ✅ Solution 2 : Middleware method-override
// npm install method-override
<form method="POST" action="/items/1?_method=PUT">
```

---

## 🔄 Pattern PRG (Post-Redirect-Get)

### ❓ Le problème

```javascript
// ❌ ANTI-PATTERN
async store(req, res) {
  await Item.create(req.body);
  const items = await Item.findAll();
  res.render("items/index", { items }); // ⚠️ Problème !
}
```

**Conséquence :** Si l'utilisateur rafraîchit (F5), le formulaire est resoumis → création en double !

### ✅ La solution : PRG

```javascript
// ✅ BON PATTERN
async store(req, res) {
  await Item.create(req.body);
  res.redirect("/items"); // Redirection vers une route GET
}
```

### 📊 Comparaison visuelle

```text
┌──────────────────────────────────────────────────────────┐
│  SANS PRG (❌ Mauvais)                                   │
└──────────────────────────────────────────────────────────┘

POST /items (création) ──> 200 OK (HTML affiché)
                               │
                 F5 ───────────┘
                               │
                               ▼
                    Resoumission du POST !
                    → Création en double 😱


┌──────────────────────────────────────────────────────────┐
│  AVEC PRG (✅ Bon)                                       │
└──────────────────────────────────────────────────────────┘

POST /items (création) ──> 302 Redirect
                               │
                               ▼
                          GET /items
                               │
                               ▼
                         200 OK (HTML)
                               │
                 F5 ───────────┘
                               │
                               ▼
                    Simple rechargement GET
                    → Pas de resoumission ✅
```

### 🎯 Règle d'or

```text
┌─────────────────────────────────────────────────┐
│  POST/PUT/DELETE → TOUJOURS rediriger           │
│  GET              → Rendu de vue                │
└─────────────────────────────────────────────────┘
```

---

## ⚠️ Gestion des Erreurs

### Structure try-catch systématique

**Toutes** les méthodes async doivent avoir un `try-catch` :

```javascript
async methodName(req, res) {
  try {
    // Code potentiellement faillible

  } catch (error) {
    // Gestion d'erreur
    console.error("❌ Erreur dans methodName:", error);
    res.status(500).send("Erreur serveur");
  }
}
```

### 🎯 Codes HTTP à utiliser

| Code    | Nom          | Quand l'utiliser                     | Exemple                         |
| :------ | :----------- | :----------------------------------- | :------------------------------ |
| **200** | OK           | Succès (lecture, mise à jour)        | `res.status(200).render(...)`   |
| **201** | Created      | Ressource créée                      | `res.status(201).redirect(...)` |
| **204** | No Content   | Suppression réussie (pas de contenu) | `res.status(204).send()`        |
| **400** | Bad Request  | Données invalides                    | Champs manquants                |
| **404** | Not Found    | Ressource introuvable                | Item avec cet ID n'existe pas   |
| **500** | Server Error | Erreur BDD, bug serveur              | Erreur SQL, crash               |

### 📋 Gestion granulaire des erreurs

```javascript
async show(req, res) {
  try {
    const id = req.params.id;

    // Validation de l'ID
    if (!id || isNaN(id)) {
      return res.status(400).send("ID invalide");
    }

    const item = await Item.findById(id);

    // Vérifier si la ressource existe
    if (!item) {
      return res.status(404).send("Pépite non trouvée");
    }

    res.render("items/show", { item });

  } catch (error) {
    console.error("❌ Erreur dans show():", error);

    // Distinguer les types d'erreurs
    if (error.code === '22P02') { // Erreur PostgreSQL (format invalide)
      return res.status(400).send("Format de données invalide");
    }

    res.status(500).send("Erreur serveur");
  }
}
```

### 🔒 Sécurité : Ne jamais exposer les détails techniques

```javascript
// ❌ DANGEREUX en production
res.status(500).send("Erreur : " + error.message);
// → Expose la structure de la BDD, les paths serveur...

// ✅ BON
res.status(500).send("Une erreur est survenue");
console.error("Détails (logs serveur):", error); // Logs côté serveur uniquement
```

---

## 🛡️ Bonnes Pratiques

### 1. Validation des données

```javascript
async store(req, res) {
  const { title, content, category_id } = req.body;

  // ═══════════════════════════════════════════
  // Validation
  // ═══════════════════════════════════════════
  if (!title || !content) {
    return res.status(400).send("Champs obligatoires manquants");
  }

  if (title.length < 3 || title.length > 100) {
    return res.status(400).send("Le titre doit faire entre 3 et 100 caractères");
  }

  // ═══════════════════════════════════════════
  // Assainissement (sanitization)
  // ═══════════════════════════════════════════
  const sanitizedData = {
    title: title.trim(),
    content: content.trim(),
    category_id: parseInt(category_id) || null
  };

  await Item.create(sanitizedData);
  res.redirect("/items");
}
```

### 2. Messages flash pour le feedback utilisateur

```javascript
// Avec express-session et connect-flash
async store(req, res) {
  try {
    await Item.create(req.body);
    req.flash('success', 'Pépite créée avec succès !');
    res.redirect('/items');
  } catch (error) {
    req.flash('error', 'Erreur lors de la création');
    res.redirect('/items/create');
  }
}
```

### 3. Confirmation pour actions destructives

```javascript
async destroy(req, res) {
  try {
    const id = req.params.id;

    // Vérifier que l'item existe avant de supprimer
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).send("Pépite non trouvée");
    }

    await Item.delete(id);
    res.redirect("/items");

  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression");
  }
}
```

**Vue EJS associée :**

```html
<form
  method="POST"
  action="/items/<%= item.id %>/delete"
  onsubmit="return confirm('⚠️ Cette action est irréversible. Continuer ?')"
>
  <button type="submit" class="btn-danger">🗑️ Supprimer</button>
</form>
```

### 4. Logs de débogage structurés

```javascript
async show(req, res) {
  try {
    const id = req.params.id;

    // Log structuré
    console.log(`[${new Date().toISOString()}] 🔍 Recherche item ID: ${id}`);

    const item = await Item.findById(id);

    console.log(`[${new Date().toISOString()}] ✅ Item trouvé:`, {
      id: item.id,
      title: item.title
    });

    res.render("items/show", { item });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Erreur:`, {
      method: 'show',
      id: req.params.id,
      error: error.message
    });
    res.status(500).send("Erreur serveur");
  }
}
```

---

## ❌ Anti-patterns à éviter

### 1. SQL dans le contrôleur

```javascript
// ❌ MAUVAIS
async index(req, res) {
  const query = "SELECT * FROM item";
  const result = await pool.query(query);
  res.render("items/index", { items: result.rows });
}

// ✅ BON
async index(req, res) {
  const items = await Item.findAll(); // Déléguer au Modèle
  res.render("items/index", { items });
}
```

### 2. Logique métier complexe

```javascript
// ❌ MAUVAIS (logique complexe dans le contrôleur)
async processOrder(req, res) {
  const items = await Item.findAll();
  const total = items.reduce((sum, item) => {
    if (item.category_id === 1) {
      return sum + item.price * 0.9; // Remise 10%
    }
    return sum + item.price;
  }, 0);

  // Calcul de taxes, frais de port, etc...
  // → Logique qui devrait être dans un Service !
}

// ✅ BON
async processOrder(req, res) {
  const order = await OrderService.calculate(req.body);
  res.render("order/summary", { order });
}
```

### 3. Rendu HTML en dur

```javascript
// ❌ MAUVAIS
async index(req, res) {
  const items = await Item.findAll();
  let html = "<ul>";
  items.forEach(item => {
    html += `<li>${item.title}</li>`;
  });
  html += "</ul>";
  res.send(html);
}

// ✅ BON
async index(req, res) {
  const items = await Item.findAll();
  res.render("items/index", { items }); // EJS s'occupe du HTML
}
```

### 4. Oublier le try-catch

```javascript
// ❌ MAUVAIS (crash serveur si erreur)
async show(req, res) {
  const item = await Item.findById(req.params.id);
  res.render("items/show", { item });
}

// ✅ BON
async show(req, res) {
  try {
    const item = await Item.findById(req.params.id);
    res.render("items/show", { item });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
}
```

---

## 🎓 Checklist du bon contrôleur

Avant de valider votre code, vérifiez :

- [ ] Toutes les méthodes async ont un `try-catch`
- [ ] Aucune requête SQL directe dans le contrôleur
- [ ] Les codes HTTP sont appropriés (200, 404, 500...)
- [ ] Les POST/PUT/DELETE redirigent (Pattern PRG)
- [ ] Les données sont validées avant traitement
- [ ] Les erreurs sont loggées côté serveur
- [ ] Les messages d'erreur utilisateur sont génériques
- [ ] Pas de logique métier complexe (déléguer aux Services)
- [ ] Les actions destructives demandent confirmation
- [ ] Export en Singleton (`export default new Controller()`)

---

## 🔗 Ressources Complémentaires

- [Express.js - Documentation officielle](https://expressjs.com/)
- [MDN - Codes de statut HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Status)
- [RESTful API Design](https://restfulapi.net/)
- [Pattern PRG expliqué](https://en.wikipedia.org/wiki/Post/Redirect/Get)

---

_Dernière mise à jour : 24/01/2026_

---
