### 🟢 Correction : Phase 3 - Agrégation et Vues Métier

L'objectif de cette phase était de passer de données brutes à des données **structurées**. Nous avons transformé des lignes SQL en objets prêts pour le Frontend (JSON) et créé des "raccourcis" (Vues) pour simplifier le futur code de ton API.

---

#### 📄 Fichier : `09_items_with_tags_json.sql`

_L'enjeu : Envoyer un tableau propre à React en une seule requête._

```sql
SELECT
    i.title,
    COALESCE(
        JSON_AGG(t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL),
        '[]'
    ) AS tags_list
FROM items AS i
LEFT JOIN item_tags AS it ON i.id_item = it.id_item
LEFT JOIN tags AS t ON it.id_tag = t.id_tag
GROUP BY i.id_item;
```

_Version plus robuste pour ton frontend React (notamment pour les key dans les boucles .map())_

```sql
CREATE OR REPLACE VIEW v_items_with_tags AS
SELECT
    i.id_item,
    i.user_id,
    i.title,
    i.content_type,
    i.thumbnail_url,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', t.id_tag,
                'name', t.tag_name
            )
        ) FILTER (WHERE t.id_tag IS NOT NULL),
        '[]'
    ) AS tags
FROM items AS i
LEFT JOIN item_tags AS it ON i.id_item = it.id_item
LEFT JOIN tags AS t ON it.id_tag = t.id_tag
GROUP BY i.id_item;
```

> **Note pédagogique :** `JSON_AGG` transforme plusieurs lignes de tags en un seul tableau `["Tag1", "Tag2"]`. Le `COALESCE` avec le `FILTER` évite de recevoir `[null]` si une pépite n'a pas de tag, en renvoyant un tableau vide `[]` à la place.

---

#### 📄 Fichier : `02_orphan_items_view.sql`

_L'enjeu : Nettoyer la base de données en trouvant ce qui n'est pas rangé._

```sql
CREATE OR REPLACE VIEW v_orphan_items AS
SELECT
    i.title,
    u.pseudo AS owner_pseudo
FROM items AS i
JOIN users AS u ON i.user_id = u.id_user
LEFT JOIN item_tags AS it ON i.id_item = it.id_item
WHERE it.id_item IS NULL;
```

> **Note pédagogique :** On utilise le `LEFT JOIN` sur la table pivot. Si la partie droite (`it.id_item`) est vide (`IS NULL`), cela signifie mathématiquement que la pépite n'est liée à aucun tag.

---

#### 📄 Fichier : `03_shared_items_view.sql`

_L'enjeu : Gérer la visibilité et la sécurité des partages._

```sql
CREATE OR REPLACE VIEW v_shared_access AS
SELECT
    i.title AS item_title,
    u.email AS owner_email,
    s.recipient_email
FROM items AS i
JOIN users AS u ON i.user_id = u.id_user
JOIN shares AS s ON i.id_item = s.item_id;

```

> **Note pédagogique :** Cette vue est un pont entre trois tables. Elle sera très utile pour ton service de notifications : "Sophie a partagé une pépite avec vous".

---

#### 📄 Fichier : `04_user_activity_summary_view.sql`

_L'enjeu : Faire des statistiques croisées sans doublons._

```sql
CREATE OR REPLACE VIEW v_user_activity_metrics AS
SELECT
    u.pseudo,
    COUNT(DISTINCT i.id_item) AS total_items,
    COUNT(DISTINCT t.id_tag) AS total_tags_created
FROM users AS u
LEFT JOIN items AS i ON u.id_user = i.user_id
LEFT JOIN tags AS t ON u.id_user = t.user_id
GROUP BY u.id_user, u.pseudo;
```

> **Note pédagogique :** Sans le mot-clé `DISTINCT`, le nombre de pépites serait multiplié par le nombre de tags (effet produit cartésien). `DISTINCT` force SQL à ne compter qu'une seule fois chaque identifiant unique.

---

### 🧠 Bilan de la Phase SQL

Félicitations ! Tu as maintenant une base de données **intelligente** :

1. Elle est **robuste** (Contraintes, Types, UUID).
2. Elle est **relationnelle** (Jointures).
3. Elle est **performante** (Vues et agrégats JSON).

Ta base de données est prête. Elle n'attend plus que son "cerveau" pour la piloter.

**Es-tu prêt a commencer le Backend avec Node.js ?**
