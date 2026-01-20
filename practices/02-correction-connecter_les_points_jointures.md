### 🟢 Correction : Phase 2 - Les Jointures

Prends bien le temps d'observer comment on utilise les Alias (i, u, it) pour éviter d'écrire le nom des tables en entier, c'est une convention très utilisée en entreprise pour garder un code lisible.

#### 📄 Fichier : `05_items_with_authors.sql`
*L'enjeu : Faire le pont entre la pépite et celui qui l'a écrite.*

```sql
SELECT
    i.title,
    i.content_type,
    u.pseudo
FROM items AS i
INNER JOIN users AS u ON i.user_id = u.id_user;
```
> **Note pédagogique :** L' `INNER JOIN` est strict. Si par erreur une pépite n'avait pas d'auteur (ce qui est impossible avec nos contraintes `NOT NULL`), elle n'apparaîtrait pas ici.

---

#### 📄 Fichier : `06_full_audit_logs.sql`
*L'enjeu : Ne perdre aucune donnée, même quand le lien n'existe pas.*

```sql
SELECT
    ae.message,
    u.email
FROM app_events AS ae
LEFT JOIN users AS u ON ae.user_id = u.id_user;
```
> **Note pédagogique :** Le `LEFT JOIN` est crucial ici. Il dit à la base : "Donne-moi TOUS les logs (`app_events`). Si tu trouves un utilisateur correspondant, affiche son email. Sinon, affiche `NULL`." C'est parfait pour voir les messages système comme "Application Memoria démarrée".

---

#### 📄 Fichier : `07_user_stats_count.sql`
*L'enjeu : Transformer des lignes de données en statistiques.*

```sql
SELECT
    u.pseudo,
    COUNT(i.id_item) AS total_pepites
FROM users AS u
LEFT JOIN items AS i ON u.id_user = i.user_id
GROUP BY u.pseudo;
```
> **Note pédagogique :**
> 1. J'ai utilisé un `LEFT JOIN` pour voir aussi les utilisateurs qui ont **zéro** pépite.
> 2. Le `GROUP BY` est obligatoire dès que tu utilises une fonction de calcul comme `COUNT`.

---

#### 📄 Fichier : `08_items_by_tags.sql`
*L'enjeu : Traverser la table "Pivot" pour relier deux mondes.*

```sql
SELECT
    i.title AS pepite,
    t.tag_name AS nom_du_tag
FROM items AS i
JOIN item_tags AS it ON i.id_item = it.id_item
JOIN tags AS t ON it.id_tag = t.id_tag;
```
> **Note pédagogique :** C'est la requête la plus importante pour ton futur frontend. C'est elle qui permet d'afficher les petits badges de couleurs (tags) sous le titre de tes pépites. On fait "deux sauts" : `items` -> `item_tags` puis `item_tags` -> `tags`.

---

### 🧠 Bilan de cette phase

Tu viens de réaliser ce qu'on appelle des **Requêtes Relationnelles**.
- Tu maîtrises le lien entre les **clés primaires** (`id_user`, `id_item`) et les **clés étrangères** (`user_id`).
- Tu sais extraire des données propres pour un tableau de bord.

**Est-ce que tu te sens prêt à passer à la Phase 3 : Les Vues et l'Analyse ?**
Nous allons apprendre à enregistrer ces requêtes complexes pour que l'API n'ait plus qu'à appeler un seul nom (ex: `SELECT * FROM v_dashboard`).
