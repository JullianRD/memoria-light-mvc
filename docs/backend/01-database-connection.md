# 🔌 Connexion PostgreSQL (Client)

Ce document explique comment notre application communique avec la base de données.

## ❓ C'est quoi le "Client" ?

Dans le monde de Node.js et PostgreSQL, le **Client** (via le driver `pg`) est l'interprète.

- Il fait le pont entre le **JavaScript** (ton code) et le **SQL** (la base de données).
- Son rôle est d'ouvrir un canal de communication, d'envoyer ta requête au serveur Postgres, et de te ramener le résultat sous forme d'objet JSON.

## 🏗️ Schéma de Fonctionnement

```text
[ APPLICATION ]   <-- "Est-ce que l'item #1 existe ?" (JavaScript)
      |
      v
[   CLIENT    ]   <-- Traduit et transporte la question
      |
      v
[ POSTGRESQL ]   <-- "SELECT * FROM item..." (SQL)
```

## 🛠️ Pourquoi utiliser un "Pool" plutôt qu'un "Client" seul ?

Bien qu'on puisse créer un seul `Client` pour toute l'application, on utilise un **Pool** (une "piscine" de clients) pour l'efficacité :

1.  **Le Client unique :** Si 100 utilisateurs font une requête en même temps, ils doivent faire la queue car le client ne peut traiter qu'une chose à la fois.
2.  **Le Pool (Notre choix) :** C'est un gestionnaire qui maintient plusieurs clients ouverts simultanément. Si un client est occupé, le pool en donne un autre à l'utilisateur suivant.

```text
                    [ GESTIONNAIRE DE POOL ]
                   /           |            \
            [Client 1]    [Client 2]    [Client 3]
               |             |             |
               v             v             v
            [        BASE DE DONNÉES         ]
```

## ⚙️ Configuration du Code

**Fichier :** `src/database/database.js`

```javascript
import pg from "pg";

const { Pool } = pg;

// Le Pool utilise automatiquement ton fichier .env pour se configurer :
// PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT
export const pool = new Pool();

// Événement déclenché quand un nouveau client est créé dans le pool
pool.on("connect", () => {
  console.log("🐘 Nouveau client connecté au Pool");
});

pool.on("error", (err) => {
  console.error("⚠️ Erreur inattendue d'un client du Pool", err);
});
```

## 🔒 Sécurité : Requêtes Paramétrées

Le Client possède une protection intégrée contre les injections SQL. On ne lui donne jamais une chaîne de caractères déjà remplie, on lui donne le **modèle** de la requête et les **données** séparément.

```javascript
// ✅ SÉCURISÉ : Le client nettoie les données avant de les envoyer
const sql = "SELECT * FROM item WHERE id = $1";
const values = [idItem];
const result = await pool.query(sql, values);

// ❌ DANGEREUX : L'utilisateur pourrait injecter du code SQL dans la variable id
const sql = `SELECT * FROM item WHERE id = ${idItem}`;
```

---

_Dernière mise à jour : 22/01/2026_

---
