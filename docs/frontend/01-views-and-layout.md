# 🎨 Architecture Frontend (EJS & Assets)

Ce document décrit l'organisation des vues et la gestion des fichiers statiques pour le rendu côté serveur.

## 📌 Sommaire

1. [📂 Structure des dossiers](#1-structure-des-dossiers)
2. [🏗️ Système de Layout (ejs-mate)](#2-système-de-layout)
3. [🧩 Composants Réutilisables (Partials)](#3-composants-réutilisables-partials)
4. [🖼️ Gestion des Assets (Public)](#4-gestion-des-fichiers-statiques-assets)
5. [💡 Bonnes pratiques EJS](#5-bonnes-pratiques-ejs)

---

## 1. Structure des dossiers

Nous utilisons une séparation stricte entre les pages complètes, le squelette de l'app (layout) et les fragments réutilisables (partials).

```text
views/
├── layouts/            # Squelettes globaux (HTML, Head, Body)
│   └── main.ejs        # Layout principal
├── partials/           # Fragments (Nav, Footer, Buttons)
│   ├── header.ejs      # Balises meta et CSS
│   ├── navbar.ejs      # Navigation haute
│   └── footer.ejs      # Scripts et copyright
└── pages/              # Contenu spécifique à chaque route
    ├── home.ejs        # Accueil
    └── items/          # Vues liées aux "Pépites"
        ├── index.ejs   # Voir toutes les pépites
        ├── create.ejs  # Afficher le formulaire
        ├── show.ejs    # Voir une pépite précise
        └── edit.ejs    # Formulaire d'édition/modification
```

---

## 2. Système de Layout

Pour éviter la répétition de code, nous utilisons **`ejs-mate`**. Le fichier `main.ejs` sert de "coquille".

**Fichier : `views/layouts/main.ejs`**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <%- include('../partials/header') %>
  </head>
  <body>
    <%- include('../partials/navbar') %>

    <main class="container">
      <%- body -%>
      <!-- Ici sera injecté le contenu de la page -->
    </main>

    <%- include('../partials/footer') %>
  </body>
</html>
```

---

## 3. Composants Réutilisables (Partials)

Les partials sont des morceaux de code HTML qui ne changent pas ou peu.

- **Passage de données :** On peut passer des variables à un partial :
  `%- include('../partials/button', {label: 'Envoyer'}) %>`

---

## 4. Gestion des fichiers statiques (Assets)

Le dossier `public/` est le seul accessible directement par le navigateur.

### Structure

```text
public/
├── css/
│   └── style.css
├── js/
│   └── main.js
└── images/
    └── logo.svg
```

### Configuration Express

Dans `app.js`, nous déclarons le dossier statique en utilisant un chemin absolu pour éviter les erreurs selon l'endroit où le serveur est lancé :

```javascript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
```

---

## 5. Bonnes pratiques EJS

### ❌ À ne pas faire

Mettre de la logique complexe ou des requêtes à la base de données dans le fichier `.ejs`.

```html
<!-- MAUVAIS -->
<% const user = await db.query(...) %>
```

### ✅ À faire

Préparer toutes les données dans le **contrôleur** et n'utiliser EJS que pour l'affichage et les conditions simples.

```javascript
// Contrôleur
res.render("pages/home", {
  title: "Accueil",
  items: data,
});
```

### Échappement de sécurité

- `<%= variable %>` : **Échappe** les caractères spéciaux (contre les failles XSS). À utiliser par défaut.
- `<%- variable %>` : **N'échappe pas**. À utiliser uniquement pour inclure des partials ou du HTML sûr.

---

_Dernière mise à jour : 22/01/2026_

---
