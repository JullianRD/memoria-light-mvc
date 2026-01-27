C'est exact ! Pour que la documentation soit complète, il faut inclure l'étape d'installation. Je l'ai insérée juste après le sommaire.

Voici la version finale avec la section **Installation** :

---

# 🛡️ Validation avec Zod

Nous appliquons le principe du **"Zero Trust"** : aucune donnée provenant de l'utilisateur (`req.body`, `req.params`, `req.query`) n'est traitée sans être passée par un filtre **Zod**.

---

### 📑 Sommaire

- [📦 Installation](#-installation)
- [🚀 Pourquoi Zod dans notre architecture ?](#-pourquoi-zod-dans-notre-architecture-)
- [📂 Organisation](#-organisation)
- [📝 1. Définition d'un Schéma](#-1-définition-dun-schéma)
- [⚙️ 2. Le Middleware de Validation](#-2-le-middleware-de-validation)
- [🔗 3. Utilisation dans les Routes](#-3-utilisation-dans-les-routes)
- [🔄 Flux de validation (SSR)](#-flux-de-validation-ssr)
- [💡 Astuce : z.coerce](#-astuce--zcoerce)

---

## 📦 Installation

Pour ajouter Zod à votre projet, exécutez la commande suivante :

```bash
npm install zod
```

---

## 🚀 Pourquoi Zod dans notre architecture ?

- **Sécurité (XSS & Injections) :** Zod agit comme un bouclier. Si un utilisateur injecte des balises `<script>` là où on attend un nombre, Zod rejette la requête immédiatement.
- **Contrat de Données :** Il garantit que les données qui arrivent dans nos **Modèles** sont parfaitement typées (un "1" devient un nombre `1`, les espaces superflus sont supprimés).
- **Simplification des Contrôleurs :** Grâce au middleware, le contrôleur reçoit des données déjà propres. Plus besoin de vérifier si `req.body.title` existe.

## 📂 Organisation

1. **Schémas :** Définis dans `src/validation/schemas/`.
2. **Middleware :** Un utilitaire centralisé dans `src/middlewares/validate.js`.

## 📝 1. Définition d'un Schéma

```javascript
// src/validation/schemas/item_schema.js
import { z } from "zod";

export const itemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(100, "Le titre est trop long"),
  description: z.string().trim().optional(),
  price: z.coerce.number().positive("Le prix doit être positif"),
});
```

## ⚙️ 2. Le Middleware de Validation

Ce middleware générique permet de valider n'importe quel schéma. S'il y a une erreur, il crée une `AppError` que notre gestionnaire d'erreur global affichera.

```javascript
// src/middlewares/validate.js
import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // On récupère le premier message d'erreur de Zod
    const errorMsg = result.error.issues[0].message;
    throw new AppError(errorMsg, 400);
  }

  // On remplace req.body par les données "parsées" (nettoyées) par Zod
  req.body = result.data;
  next();
};
```

## 🔗 3. Utilisation dans les Routes

Le validateur se place juste **avant** le contrôleur dans la chaîne des middlewares.

```javascript
// src/routes/item.router.js
import { Router } from "express";
import { ItemController } from "../controllers/item.controller.js";
import { validate } from "../middlewares/validate.js";
import { itemSchema } from "../validation/schemas/item.schema.js";

const router = Router();

// Le middleware validate intercepte la requête avant ItemController.create
router.post("/items", validate(itemSchema), ItemController.create);

export default router;
```

## 🔄 Flux de validation (SSR)

1. **Envoi du formulaire :** L'utilisateur clique sur "Valider".
2. **Middleware `validate` :** Zod vérifie les champs.
   - **Échec :** `validate` fait un `throw new AppError`.
   - **Express 5 :** Capture l'erreur et appelle le `errorHandler`.
   - **Middleware d'erreur :** Affiche la vue `error.ejs` avec le message (ex: "Le titre est trop court").
3. **Succès :** Le contrôleur est appelé avec des données saines.

### Schéma de fonctionnement (ANSI) :

```text
       [ NAVIGATEUR ]
             |
      ( Soumission Form )
             v
    +-----------------------+
    |  Middleware VALIDATE  | <--- Utilise Zod (Schéma)
    +-----------+-----------+
                |
        ________|________
       |                 |
    [ÉCHEC]          [SUCCÈS]
       |                 |
       v                 v
  throw AppError    req.body = data (propre)
       |                 |
       v                 v
  EXPRESS 5        [ CONTRÔLEUR ]
(Capture Erreur)         |
       |                 v
       v           [   MODÈLE   ]
 [ ERROR HANDLER ]       |
       |                 v
       v           res.render("detail")
 res.render("error")     |
       |                 |
       v                 v
    [ AFFICHAGE PAGE ERREUR / SUCCÈS ]
```

### Explications des étapes clés :

1.  **Middleware VALIDATE** : C'est le portier. Il intercepte la requête avant même que le contrôleur ne soit au courant.
2.  **Branche ÉCHEC** : Si Zod trouve une erreur (ex: titre trop court), on "lève" une erreur (`throw`). Express 5 la détecte tout seul et l'envoie au bout de la chaîne : le **Error Handler**.
3.  **Branche SUCCÈS** : Le middleware nettoie les données (ex: enlève les espaces en trop) et les remet dans `req.body`. Le **Contrôleur** reçoit alors des données 100% fiables.
4.  **Finalité SSR** : Dans les deux cas, le serveur répond en générant du HTML (`res.render`), assurant que l'utilisateur ne quitte jamais l'interface visuelle du site.

## 💡 Astuce : `z.coerce`

Dans une application **SSR**, les formulaires envoient souvent tout sous forme de texte (String). Utilisez `z.coerce.number()` ou `z.coerce.date()` pour que Zod transforme automatiquement ces textes en vrais nombres ou objets Date avant qu'ils n'atteignent votre contrôleur.

---

_Dernière mise à jour : 24/01/2026_

---
