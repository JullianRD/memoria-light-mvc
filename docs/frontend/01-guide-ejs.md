# 🎨 Guide EJS - Moteur de Template pour Node.js

Ce document est un guide complet sur **EJS (Embedded JavaScript)**, le moteur de template utilisé pour le rendu côté serveur (SSR) dans notre application.

---

## 📑 Sommaire

- [🎯 Qu'est-ce qu'EJS ?](#-quest-ce-quejs-)
- [⚙️ Installation et Configuration](#️-installation-et-configuration)
- [📂 Architecture des Vues](#-architecture-des-vues)
- [🏗️ Système de Layout (ejs-mate)](#️-système-de-layout-ejs-mate)
- [🧩 Composants Réutilisables (Partials)](#-composants-réutilisables-partials)
- [📝 Syntaxe EJS Complète](#-syntaxe-ejs-complète)
- [🔄 Passage de Données](#-passage-de-données)
- [🖼️ Gestion des Assets (Public)](#️-gestion-des-assets-public)
- [🛡️ Sécurité et Échappement](#️-sécurité-et-échappement)
- [✅ Bonnes Pratiques](#-bonnes-pratiques)
- [❌ Anti-patterns à Éviter](#-anti-patterns-à-éviter)
- [🎓 Checklist de la bonne Vue EJS](#-checklist-de-la-bonne-vue-ejs)

---

## 🎯 Qu'est-ce qu'EJS ?

**EJS** (Embedded JavaScript) est un moteur de template simple qui permet d'injecter du JavaScript directement dans du HTML.

### 🧠 Principe de base

```text
┌─────────────────────────────────────────────────────────┐
│  Données JS + Template EJS  →  HTML final               │
└─────────────────────────────────────────────────────────┘

Contrôleur (JS)           Template (EJS)          Résultat (HTML)
─────────────────────────────────────────────────────────────────
const items = [           <ul>                    <ul>
  {title: "React"},         <% items.forEach %>     <li>React</li>
  {title: "Vue"}              <li><%= title %>      <li>Vue</li>
]                           <% }) %>              </ul>
                          </ul>
```

### ✨ Caractéristiques

| Caractéristique       | Description                            |
| :-------------------- | :------------------------------------- |
| **Syntaxe familière** | Proche du HTML classique avec `<% %>`  |
| **JavaScript pur**    | Pas de nouveau langage à apprendre     |
| **Légèreté**          | Pas de compilation complexe            |
| **Flexibilité**       | Logique JavaScript complète disponible |
| **Partials**          | Réutilisation de composants            |
| **Layouts**           | Templates maîtres (avec ejs-mate)      |

---

## ⚙️ Installation et Configuration

### 📦 Installation des dépendances

```bash
npm install ejs ejs-mate
```

### 🔧 Configuration Express

**Fichier : `app.js`**

```javascript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";

const app = express();

// Configuration du chemin absolu (nécessaire en ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1️⃣ Définir EJS-Mate comme moteur de layout
app.engine("ejs", ejsMate);

// 1️⃣ Définir EJS comme moteur de vue par défaut
app.set("view engine", "ejs");

// 2️⃣ Définir le dossier des vues
app.set("views", path.join(__dirname, "views"));

// 3️⃣ Définir le dossier des fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));
```

### 🎯 Pourquoi `path.join(__dirname, ...)` ?

```javascript
// ❌ MAUVAIS : Chemin relatif (bug selon où on lance le serveur)
app.set("views", "./views");

// ✅ BON : Chemin absolu (fonctionne toujours)
app.set("views", path.join(__dirname, "views"));
```

**Problème sans chemin absolu :**

```bash
# Si on lance depuis la racine : ✅ OK
node src/app.js

# Si on lance depuis src/ : ❌ Erreur (cherche dans src/views)
cd src && node app.js
```

---

## 📂 Architecture des Vues

Nous utilisons une **séparation stricte** entre les pages complètes, le squelette de l'app (layout) et les fragments réutilisables (partials).

### 🗂️ Structure des dossiers

```text
views/
├── layouts/            # 🏗️ Squelettes globaux (HTML, Head, Body)
│   └── main.ejs        # Layout principal de l'application
│
├── partials/           # 🧩 Fragments réutilisables
│   ├── header.ejs      # Balises <head>, meta, CSS
│   ├── navbar.ejs      # Navigation haute
│   └── footer.ejs      # Scripts JS et copyright
│
└── pages/              # 📄 Contenu spécifique à chaque route
    ├── home.ejs        # Page d'accueil
    │
    └── items/          # Vues liées aux "Pépites"
        ├── index.ejs   # Liste de toutes les pépites (GET /items)
        ├── new.ejs  # Formulaire de création (GET /items/new)
        ├── show.ejs    # Détails d'une pépite (GET /items/:id)
        └── edit.ejs    # Formulaire d'édition (GET /items/:id/edit)
```

### 🎯 Correspondance Routes ↔ Vues

| Route HTTP            | Fichier Vue              | Rôle                 |
| :-------------------- | :----------------------- | :------------------- |
| `GET /`               | `pages/home.ejs`         | Page d'accueil       |
| `GET /items`          | `pages/items/index.ejs`  | Liste des pépites    |
| `GET /items/new`      | `pages/items/create.ejs` | Formulaire création  |
| `GET /items/:id`      | `pages/items/show.ejs`   | Détails d'une pépite |
| `GET /items/:id/edit` | `pages/items/edit.ejs`   | Formulaire édition   |

---

## 🏗️ Système de Layout (ejs-mate)

Pour éviter la **répétition de code HTML** (DOCTYPE, head, nav, footer), nous utilisons **`ejs-mate`**. Le fichier `main.ejs` sert de **"coquille"** pour toutes les pages.

### 📋 Template Maître

**Fichier : `views/layouts/main.ejs`**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <!-- Inclusion du partial header (meta, CSS) -->
    <%- include('../partials/header') %>
  </head>

  <body>
    <!-- Inclusion du partial navbar (navigation) -->
    <%- include('../partials/navbar') %>

    <!-- 🎯 ZONE D'INJECTION : Le contenu de chaque page sera injecté ici -->
    <main class="container">
      <%- body -%>
      <!-- ⚠️ C'est ici que le contenu spécifique de chaque page apparaît -->
    </main>

    <!-- Inclusion du partial footer (scripts, copyright) -->
    <%- include('../partials/footer') %>
  </body>
</html>
```

### 📋 Utilisation dans une Page

**Fichier : `views/pages/items/index.ejs`**

```ejs
<!-- 1️⃣ Définir quel layout utiliser -->
<% layout('layouts/main') %>

<!-- 2️⃣ Tout le code ci-dessous sera injecté dans <%- body %> -->
<h1>Liste des Pépites</h1>

<div class="items-grid">
  <% items.forEach(item => { %>
    <article class="item-card">
      <h2><%= item.title %></h2>
      <p><%= item.content.substring(0, 100) %>...</p>
      <a href="/items/<%= item.id %>">Lire plus</a>
    </article>
  <% }) %>
</div>
```

### 🔄 Processus de Rendu

```text
┌─────────────────────────────────────────────────────────┐
│  1. Contrôleur appelle res.render('pages/items/index')  │
│  2. EJS-Mate lit le layout défini (layouts/main)        │
│  3. Remplace <%- body %> par le contenu de index.ejs    │
│  4. Inclut les partials (header, navbar, footer)        │
│  5. Génère le HTML final complet                        │
└─────────────────────────────────────────────────────────┘

AVANT (Code source)          APRÈS (HTML généré)
──────────────────────────────────────────────────────────
<% layout('layouts/main') %> <!DOCTYPE html>
                             <html>
<h1>Liste</h1>               <head>...</head>
<% items.forEach... %>       <body>
                               <nav>...</nav>
                               <main>
                                 <h1>Liste</h1>
                                 <div>...</div>
                               </main>
                               <footer>...</footer>
                             </body>
                             </html>
```

---

## 🧩 Composants Réutilisables (Partials)

Les **partials** sont des **morceaux de code HTML réutilisables** qui ne changent pas ou peu entre les pages.

### 📋 Exemples de Partials

#### **Fichier : `views/partials/header.ejs`**

```html
<!-- Balises meta et liens CSS -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta
  name="description"
  content="<%= description || 'Application de gestion de pépites' %>"
/>
<title><%= title || 'Ma Super App' %></title>

<!-- CSS -->
<link rel="stylesheet" href="/css/style.css" />
```

#### **Fichier : `views/partials/navbar.ejs`**

```html
<nav class="navbar">
  <div class="container">
    <a href="/" class="logo">🎯 Mon App</a>

    <ul class="nav-links">
      <li><a href="/">Accueil</a></li>
      <li><a href="/items">Pépites</a></li>
      <li><a href="/items/new">Nouvelle pépite</a></li>
    </ul>
  </div>
</nav>
```

#### **Fichier : `views/partials/footer.ejs`**

```html
<footer class="footer">
  <div class="container">
    <p>&copy; 2026 Mon Application | Tous droits réservés</p>
  </div>
</footer>

<!-- Scripts JavaScript -->
<script src="/js/main.js"></script>
```

### 🔄 Inclusion d'un Partial

```ejs
<!-- ✅ Syntaxe de base -->
<%- include('partials/navbar') %>

<!-- ✅ Avec chemin relatif depuis un sous-dossier -->
<%- include('../partials/navbar') %>

<!-- ✅ Avec passage de données -->
<%- include('partials/button', {
  label: 'Envoyer',
  color: 'primary',
  icon: '📤'
}) %>
```

### 📋 Partial avec Données

**Fichier : `views/partials/button.ejs`**

```html
<button class="btn btn-<%= color || 'default' %>">
  <% if (icon) { %>
  <span class="icon"><%= icon %></span>
  <% } %> <%= label %>
</button>
```

**Utilisation :**

```ejs
<!-- Bouton avec toutes les options -->
<%- include('partials/button', {
  label: 'Envoyer',
  color: 'primary',
  icon: '📤'
}) %>
<!-- Résultat : <button class="btn btn-primary"><span>📤</span>Envoyer</button> -->

<!-- Bouton minimal -->
<%- include('partials/button', { label: 'Annuler' }) %>
<!-- Résultat : <button class="btn btn-default">Annuler</button> -->
```

---

## 📝 Syntaxe EJS Complète

### 🎯 Les 4 Balises Principales

| Balise   | Nom               | Fonction                           | Usage               |
| :------- | :---------------- | :--------------------------------- | :------------------ |
| `<%= %>` | **Output escapé** | Affiche et **protège** contre XSS  | Données utilisateur |
| `<%- %>` | **Output brut**   | Affiche **sans protection**        | Partials, HTML sûr  |
| `<% %>`  | **Scriptlet**     | Exécute du code **sans affichage** | Boucles, conditions |
| `<%# %>` | **Commentaire**   | Commentaire **non affiché**        | Documentation       |

### 📋 1. Affichage Sécurisé : `<%= %>`

**Échappe automatiquement les caractères dangereux** (protection XSS).

```ejs
<!-- ✅ TOUJOURS utiliser pour les données utilisateur -->
<h1><%= item.title %></h1>
<p><%= item.content %></p>
<span><%= user.email %></span>

<!-- 🔒 Caractères transformés automatiquement -->
<%= "<script>alert('XSS')</script>" %>
<!-- Résultat : &lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt; -->
<!-- Le navigateur affiche le texte, n'exécute PAS le script ✅ -->
```

**Transformations automatiques :**

| Caractère | Transformé en | Pourquoi                         |
| :-------- | :------------ | :------------------------------- |
| `<`       | `&lt;`        | Empêche les balises HTML         |
| `>`       | `&gt;`        | Empêche les balises HTML         |
| `"`       | `&quot;`      | Empêche la fermeture d'attributs |
| `'`       | `&#39;`       | Empêche la fermeture d'attributs |
| `&`       | `&amp;`       | Empêche les injections d'entités |

---

### 📋 2. Affichage Brut : `<%- %>`

**N'échappe PAS le HTML** → À utiliser UNIQUEMENT pour du contenu contrôlé.

```ejs
<!-- ✅ BON : Inclure un partial (contenu contrôlé) -->
<%- include('partials/navbar') %>

<!-- ✅ BON : HTML généré par l'application -->
<%- generateBreadcrumb(path) %>

<!-- ❌ DANGEREUX : Afficher du contenu utilisateur -->
<%- item.content %>
<!-- Si item.content = "<script>alert('XSS')</script>", le script s'exécute ! -->

<!-- ✅ BON : Utiliser <%= à la place -->
<%= item.content %>
<!-- Le script ne s'exécute pas, il est affiché comme du texte ✅ -->
```

**⚠️ Règle d'or :** Utilisez `<%- %>` UNIQUEMENT pour :

- Inclure des partials : `<%- include('...') %>`
- Afficher du HTML généré par VOTRE code (pas par l'utilisateur)

---

### 📋 3. Code JavaScript : `<% %>`

**Exécute du code sans rien afficher** → Pour la logique (boucles, conditions).

```ejs
<!-- ✅ Condition simple -->
<% if (user.isAdmin) { %>
  <button>Supprimer</button>
<% } %>

<!-- ✅ Condition avec else -->
<% if (items.length > 0) { %>
  <p>Il y a <%= items.length %> pépites</p>
<% } else { %>
  <p>Aucune pépite pour le moment</p>
<% } %>

<!-- ✅ Boucle forEach -->
<ul>
  <% items.forEach(item => { %>
    <li><%= item.title %></li>
  <% }) %>
</ul>

<!-- ✅ Boucle for classique -->
<% for (let i = 0; i < items.length; i++) { %>
  <div><%= items[i].title %></div>
<% } %>

<!-- ✅ Assignation de variable -->
<%
  const formattedDate = new Date(item.createdAt).toLocaleDateString('fr-FR');
  const isRecent = Date.now() - new Date(item.createdAt) < 86400000; // 24h
%>
<p>Publié le <%= formattedDate %></p>
<% if (isRecent) { %>
  <span class="badge">Nouveau</span>
<% } %>
```

---

### 📋 4. Commentaires : `<%# %>`

**Commentaires EJS invisibles dans le HTML généré**.

```ejs
<%# TODO : Ajouter la pagination ici %>

<%#
  Cette section affiche les pépites les plus récentes
  Format : Card avec titre, extrait et lien
%>

<!-- Différence avec les commentaires HTML -->
<!-- Ce commentaire HTML sera visible dans le code source -->
<%# Ce commentaire EJS ne sera PAS dans le code source %>
```

---

### 📋 Opérations Avancées

#### **Valeurs par défaut (Fallback)**

```ejs
<!-- ✅ Afficher une valeur ou un fallback -->
<h1><%= title || 'Sans titre' %></h1>
<p><%= description || 'Aucune description disponible' %></p>

<!-- ✅ Avec opérateur ternaire -->
<span class="<%= item.isPublished ? 'published' : 'draft' %>">
  <%= item.isPublished ? 'Publié' : 'Brouillon' %>
</span>
```

#### **Formatage de dates**

```ejs
<!-- ❌ MAUVAIS : Date brute illisible -->
<%= item.createdAt %>
<!-- Résultat : 2026-01-22T10:30:00.000Z -->

<!-- ✅ BON : Date formatée dans le contrôleur -->
<!-- Contrôleur : -->
const formattedDate = item.createdAt.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

<!-- Vue : -->
<%= formattedDate %>
<!-- Résultat : 22 janvier 2026 -->

<!-- ✅ ACCEPTABLE : Formatage simple dans la vue -->
<%= new Date(item.createdAt).toLocaleDateString('fr-FR') %>
<!-- Résultat : 22/01/2026 -->
```

#### **Manipulation de chaînes**

```ejs
<!-- ✅ Extraire un extrait -->
<p><%= item.content.substring(0, 150) %>...</p>

<!-- ✅ Mettre en majuscules -->
<h2><%= item.title.toUpperCase() %></h2>

<!-- ✅ Compter les éléments -->
<span>(<%= items.length %> résultats)</span>
```

#### **Classes CSS dynamiques**

```ejs
<!-- ✅ Classe conditionnelle simple -->
<div class="card <%= item.isFeatured ? 'featured' : '' %>">

<!-- ✅ Classe selon le type -->
<span class="badge badge-<%= item.contentType %>">
  <%= item.contentType %>
</span>
<!-- Résultat : <span class="badge badge-article">article</span> -->

<!-- ✅ Plusieurs conditions -->
<article class="
  item
  <%= item.isPublished ? 'published' : 'draft' %>
  <%= item.isFeatured ? 'featured' : '' %>
">
```

---

## 🔄 Passage de Données

### 📋 Depuis le Contrôleur

**Fichier : `controllers/ItemController.js`**

```javascript
class ItemController {
  async index(req, res) {
    try {
      // 1️⃣ Récupérer les données du modèle
      const items = await Item.findAll();

      // 2️⃣ Préparer les données pour la vue
      const pageData = {
        title: "Liste des pépites",
        description: "Découvrez toutes nos pépites de connaissance",
        items: items || [],
        itemCount: items ? items.length : 0,
        currentUser: req.user || null,
      };

      // 3️⃣ Rendre la vue avec les données
      res.render("pages/items/index", pageData);
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).render("pages/error", {
        message: "Erreur lors du chargement des pépites",
      });
    }
  }
}
```

### 📋 Dans la Vue

**Fichier : `views/pages/items/index.ejs`**

```ejs
<% layout('layouts/main') %>

<!-- Les variables du contrôleur sont directement accessibles -->
<h1><%= title %></h1>
<p class="subtitle"><%= description %></p>

<% if (items.length === 0) { %>
  <p class="empty-state">Aucune pépite pour le moment 😔</p>
  <a href="/items/new" class="btn">Créer la première pépite</a>
<% } else { %>
  <p>Total : <%= itemCount %> pépite(s)</p>

  <div class="items-grid">
    <% items.forEach(item => { %>
      <article class="item-card">
        <h2><%= item.title %></h2>
        <p><%= item.content.substring(0, 100) %>...</p>
        <a href="/items/<%= item.id %>">Lire plus →</a>
      </article>
    <% }) %>
  </div>
<% } %>

<% if (currentUser && currentUser.isAdmin) { %>
  <a href="/admin" class="btn btn-admin">Administration</a>
<% } %>
```

---

## 🖼️ Gestion des Assets (Public)

Le dossier `public/` est le **seul dossier accessible directement par le navigateur**.

### 📂 Structure des Assets

```text
public/
├── css/
│   ├── style.css       # Styles principaux
│   └── components.css  # Composants réutilisables
│
├── js/
│   ├── main.js         # JavaScript principal
│   └── forms.js        # Validation de formulaires
│
├── images/
│   ├── logo.svg        # Logo de l'application
│   └── placeholders/   # Images par défaut
│
└── fonts/              # Polices personnalisées
    └── custom-font.woff2
```

### 🔧 Configuration Express

**Fichier : `app.js`**

```javascript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Configuration du chemin absolu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Déclaration du dossier statique
app.use(express.static(path.join(__dirname, "public")));
```

### 📋 Utilisation dans les Vues

**Fichier : `views/partials/header.ejs`**

```html
<!-- ✅ BON : Chemin relatif à /public -->
<link rel="stylesheet" href="/css/style.css" />
<link rel="stylesheet" href="/css/components.css" />

<!-- ❌ MAUVAIS : Ne pas mettre 'public' dans le chemin -->
<link rel="stylesheet" href="/public/css/style.css" />
```

**Fichier : `views/pages/home.ejs`**

```html
<!-- ✅ Images -->
<img src="/images/logo.svg" alt="Logo" />

<!-- ✅ Polices personnalisées (dans le CSS) -->
<!-- Dans public/css/style.css -->
@font-face { font-family: 'CustomFont'; src: url('/fonts/custom-font.woff2')
format('woff2'); }
```

**Fichier : `views/partials/footer.ejs`**

```html
<!-- ✅ Scripts JavaScript -->
<script src="/js/main.js"></script>
<script src="/js/forms.js"></script>
```

### 🔄 Processus de Résolution

```text
┌─────────────────────────────────────────────────────────┐
│  Requête navigateur : GET /css/style.css                │
│                                                          │
│  1. Express vérifie si 'public/css/style.css' existe   │
│  2. Si oui → Envoie le fichier                         │
│  3. Si non → Passe à la route suivante                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🛡️ Sécurité et Échappement

### ⚠️ Faille XSS (Cross-Site Scripting)

**Scénario d'attaque :**

```javascript
// Un utilisateur malveillant crée une pépite avec ce contenu :
const maliciousContent = "<script>alert('Vos données sont volées !');</script>";

// Si vous utilisez <%- %>, le script s'exécute ! ❌
```

**Vue vulnérable :**

```ejs
<!-- ❌ DANGEREUX : Le script s'exécute -->
<div class="content">
  <%- item.content %>
</div>
<!-- Résultat : <script>alert('...')</script> s'exécute dans le navigateur ! -->
```

**Vue sécurisée :**

```ejs
<!-- ✅ SÉCURISÉ : Le script est affiché comme du texte -->
<div class="content">
  <%= item.content %>
</div>
<!-- Résultat : &lt;script&gt;alert(...)&lt;/script&gt; -->
<!-- Le navigateur affiche le texte, ne l'exécute PAS ✅ -->
```

### 🔒 Règles de Sécurité

| Contexte                     | Balise à utiliser                       | Exemple                         |
| :--------------------------- | :-------------------------------------- | :------------------------------ |
| **Données utilisateur**      | `<%= %>`                                | `<%= user.name %>`              |
| **Contenu HTML utilisateur** | `<%= %>` + bibliothèque de sanitization | `<%= sanitize(item.content) %>` |
| **Partials**                 | `<%- %>`                                | `<%- include('navbar') %>`      |
| **HTML généré par l'app**    | `<%- %>`                                | `<%- generateMenu() %>`         |

### 📦 Sanitization du HTML

Si vous voulez autoriser **certaines balises HTML** (gras, italique) tout en bloquant les scripts :

```bash
npm install dompurify jsdom
```

**Fichier : `utils/sanitize.js`**

```javascript
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
  });
}
```

**Dans le contrôleur :**

```javascript
import { sanitizeHTML } from "../utils/sanitize.js";

const item = await Item.findById(id);
item.content = sanitizeHTML(item.content);

res.render("pages/items/show", { item });
```

**Dans la vue :**

```ejs
<!-- Maintenant c'est sécurisé d'utiliser <%- %> -->
<div class="content">
  <%- item.content %>
</div>
<!-- Les balises <b>, <i> sont autorisées, mais pas <script> ✅ -->
```

---

## ✅ Bonnes Pratiques

### 1. Séparation des Responsabilités

```ejs
<!-- ❌ MAUVAIS : Logique métier dans la vue -->
<%
  const user = await User.findById(userId);
  const isAdmin = user.role === 'admin' && user.verified;
%>

<!-- ✅ BON : Tout est préparé dans le contrôleur -->
<!-- Contrôleur : -->
const user = await User.findById(userId);
const isAdmin = user.role === 'admin' && user.verified;
res.render('dashboard', { user, isAdmin });

<!-- Vue : -->
<% if (isAdmin) { %>
  <button>Admin Panel</button>
<% } %>
```

---

### 2. Gestion des Tableaux Vides

```ejs
<!-- ❌ MAUVAIS : Risque d'erreur si items est null -->
<% items.forEach(item => { %>
  <li><%= item.title %></li>
<% }) %>

<!-- ✅ BON : Vérifier l'existence et la longueur -->
<% if (items && items.length > 0) { %>
  <ul>
    <% items.forEach(item => { %>
      <li><%= item.title %></li>
    <% }) %>
  </ul>
<% } else { %>
  <p>Aucune pépite disponible</p>
<% } %>

<!-- ✅ MIEUX : Gérer dans le contrôleur -->
<!-- Contrôleur : -->
res.render('items/index', {
  items: items || [] // Toujours un tableau
});

<!-- Vue : -->
<% if (items.length === 0) { %>
  <p>Aucune pépite disponible</p>
<% } else { %>
  <ul>
    <% items.forEach(item => { %>
      <li><%= item.title %></li>
    <% }) %>
  </ul>
<% } %>
```

---

### 3. Partials pour Éviter la Duplication

```ejs
<!-- ❌ MAUVAIS : Code dupliqué sur plusieurs pages -->
<!-- page1.ejs -->
<nav>
  <a href="/">Accueil</a>
  <a href="/items">Pépites</a>
</nav>

<!-- page2.ejs -->
<nav>
  <a href="/">Accueil</a>
  <a href="/items">Pépites</a>
</nav>

<!-- ✅ BON : Utiliser un partial -->
<!-- partials/navbar.ejs -->
<nav>
  <a href="/">Accueil</a>
  <a href="/items">Pépites</a>
</nav>

<!-- page1.ejs et page2.ejs -->
<%- include('partials/navbar') %>
```

---

### 4. Valeurs par Défaut

```ejs
<!-- ❌ MAUVAIS : Risque d'affichage vide -->
<h1><%= title %></h1>
<!-- Si title est undefined → Erreur ! -->

<!-- ✅ BON : Fallback avec || -->
<h1><%= title || 'Sans titre' %></h1>

<!-- ✅ BON : Vérification explicite -->
<h1>
  <% if (title) { %>
    <%= title %>
  <% } else { %>
    Sans titre
  <% } %>
</h1>
```

---

### 5. Formatage des Dates

```ejs
<!-- ❌ MAUVAIS : Date brute illisible -->
<p>Publié le <%= item.createdAt %></p>
<!-- Résultat : Publié le 2026-01-22T10:30:00.000Z -->

<!-- ✅ BON : Formater dans le contrôleur -->
<!-- Contrôleur : -->
items.forEach(item => {
  item.formattedDate = new Date(item.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

<!-- Vue : -->
<p>Publié le <%= item.formattedDate %></p>
<!-- Résultat : Publié le 22 janvier 2026 -->

<!-- ✅ ACCEPTABLE : Formatage simple dans la vue -->
<p>Publié le <%= new Date(item.createdAt).toLocaleDateString('fr-FR') %></p>
<!-- Résultat : Publié le 22/01/2026 -->
```

---

### 6. Classes CSS Dynamiques

```ejs
<!-- ✅ Classe conditionnelle -->
<div class="card <%= item.isFeatured ? 'featured' : '' %>">

<!-- ✅ Classe selon une variable -->
<span class="badge badge-<%= item.contentType %>">
  <%= item.contentType %>
</span>

<!-- ✅ Plusieurs conditions -->
<article class="
  item
  <%= item.isPublished ? 'published' : 'draft' %>
  <%= item.isFeatured ? 'featured' : '' %>
  <%= item.isNew ? 'new' : '' %>
">
```

---

### 7. Formulaires avec Valeurs Pré-remplies

```ejs
<!-- ✅ Formulaire d'édition -->
<form action="/items/<%= item.id %>?_method=PUT" method="POST">

  <!-- Pré-remplir les inputs -->
  <input
    type="text"
    name="title"
    value="<%= item.title %>"
    required
  >

  <!-- Pré-remplir un textarea -->
  <textarea name="content" required><%= item.content %></textarea>

  <!-- Pré-sélectionner une option -->
  <select name="contentType">
    <option value="article" <%= item.contentType === 'article' ? 'selected' : '' %>>
      Article
    </option>
    <option value="book" <%= item.contentType === 'book' ? 'selected' : '' %>>
      Livre
    </option>
    <option value="note" <%= item.contentType === 'note' ? 'selected' : '' %>>
      Note
    </option>
  </select>

  <button type="submit">Mettre à jour</button>
</form>
```

---

## ❌ Anti-patterns à Éviter

### 1. Requêtes SQL dans la Vue

```ejs
<!-- ❌ TERRIBLE : Accès direct à la base de données -->
<% const items = await db.query('SELECT * FROM items'); %>

<!-- ✅ BON : Le contrôleur prépare tout -->
<!-- Contrôleur : -->
const items = await Item.findAll();
res.render('items/index', { items });
```

---

### 2. Logique Métier Complexe

```ejs
<!-- ❌ MAUVAIS : Calcul complexe dans la vue -->
<%
  const total = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity * (1 - item.discount));
  }, 0);
%>
<p>Total : <%= total %>€</p>

<!-- ✅ BON : Calcul dans le contrôleur -->
<!-- Contrôleur : -->
const total = calculateTotal(items);
res.render('cart', { items, total });

<!-- Vue : -->
<p>Total : <%= total %>€</p>
```

---

### 3. Logique HTTP dans la Vue

```ejs
<!-- ❌ TERRIBLE : Redirection dans la vue -->
<% if (!user) { %>
  <% res.redirect('/login'); %>
<% } %>

<!-- ✅ BON : Le contrôleur gère les redirections -->
<!-- Contrôleur : -->
if (!req.user) {
  return res.redirect('/login');
}
res.render('dashboard', { user: req.user });
```

---

### 4. HTML Non Échappé pour Données Utilisateur

```ejs
<!-- ❌ DANGEREUX : Faille XSS -->
<div><%- item.content %></div>

<!-- ✅ SÉCURISÉ : Échappement automatique -->
<div><%= item.content %></div>

<!-- ✅ SÉCURISÉ : HTML autorisé mais sanitizé -->
<!-- Contrôleur : -->
item.content = sanitizeHTML(item.content);

<!-- Vue : -->
<div><%- item.content %></div>
```

---

### 5. Partials Non Utilisés

```ejs
<!-- ❌ MAUVAIS : Navigation dupliquée partout -->
<!-- home.ejs -->
<nav><a href="/">Accueil</a><a href="/items">Pépites</a></nav>

<!-- items.ejs -->
<nav><a href="/">Accueil</a><a href="/items">Pépites</a></nav>

<!-- ✅ BON : Un seul partial réutilisé -->
<!-- partials/navbar.ejs -->
<nav><a href="/">Accueil</a><a href="/items">Pépites</a></nav>

<!-- home.ejs et items.ejs -->
<%- include('partials/navbar') %>
```

---

## 🎓 Checklist de la bonne Vue EJS

Avant de valider votre code, vérifiez :

### Sécurité

- [ ] Toutes les données utilisateur utilisent `<%= %>` (échappement)
- [ ] `<%- %>` est utilisé uniquement pour partials et HTML contrôlé
- [ ] Pas de requêtes SQL dans la vue
- [ ] Pas d'appels aux modèles dans la vue

### Structure

- [ ] Le layout est défini avec `<% layout('layouts/main') %>`
- [ ] Les partials sont utilisés pour éviter la duplication
- [ ] L'arborescence `layouts/`, `partials/`, `pages/` est respectée
- [ ] Les noms de fichiers sont cohérents avec les routes

### Données

- [ ] Les tableaux vides sont gérés (pas d'erreur si `null`)
- [ ] Les valeurs par défaut sont définies avec `||`
- [ ] Les dates sont formatées proprement
- [ ] Les calculs complexes sont faits dans le contrôleur

### HTML/CSS

- [ ] Les classes CSS dynamiques sont propres
- [ ] Les assets (CSS/JS/images) sont dans `/public`
- [ ] Les chemins assets ne contiennent pas `/public/` dans l'URL
- [ ] Les formulaires ont des validations HTML5

### Performance

- [ ] Pas de code JavaScript lourd dans les vues
- [ ] Les images ont des attributs `width` et `height`
- [ ] Les assets sont minifiés en production

### Accessibilité

- [ ] Les images ont un attribut `alt`
- [ ] Les formulaires ont des `<label>` associés
- [ ] La structure sémantique HTML est respectée

---

## 📊 Tableau Récapitulatif

| Élément               | Syntaxe EJS                     | Usage                          | Exemple                                |
| :-------------------- | :------------------------------ | :----------------------------- | :------------------------------------- |
| **Affichage texte**   | `<%= var %>`                    | Données utilisateur (sécurisé) | `<%= item.title %>`                    |
| **Affichage HTML**    | `<%- var %>`                    | Partials, HTML sûr             | `<%- include('header') %>`             |
| **Code JS**           | `<% code %>`                    | Logique, boucles, conditions   | `<% items.forEach(...) %>`             |
| **Commentaire**       | `<%# texte %>`                  | Documentation                  | `<%# TODO: Pagination %>`              |
| **Condition**         | `<% if (cond) { %>`             | Affichage conditionnel         | `<% if (user) { %>`                    |
| **Boucle**            | `<% array.forEach(item => { %>` | Liste d'éléments               | `<% items.forEach(item => { %>`        |
| **Valeur par défaut** | `<%= var \|\| 'default' %>`     | Fallback                       | `<%= title \|\| 'Sans titre' %>`       |
| **Layout**            | `<% layout('path') %>`          | Définir le template maître     | `<% layout('layouts/main') %>`         |
| **Partial**           | `<%- include('path') %>`        | Inclure un composant           | `<%- include('partials/nav') %>`       |
| **Partial + data**    | `<%- include('path', {}) %>`    | Passer des variables           | `<%- include('btn', {label: 'OK'}) %>` |

---

## 🔗 Ressources Complémentaires

### 📚 Documentation officielle

- [EJS Documentation](https://ejs.co/)
- [Express.js - Template Engines](https://expressjs.com/en/guide/using-template-engines.html)

### 🛡️ Sécurité

- [OWASP - XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify - HTML Sanitization](https://github.com/cure53/DOMPurify)

### 🎓 Tutoriels

- [MDN - Template Literals](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Template_literals)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

_Dernière mise à jour : 24/01/2026_

---
