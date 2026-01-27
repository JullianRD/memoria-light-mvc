# 🚨 Gestion des Erreurs & Asynchronisme (Architecture POO & SSR)

Ce document détaille comment l'application capture les erreurs à travers les différentes couches (Modèle -> Contrôleur) et affiche des pages d'erreur (404, 500) aux utilisateurs.

## 🧠 Qu'est-ce qu'un Middleware ?

Un **Middleware** est une fonction intermédiaire (un "filtre") qui s'exécute entre la réception de la requête par le serveur et l'envoi de la réponse HTML au navigateur.

Dans notre architecture, la chaîne fonctionne ainsi :

1. **Routeur :** Reçoit la requête `/items/12`.
2. **Contrôleur (Méthode de classe) :** Orchestre l'action.
3. **Modèle (Méthode de classe) :** Interagit avec la base de données.
4. **Middleware d'Erreur :** Le "filet de sécurité" qui s'active uniquement si une erreur est levée (`throw`) ou si une promesse échoue.

```text
[NAVIGATEUR] --> [ROUTEUR] --> [CONTROLEUR] --> [MODÈLE]
                                     |             |
                                     |      (ERREUR SQL OU MÉTIER)
                                     v             v
                          [MIDDLEWARE D'ERREUR CENTRALISÉ]
                                     |
                          [RENDU DE LA VUE error.ejs]
```

## ⚡ Express 5 et l'Asynchrone

Grâce à **Express 5**, la gestion des erreurs asynchrones est native.

- Nous n'utilisons **aucun bloc `try/catch`** dans nos contrôleurs ou modèles.
- Si une erreur survient dans un `await`, Express 5 la capture automatiquement et la transmet au middleware de gestion d'erreur.

## 🏗️ Implémentation en POO

### 1. La Classe d'Erreur Personnalisée (`AppError`)

Elle permet de créer des erreurs avec un message et un code HTTP spécifique.

```javascript
// src/utils/AppError.js
export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "AppError";
  }
}
```

### 2. Le Modèle (`Item.js`)

Le modèle est responsable de la donnée. S'il ne trouve rien, il peut lever une erreur.

```javascript
// src/models/Item.js
import { pool } from "../config/db.js";

export class Item {
  static async findById(id) {
    const sql = "SELECT * FROM item WHERE id = $1";
    const result = await pool.query(sql, [id]);
    return result.rows[0]; // Renvoie l'item ou undefined
  }
}
```

### 3. Le Contrôleur (`ItemController.js`)

Le contrôleur appelle le modèle. S'il y a un problème, il "throw" une erreur que le middleware attrapera.

```javascript
// src/controllers/item.controller.js
import { Item } from "../models/Item.js";
import { AppError } from "../utils/AppError.js";

export class ItemController {
  static async show(req, res) {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) {
      // L'erreur est lancée ici et capturée par Express 5
      throw new AppError("Cette pépite n'existe pas", 404);
    }

    res.render("items/show", { item });
  }
}
```

### 4. Le Middleware de Gestion d'Erreur (Final)

C'est le dernier middleware déclaré dans `app.js`. Il reçoit l'erreur et affiche la vue EJS correspondante.

```javascript
// src/middlewares/error-handler.js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  console.error(`❌ [${err.name}] : ${err.message}`);

  res.status(statusCode).render("error", {
    message: err.message,
    status: statusCode,
    // On n'affiche la pile (stack) qu'en développement
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
```

## 🛡️ Erreurs de Base de Données

Les erreurs SQL (ex: mauvais format d'ID, connexion perdue) sont automatiquement remontées par le Modèle. Le middleware d'erreur les intercepte et affiche une page 500 propre à l'utilisateur au lieu de faire crasher le serveur.

| Erreur          | Source               | Résultat Utilisateur      |
| :-------------- | :------------------- | :------------------------ |
| **Non trouvé**  | Contrôleur (`!item`) | Page 404                  |
| **ID Invalide** | Modèle (Postgres)    | Page 500 (ou 400 si géré) |
| **Crash DB**    | Pool Postgres        | Page 500                  |

---

_Dernière mise à jour : 24/01/2026_

---
