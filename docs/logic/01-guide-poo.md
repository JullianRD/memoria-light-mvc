# 💎 Guide POO (Programmation Orientée Objet)

Si tu débutes, vois la **POO** comme une manière de ranger ton code dans des "boîtes intelligentes" au lieu de laisser traîner tes fonctions partout. Ce guide t'explique comment nous l'utilisons dans ce projet.

---

### 📑 Sommaire

- [🏠 La métaphore de la Maison](#-la-métaphore-de-la-maison)
- [🏗️ Classe vs Objet : Le moule et le gâteau](#️-classe-vs-objet--le-moule-et-le-gâteau)
- [⚡ Les méthodes `static` : La boîte à outils](#-les-méthodes-static--la-boîte-à-outils)
- [🎯 Pourquoi on fait ça dans notre projet ?](#-pourquoi-on-fait-ça-dans-notre-projet-)
- [💡 Résumé pour le débutant](#-résumé-pour-le-débutant)

---

## 🏠 La métaphore de la Maison

Imagine que tu construis une ville.

- **Sans POO :** Tu as une liste géante d'instructions en vrac : "Peindre un mur en bleu", "Installer une porte", "Peindre un autre mur en rouge". On s'y perd vite.
- **Avec la POO :** Tu crées un plan de "Maison". Ce plan dit qu'une maison a une couleur et une porte. Ensuite, tu n'as plus qu'à dire "Crée 3 maisons à partir de ce plan".

C'est ce qu'on fait avec nos **Utilisateurs**, nos **Produits** ou nos **Articles**.

---

## 🏗️ Classe vs Objet : Le moule et le gâteau

C'est le concept le plus important. La **Classe** est le plan de fabrication (le code), l'**Objet** est la construction réelle (la donnée en mémoire).

**Schéma : Le passage du Plan à la Réalité**

```text
      [ LA CLASSE ]                 [ L'OBJET (Instance) ]
     (Le Plan / Moule)              (La chose réelle)
    +-------------------+           +-----------------------+
    |   Classe : User   |           |   Utilisateur : "Alice" |
    |-------------------|           |-----------------------|
    | - nom             |           | - nom: "Alice"        |
    | - email           |  (new)    | - email: "ali@web.fr" |
    |                   | --------> +-----------------------+
    | + direBonjour()   |
    +-------------------+           +-----------------------+
                                    |   Utilisateur : "Bob"   |
                                    |-----------------------|
                                    | - nom: "Bob"          |
                                    | - email: "bob@web.fr" |
                                    +-----------------------+
```

- On écrit le code de la **Classe** une seule fois.
- On peut créer des milliers d'**Objets** (Alice, Bob, etc.) à partir de cette même classe avec le mot-clé `new`.

---

## ⚡ Les méthodes `static` : La boîte à outils

Dans notre projet, tu verras souvent le mot `static` devant les fonctions (méthodes). C'est comme une boîte à outils posée **sur** le moule, accessible sans avoir besoin de fabriquer un objet.

**Schéma : Méthode Statique vs Méthode d'Instance**

```text
       BOÎTE À OUTILS (Static)              ACTIONS DE L'OBJET
      Accès : Classe.methode()            Accès : objet.methode()
    +--------------------------+        +--------------------------+
    |      Classe : User       |        |    Instance (Alice)      |
    +--------------------------+        +--------------------------+
    | [STATIC]                 |        | [INSTANCE]               |
    | .findAll()  <------------|---OK   |                          |
    | (Chercher en BDD)        |        | .seConnecter() <---------|---OK
    +--------------------------+        +--------------------------+
               |                                   |
    (Pas besoin d'objet "Alice")          (Alice doit exister)
```

- **Static :** On demande à la classe `User` : _"Va chercher tout le monde en base de données"_. C'est une action globale.
- **Instance :** On demande à l'objet `Alice` : _"Affiche TON nom sur la page"_. C'est une action qui ne concerne qu'elle.

---

## 🎯 Pourquoi on fait ça dans notre projet ?

### 1. Pour ne pas se mélanger les pinceaux

Chaque fichier a son rôle (Architecture MVC) :

- Le **Controller** est le chef d'orchestre.
- Le **Model** est le spécialiste de la base de données.
  Grâce aux classes, on sait que tout ce qui touche aux "Produits" est rangé ensemble.

### 2. Pour la "Saisie automatique" (Auto-completion)

Comme on utilise des classes, ton éditeur de texte (VS Code) comprend mieux ton code. Quand tu tapes `User.`, il va te proposer automatiquement toutes les fonctions disponibles. C'est un gain de temps énorme !

### 3. Pour la maintenance

Si demain on change le nom d'une colonne en base de données, on modifie juste la Classe correspondante. Le reste de l'application (le routing, les vues) ne s'en rendra même pas compte.

---

## 💡 Résumé pour le débutant

| Terme                | Traduction "vraie vie"                              | Usage dans le code        |
| :------------------- | :-------------------------------------------------- | :------------------------ |
| **Classe**           | Un plan, une recette ou un moule.                   | `class User { ... }`      |
| **Instance (Objet)** | La chose réelle créée avec le plan.                 | `const luc = new User();` |
| **Méthode**          | Une action (une fonction dans la classe).           | `direBonjour()`           |
| **Static**           | Un outil pratique qu'on utilise sans créer d'objet. | `User.findAll()`          |

---

_Dernière mise à jour : 22/01/2026_

---
