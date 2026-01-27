# 📘 Documentation Générale - Les Modèles (Models)

Ce document explique le rôle, le fonctionnement et les bonnes pratiques des **Modèles** dans notre architecture MVC.

---

## 📑 Sommaire

- [🎯 Qu'est-ce qu'un Modèle ?](#-quest-ce-quun-modèle-)
- [🏗️ Architecture & Responsabilités](#️-architecture--responsabilités)
- [📡 Flux de données avec la BDD](#-flux-de-données-avec-la-bdd)
- [🔧 Anatomie d'un Modèle](#-anatomie-dun-modèle)
- [🗂️ Mapping SQL ↔ JavaScript](#️-mapping-sql--javascript)
- [🛡️ Requêtes Préparées (Sécurité)](#️-requêtes-préparées-sécurité)
- [📋 Méthodes CRUD Standards](#-méthodes-crud-standards)
- [✅ Bonnes Pratiques](#-bonnes-pratiques)
- [❌ Anti-patterns à éviter](#-anti-patterns-à-éviter)

---

## 🎯 Qu'est-ce qu'un Modèle ?

Le **Modèle** est la **seule couche** qui communique directement avec la base de données. C'est le "traducteur" entre le monde SQL et le monde JavaScript.

### 🧠 Rôle principal

```text
┌─────────────────────────────────────────────────┐
│  Le Modèle est le GARDIEN de la base de données│
│  Il ENCAPSULE toute la logique SQL              │
└─────────────────────────────────────────────────┘
```

**Ses missions :**

1. 🗄️ **Exécuter** les requêtes SQL (SELECT, INSERT, UPDATE, DELETE)
2. 🔄 **Transformer** les résultats SQL en objets JavaScript
3. 🛡️ **Protéger** contre les injections SQL (requêtes préparées)
4. ✅ **Valider** le format des données avant insertion
5. 📦 **Retourner** des données structurées et cohérentes

### 🎭 Métaphore de la bibliothèque

| Rôle               | Équivalent MVC  | Responsabilité                  |
| :----------------- | :-------------- | :------------------------------ |
| **Usager**         | Contrôleur      | Demande un livre                |
| **Bibliothécaire** | Modèle          | Cherche dans les archives (BDD) |
| **Archives**       | Base de données | Stocke les livres               |
| **Livre**          | Objet retourné  | Résultat structuré              |

Le bibliothécaire (modèle) connaît l'organisation des archives. L'usager (contrôleur) n'a pas besoin de savoir où chercher !

---

## 🏗️ Architecture & Responsabilités

### 📊 Table de Responsabilités

| Composant           | Ce qu'il DOIT faire                                                                                                              | Ce qu'il ne doit JAMAIS faire                                                                                |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Modèle**          | • Écrire les requêtes SQL<br>• Transformer snake_case → camelCase<br>• Valider les contraintes métier<br>• Gérer les erreurs SQL | • Accéder à `req` ou `res`<br>• Rendre des vues<br>• Faire des redirections<br>• Contenir de la logique HTTP |
| **Contrôleur**      | • Appeler les méthodes du Modèle<br>• Gérer les codes HTTP<br>• Choisir la vue                                                   | • Écrire du SQL<br>• Se connecter à la BDD                                                                   |
| **Base de données** | • Stocker les données<br>• Garantir l'intégrité                                                                                  | • Contenir de la logique métier                                                                              |

### 🔒 Principe de responsabilité unique

```javascript
// ❌ MAUVAIS : Logique SQL dans le contrôleur
async index(req, res) {
  const query = "SELECT * FROM items";
  const result = await db.query(query);
  res.render("items/index", { items: result.rows });
}

// ✅ BON : Le contrôleur délègue au Modèle
async index(req, res) {
  const items = await Item.findAll(); // Le Modèle s'occupe du SQL
  res.render("items/index", { items });
}
```

---

## 📡 Flux de données avec la BDD

Voici le cycle complet d'une requête de lecture :

```text
┌─────────────────────────────────────────────────────────────┐
│             FLUX MODÈLE ↔ BASE DE DONNÉES                   │
└─────────────────────────────────────────────────────────────┘

    [1] Contrôleur appelle le Modèle
                │
                ▼
    ┌─────────────────────────────────────┐
    │         MODÈLE (Item.js)            │
    │  static async findAll() {           │
    │    const query = "SELECT * ...";    │
    └──────────────┬──────────────────────┘
                   │
    [2] Exécution de la requête SQL
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │      POOL DE CONNEXIONS             │
    │  (database.js)                      │
    │  ┌───────────────────────────────┐  │
    │  │ pool.query(sql, params)       │  │
    │  └───────────────┬───────────────┘  │
    └──────────────────┼──────────────────┘
                       │
    [3] Requête envoyée à PostgreSQL
                       │
                       ▼
    ┌──────────────────────────────────────────────┐
    │       POSTGRESQL (memoria_db_dev)            │
    │  ┌────────────────────────────────────────┐  │
    │  │ Table: items                           │  │
    │  │ ┌────┬─────────┬──────────┬─────────┐ │  │
    │  │ │ id │ title   │ content  │ slug    │ │  │
    │  │ ├────┼─────────┼──────────┼─────────┤ │  │
    │  │ │ 1  │ Promise │ async... │ promise │ │  │
    │  │ └────┴─────────┴──────────┴─────────┘ │  │
    │  └────────────────────────────────────────┘  │
    └──────────────┬───────────────────────────────┘
                   │
    [4] Résultat SQL brut (rows)
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │         MODÈLE (Item.js)            │
    │  const { rows } = await db.query(); │
    │  ┌───────────────────────────────┐  │
    │  │ Transformation :              │  │
    │  │ SQL (snake_case)              │  │
    │  │   ↓                           │  │
    │  │ JS (camelCase)                │  │
    │  │                               │  │
    │  │ new Item(rows[0])             │  │
    │  └───────────────────────────────┘  │
    └──────────────┬──────────────────────┘
                   │
    [5] Retour d'objets JavaScript structurés
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │         CONTRÔLEUR                  │
    │  const items = await Item.findAll();│
    │  → [Item, Item, Item...]            │
    └─────────────────────────────────────┘
```

---

## 🔧 Anatomie d'un Modèle

### Structure de base

```javascript
/**
 * @fileoverview Modèle pour les Items (Pépites)
 */

import db from "../config/database.js";

/**
 * @class Item
 * @description Représente une pépite de connaissance
 */
export class Item {
  // ═══════════════════════════════════════════════════════════
  // CONSTRUCTEUR (Mapping SQL → JS)
  // ═══════════════════════════════════════════════════════════

  constructor(row) {
    this.id = row.id_item; // snake_case → camelCase
    this.userId = row.user_id;
    this.title = row.title;
    this.content = row.content;
    this.createdAt = row.created_at;
    // ...
  }

  // ═══════════════════════════════════════════════════════════
  // MÉTHODES STATIQUES CRUD
  // ═══════════════════════════════════════════════════════════

  static async findAll() {
    /* ... */
  }
  static async findById(id) {
    /* ... */
  }
  static async create(data) {
    /* ... */
  }
  static async update(id, data) {
    /* ... */
  }
  static async delete(id) {
    /* ... */
  }
}
```

### 🧩 Les 4 parties d'une méthode de modèle

```javascript
static async methodName(params) {
  // ═══════════════════════════════════════════════════════════
  // PARTIE 1 : PRÉPARATION DE LA REQUÊTE SQL
  // ═══════════════════════════════════════════════════════════
  const query = /*sql*/ `
    SELECT * FROM items
    WHERE id_item = $1;
  `;
  // $1, $2... = placeholders (requêtes préparées)

  // ═══════════════════════════════════════════════════════════
  // PARTIE 2 : EXÉCUTION DE LA REQUÊTE
  // ═══════════════════════════════════════════════════════════
  const { rows } = await db.query(query, [params]);
  // rows = tableau d'objets bruts (snake_case)

  // ═══════════════════════════════════════════════════════════
  // PARTIE 3 : GESTION DES CAS LIMITES
  // ═══════════════════════════════════════════════════════════
  if (rows.length === 0) return null; // Aucun résultat

  // ═══════════════════════════════════════════════════════════
  // PARTIE 4 : TRANSFORMATION & RETOUR
  // ═══════════════════════════════════════════════════════════
  return new Item(rows[0]); // Objet JavaScript (camelCase)
}
```

---

## 🗂️ Mapping SQL ↔ JavaScript

### 🔄 Pourquoi convertir snake_case → camelCase ?

| Convention     | Utilisation          | Exemple                            |
| :------------- | :------------------- | :--------------------------------- |
| **snake_case** | Bases de données SQL | `id_item`, `created_at`, `user_id` |
| **camelCase**  | JavaScript           | `idItem`, `createdAt`, `userId`    |

### 📋 Table de correspondance

```javascript
constructor(row) {
  // PostgreSQL (snake_case)  →  JavaScript (camelCase)
  this.id = row.id_item;
  this.userId = row.user_id;
  this.contentType = row.content_type;
  this.thumbnailUrl = row.thumbnail_url;
  this.createdAt = row.created_at;
  this.updatedAt = row.updated_at;
}
```

### 💡 Pourquoi utiliser un constructeur ?

```javascript
// ❌ SANS CONSTRUCTEUR (fastidieux et répétitif)
static async findAll() {
  const { rows } = await db.query('SELECT * FROM items');

  return rows.map(row => ({
    id: row.id_item,
    userId: row.user_id,
    contentType: row.content_type,
    title: row.title,
    // ... à répéter dans CHAQUE méthode !
  }));
}

// ✅ AVEC CONSTRUCTEUR (centralisé et réutilisable)
static async findAll() {
  const { rows } = await db.query('SELECT * FROM items');
  return rows.map(row => new Item(row)); // Conversion automatique !
}
```

---

## 🛡️ Requêtes Préparées (Sécurité)

### ⚠️ Le danger : Injection SQL

```javascript
// ❌ EXTRÊMEMENT DANGEREUX !
static async findById(id) {
  const query = `SELECT * FROM items WHERE id_item = '${id}'`;
  //                                                   ↑ Injection possible !
  const { rows } = await db.query(query);
  return new Item(rows[0]);
}
```

**Attaque possible :**

```javascript
const maliciousId = "1'; DROP TABLE items; --";
await Item.findById(maliciousId);
// Requête exécutée : SELECT * FROM items WHERE id_item = '1'; DROP TABLE items; --'
// → Table supprimée ! 💥
```

### ✅ La solution : Paramètres bindés

```javascript
// ✅ SÉCURISÉ avec requêtes préparées
static async findById(id) {
  const query = `SELECT * FROM items WHERE id_item = $1`;
  //                                                  ↑ Placeholder
  const { rows } = await db.query(query, [id]);
  //                                      ↑ Paramètre échappé automatiquement
  return new Item(rows[0]);
}
```

**Avec l'attaque :**

```javascript
const maliciousId = "1'; DROP TABLE items; --";
await Item.findById(maliciousId);
// PostgreSQL cherchera littéralement un id_item valant "1'; DROP TABLE items; --"
// → Aucun résultat, pas de dégât ! ✅
```

### 📋 Syntaxe des placeholders

```javascript
// 1 paramètre
db.query("SELECT * FROM items WHERE id = $1", [id]);

// Multiples paramètres
db.query("SELECT * FROM items WHERE category = $1 AND user_id = $2", [
  category,
  userId,
]);

// INSERT avec RETURNING
db.query("INSERT INTO items (title, content) VALUES ($1, $2) RETURNING *", [
  title,
  content,
]);
```

### 🎯 Règle d'or

```text
┌─────────────────────────────────────────────────┐
│  JAMAIS de concaténation dans les requêtes SQL │
│  TOUJOURS utiliser des placeholders ($1, $2...) │
└─────────────────────────────────────────────────┘
```

---

## 📋 Méthodes CRUD Standards

Voici les 5 méthodes de base que tout modèle devrait implémenter :

### 1. **findAll()** - Lire toutes les ressources

```javascript
/**
 * @returns {Promise<Item[]|null>}
 */
static async findAll() {
  const query = /*sql*/ `
    SELECT * FROM items
    ORDER BY created_at DESC;
  `;
  const { rows } = await db.query(query);

  if (rows.length === 0) return null;

  return rows.map(row => new Item(row));
}
```

**Cas d'usage :** Liste complète des pépites

---

### 2. **findById(id)** - Lire une ressource

```javascript
/**
 * @param {string} id - UUID de la pépite
 * @returns {Promise<Item|null>}
 */
static async findById(id) {
  const query = /*sql*/ `
    SELECT * FROM items
    WHERE id_item = $1;
  `;
  const { rows } = await db.query(query, [id]);

  if (rows.length === 0) return null;

  return new Item(rows[0]);
}
```

**Cas d'usage :** Page de détails d'une pépite

---

### 3. **create(data)** - Créer une ressource

```javascript
/**
 * @param {Object} data - Données de la pépite
 * @returns {Promise<Item>}
 */
static async create(data) {
  const query = /*sql*/ `
    INSERT INTO items (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [data.title, data.content, data.userId];
  const { rows } = await db.query(query, values);

  return new Item(rows[0]);
}
```

**RETURNING \*** retourne la ligne insérée (avec id généré, timestamps...)

---

### 4. **update(id, data)** - Modifier une ressource

```javascript
/**
 * @param {string} id - UUID de la pépite
 * @param {Object} data - Nouvelles données (partielles)
 * @returns {Promise<Item|null>}
 */
static async update(id, data) {
  const query = /*sql*/ `
    UPDATE items
    SET
      title = COALESCE($1, title),
      content = COALESCE($2, content)
    WHERE id_item = $3
    RETURNING *;
  `;

  const values = [data.title, data.content, id];
  const { rows } = await db.query(query, values);

  return rows[0] ? new Item(rows[0]) : null;
}
```

**COALESCE(nouvelle, ancienne)** permet la mise à jour partielle

---

### 5. **delete(id)** - Supprimer une ressource

```javascript
/**
 * @param {string} id - UUID de la pépite
 * @returns {Promise<boolean>}
 */
static async delete(id) {
  const query = /*sql*/ `
    DELETE FROM items
    WHERE id_item = $1;
  `;

  const result = await db.query(query, [id]);

  return result.rowCount > 0; // true si suppression réussie
}
```

**rowCount** indique le nombre de lignes affectées

---

## ✅ Bonnes Pratiques

### 1. Toujours valider les données avant insertion

```javascript
static async create(data) {
  // Validation métier
  if (!data.title || data.title.length < 3) {
    throw new Error("Le titre doit contenir au moins 3 caractères");
  }

  if (!data.content) {
    throw new Error("Le contenu est obligatoire");
  }

  // ... puis insertion
}
```

### 2. Utiliser des transactions pour les opérations multiples

```javascript
static async createWithTags(itemData, tags) {
  const client = await db.connect(); // Client dédié

  try {
    await client.query('BEGIN'); // Début de transaction

    // Créer l'item
    const itemResult = await client.query(
      'INSERT INTO items (title, content) VALUES ($1, $2) RETURNING *',
      [itemData.title, itemData.content]
    );
    const item = itemResult.rows[0];

    // Créer les tags
    for (const tag of tags) {
      await client.query(
        'INSERT INTO item_tags (item_id, tag_id) VALUES ($1, $2)',
        [item.id_item, tag.id]
      );
    }

    await client.query('COMMIT'); // Valider la transaction
    return new Item(item);

  } catch (error) {
    await client.query('ROLLBACK'); // Annuler en cas d'erreur
    throw error;
  } finally {
    client.release(); // Libérer le client
  }
}
```

### 3. Gérer les erreurs PostgreSQL

```javascript
static async create(data) {
  try {
    const query = /*sql*/ `
      INSERT INTO items (title, slug)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const { rows } = await db.query(query, [data.title, data.slug]);
    return new Item(rows[0]);

  } catch (error) {
    // Erreur de clé dupliquée (slug déjà existant)
    if (error.code === '23505') {
      throw new Error('Ce slug existe déjà');
    }

    // Erreur de contrainte NOT NULL
    if (error.code === '23502') {
      throw new Error('Un champ obligatoire est manquant');
    }

    // Autre erreur
    throw error;
  }
}
```

### 4. Utiliser COALESCE pour les mises à jour partielles

```javascript
// ✅ BON : Seuls les champs fournis sont modifiés
UPDATE items
SET
  title = COALESCE($1, title),           -- Si $1 = null, garde l'ancien titre
  content = COALESCE($2, content)
WHERE id_item = $3;

// ❌ MAUVAIS : Écraserait avec NULL
UPDATE items
SET
  title = $1,                            -- Si $1 = null, met NULL !
  content = $2
WHERE id_item = $3;
```

### 5. Commentaires SQL dans les templates literals

```javascript
const query = /*sql*/ `
  SELECT * FROM items;
`;
```

Le commentaire `/*sql*/` active la coloration syntaxique avec l'extension VSCode **es6-string-html**.

---

## ❌ Anti-patterns à éviter

### 1. SQL non paramétré (injection)

```javascript
// ❌ DANGER !
static async findByTitle(title) {
  const query = `SELECT * FROM items WHERE title = '${title}'`;
  const { rows } = await db.query(query);
  return rows.map(row => new Item(row));
}

// ✅ BON
static async findByTitle(title) {
  const query = `SELECT * FROM items WHERE title = $1`;
  const { rows } = await db.query(query, [title]);
  return rows.map(row => new Item(row));
}
```

### 2. Retourner directement rows

```javascript
// ❌ MAUVAIS : Mélange snake_case et camelCase
static async findAll() {
  const { rows } = await db.query('SELECT * FROM items');
  return rows; // { id_item: '...', user_id: '...' } 🤢
}

// ✅ BON : Transformation systématique
static async findAll() {
  const { rows } = await db.query('SELECT * FROM items');
  return rows.map(row => new Item(row)); // Objets cohérents
}
```

### 3. SELECT \*

```javascript
// ❌ PAS OPTIMAL (charge des colonnes inutiles)
SELECT * FROM items;

// ✅ MIEUX (sélection explicite)
SELECT id_item, title, content, created_at
FROM items;
```

### 4. Logique métier complexe dans le Modèle

```javascript
// ❌ MAUVAIS : Logique de calcul dans le Modèle
static async findAll() {
  const { rows } = await db.query('SELECT * FROM items');

  // ⚠️ Calcul de statistiques → devrait être dans un Service !
  const stats = rows.reduce((acc, item) => {
    acc.totalWords += item.content.split(' ').length;
    return acc;
  }, { totalWords: 0 });

  return { items: rows.map(r => new Item(r)), stats };
}

// ✅ BON : Le Modèle retourne juste les données
static async findAll() {
  const { rows } = await db.query('SELECT * FROM items');
  return rows.map(row => new Item(row));
}
// → Les calculs se font dans un ItemService
```

### 5. Oublier le constructeur pour le mapping

```javascript
// ❌ FASTIDIEUX ET RÉPÉTITIF
static async findById(id) {
  const { rows } = await db.query(...);

  return {
    id: rows[0].id_item,
    userId: rows[0].user_id,
    title: rows[0].title,
    // ... à répéter partout !
  };
}

// ✅ CENTRALISÉ
static async findById(id) {
  const { rows } = await db.query(...);
  return new Item(rows[0]); // Mapping automatique
}
```

---

## 🎓 Checklist du bon Modèle

Avant de valider votre code, vérifiez :

- [ ] Toutes les requêtes utilisent des placeholders ($1, $2...)
- [ ] Le constructeur mappe snake_case → camelCase
- [ ] Les méthodes sont statiques (`static async`)
- [ ] `findAll()` retourne `null` si vide (pas `[]`)
- [ ] `findById()` retourne `null` si non trouvé
- [ ] `update()` utilise COALESCE pour mise à jour partielle
- [ ] `delete()` retourne un booléen
- [ ] `create()` utilise RETURNING \*
- [ ] Aucune logique HTTP (pas de `req`, `res`)
- [ ] Validation des données métier avant insertion
- [ ] Gestion des erreurs PostgreSQL spécifiques
- [ ] Pas de `SELECT *` inutile (sélection explicite)

---

## 📊 Tableau Récapitulatif

| Méthode            | SQL    | Paramètres         | Retour             | Cas d'usage         |
| :----------------- | :----- | :----------------- | :----------------- | :------------------ |
| `findAll()`        | SELECT | Aucun              | `Item[]` ou `null` | Liste complète      |
| `findById(id)`     | SELECT | 1 (id)             | `Item` ou `null`   | Page détails        |
| `create(data)`     | INSERT | N (données)        | `Item`             | Formulaire création |
| `update(id, data)` | UPDATE | N+1 (données + id) | `Item` ou `null`   | Formulaire édition  |
| `delete(id)`       | DELETE | 1 (id)             | `boolean`          | Suppression         |

---

## 🔗 Ressources Complémentaires

- [PostgreSQL - Documentation officielle](https://www.postgresql.org/docs/)
- [node-postgres (pg) - Guide](https://node-postgres.com/)
- [SQL Injection - OWASP](https://owasp.org/www-community/attacks/SQL_Injection)
- [Active Record Pattern](https://en.wikipedia.org/wiki/Active_record_pattern)

---

_Dernière mise à jour : 24/01/2026_

---
