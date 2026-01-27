# 🧭 Logique de Routage & Contrôleurs

Ce document explique comment l'utilisateur navigue sur le site et comment le code répond à ses demandes. Nous utilisons l'architecture **MVC** (Modèle-Vue-Contrôleur).

---

### 📑 Sommaire

- [🍽️ Le MVC expliqué simplement](#️-le-mvc-expliqué-simplement)
- [🏗️ Schéma du flux (Comment ça circule ?)](#️-schéma-du-flux-comment-ça-circule-)
- [🛠️ Les 7 actions standards (CRUD)](#️-les-7-actions-standards-crud)
- [🛣️ Table des Routes (Le GPS du projet)](#️-table-des-routes-le-gps-du-projet)
- [🔒 Middlewares : Les points de contrôle](#-middlewares--les-points-de-contrôle)

---

## 🍽️ Le MVC expliqué simplement

Pour comprendre le rôle de chaque dossier, utilise la métaphore du **Restaurant** :

1.  **Le Client (Navigateur) :** Il passe une commande (tape une URL, ex: `/items/42`).
2.  **Le Serveur (Le Routage) :** Il reçoit la commande et l'envoie au bon serveur.
3.  **Le Contrôleur (Le Serveur) :** C'est lui qui orchestre tout. Il ne cuisine pas, il ne dresse pas les assiettes, il donne des ordres.
4.  **Le Modèle (Le Cuisinier) :** Il est le seul à avoir accès au frigo (**la Base de données**). Il prépare les données brutes.
5.  **La Vue (L'Assiette) :** C'est la présentation finale (**le HTML/EJS**). C'est ce que le client voit et mange.

---

## 🏗️ Schéma du flux (Comment ça circule ?)

Voici le chemin d'une requête quand un utilisateur veut voir une "Pépite" :

```text
  [ UTILISATEUR ]
        |
    (1) Tape l'URL : /items/12
        |
        v
  [ ROUTER.JS ]  ---------- (2) "C'est pour le ItemController.show !"
        |
        v
  [ ITEMCONTROLLER ] <----> [ MODEL ] (3) "Donne-moi les infos de l'item 12"
        |                        ^
        |                        | (La DB répond avec les données)
        v
  [ VIEW (EJS) ] <--------- (4) "Prends ces données et crée la page HTML"
        |
        v
  [ UTILISATEUR ] --------- (5) "Ah, jolie page !"
```

---

## 🛠️ Les 7 actions standards (CRUD)

Pour ne pas se perdre, on utilise toujours les mêmes noms de fonctions dans nos contrôleurs. C'est ce qu'on appelle les **conventions REST**.

| Nom       | Action             | Ce que ça fait (en français)                         |
| :-------- | :----------------- | :--------------------------------------------------- |
| `index`   | **Liste**          | "Montre-moi tous les éléments."                      |
| `show`    | **Détails**        | "Montre-moi cet élément précis (via son ID)."        |
| `create`  | **Formulaire**     | "Donne-moi la page pour créer un nouvel élément."    |
| `store`   | **Enregistrement** | "Prends ce que j'ai tapé et enregistre-le en DB."    |
| `edit`    | **Modif (Vue)**    | "Donne-moi le formulaire pour modifier cet élément." |
| `update`  | **Modif (Action)** | "Applique les changements dans la DB."               |
| `destroy` | **Suppression**    | "Efface cet élément."                                |

---

## 🛣️ Table des Routes (Vue d'ensemble)

C'est la carte d'identité de ton application. Elle lie l'URL à l'action du code.

### 📝 Ressources : Items (Pépites)

| Méthode  | Route               | Action                   | Vue EJS            | Usage                   |
| :------- | :------------------ | :----------------------- | :----------------- | :---------------------- |
| **GET**  | `/items`            | `itemController.index`   | `items/index.ejs`  | Voir toutes les pépites |
| **GET**  | `/items/new`        | `itemController.create`  | `items/create.ejs` | Afficher le formulaire  |
| **POST** | `/items`            | `itemController.store`   | _(Redirection)_    | Créer la pépite en DB   |
| **GET**  | `/items/:id`        | `itemController.show`    | `items/show.ejs`   | Voir une pépite précise |
| **GET**  | `/items/:id/edit`   | `itemController.edit`    | `items/edit.ejs`   | Formulaire d'édition    |
| **POST** | `/items/:id/update` | `itemController.update`  | _(Redirection)_    | Appliquer la modif      |
| **POST** | `/items/:id/delete` | `itemController.destroy` | _(Redirection)_    | Supprimer               |

> **💡 Note :** Le `:id` dans une route est une **variable**. Si tu tapes `/items/42`, alors `id` vaudra `42`.

---

## 🔒 Middlewares : Les points de contrôle

Un **Middleware**, c'est comme un videur à l'entrée d'une boîte de nuit. Il vérifie si tu as le droit de passer avant que le contrôleur ne travaille.

1.  **Validation :** "Est-ce que le titre de la pépite n'est pas vide ?"
2.  **Authentification :** "Es-tu bien connecté pour pouvoir supprimer ceci ?"

```javascript
// Exemple de lecture :
// Pour créer une pépite, on vérifie d'abord l'Auth, puis on Valide les données.
router.post("/items", auth.check, validate(itemSchema), itemController.store);
```

---

_Dernière mise à jour : 24/01/2026_

---
