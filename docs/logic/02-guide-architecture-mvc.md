# 🏗️ Architecture MVC & POO

Ce projet repose sur le pattern **MVC** (Modèle-Vue-Contrôleur) couplé à la **Programmation Orientée Objet (POO)**. Cette structure permet de séparer les responsabilités pour rendre le code maintenable, testable et évolutif.

---

### 📑 Sommaire
- [💎 Pourquoi la POO ?](#-pourquoi-la-poo-)
- [🧩 Les 3 Piliers du MVC](#-les-3-piliers-du-mvc)
- [📡 Flux de données (Schéma ANSI)](#-flux-de-données-schéma-ansi)
- [🛠️ Détail des Responsabilités](#️-détail-des-responsabilités)

---

## 💎 Pourquoi la POO ?

Nous utilisons des **Classes ES6** pour structurer notre logique.

- **Organisation :** Au lieu d'avoir des dizaines de fonctions éparpillées, nous regroupons les actions par thématique (ex: `ItemController`, `ItemModel`).
- **Méthodes Statiques :** Nous utilisons principalement des méthodes `static`. Cela permet d'appeler `ItemModel.findAll()` sans avoir besoin d'instancier la classe avec `new`, ce qui est parfait pour des services de données.
- **Encapsulation :** La logique métier est "enfermée" dans ses classes respectives. Le routeur n'a pas besoin de savoir *comment* la base de données fonctionne, il appelle juste une méthode.

---

## 🧩 Les 3 Piliers du MVC

### 1. Le Modèle (Model) - **"La Donnée"**
Le modèle est le seul composant qui parle à la base de données (PostgreSQL).
- **Rôle :** Récupérer, insérer, mettre à jour ou supprimer des données.
- **Emplacement :** `src/models/`
- **Exemple :** `ItemModel.js` contient les requêtes SQL.

### 2. La Vue (View) - **"L'Interface"**
La vue est ce que l'utilisateur voit à l'écran. Nous utilisons le moteur de template **EJS**.
- **Rôle :** Transformer des données JavaScript en HTML dynamique.
- **Emplacement :** `src/views/`
- **Exemple :** `home.ejs` affiche la liste des items.

### 3. Le Contrôleur (Controller) - **"Le Cerveau"**
Le contrôleur fait le lien entre le Modèle et la Vue.
- **Rôle :** Reçoit la requête, demande les données au Modèle, et dit à la Vue de s'afficher.
- **Emplacement :** `src/controllers/`
- **Exemple :** `ItemController.js`.

---

## 📡 Flux de données (Schéma ANSI)

Voici comment circule l'information quand un utilisateur visite une page :

```text
      [ UTILISATEUR ]
            |
      (1) Requête HTTP (ex: GET /items)
            v
      [  ROUTEUR  ]  --> (2) Dirige vers la bonne méthode du Controller
            |
            v
    +-------------------+
    |   CONTROLEUR      | <--- (3) Appelle une méthode statique
    | (ItemController)  |
    +---------+---------+
              |
      ________|________
     |                 |
     v                 v
[ MODÈLE ]        [   VUE   ]
(ItemModel)       (index.ejs)
     |                 |
(4) SQL Query    (5) Reçoit Data
     |        -------->|
(DB PostgreSQL)  (6) Génère HTML
                       |
     v_________________|
     |
(7) Réponse HTTP (HTML envoyé au navigateur)
```

---

## 🛠️ Détail des Responsabilités

| Composant | Responsabilité principale | Ce qu'il ne doit JAMAIS faire |
| :--- | :--- | :--- |
| **Routeur** | Faire le lien entre une URL et un Contrôleur. | Contenir de la logique métier ou SQL. |
| **Contrôleur** | Gérer `req` et `res`. Orchestrer le flux. | Écrire du SQL ou manipuler directement la DB. |
| **Modèle** | Exécuter les requêtes SQL. Valider le format SQL. | Faire des redirections (`res.redirect`) ou des rendus de page. |
| **Vue** | Afficher les données proprement en HTML. | Faire des appels à la base de données. |

### Exemple de POO dans notre projet :

```javascript
// src/controllers/ItemController.js
export class ItemController {
  static async showAll(req, res) {
    // Le contrôleur demande au modèle
    const items = await ItemModel.findAll();
    // Le contrôleur donne à la vue
    res.render("home", { items });
  }
}
```

---

_Dernière mise à jour : 24/01/2026_

---

