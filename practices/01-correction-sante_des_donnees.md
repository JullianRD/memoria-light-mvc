### 🟢 Correction : Phase 1 - Inspection de Santé

#### 📄 Fichier : `01_get_recent_users.sql`
*L'enjeu : Trier par date pour voir l'activité récente.*

```sql
SELECT
    pseudo,
    email,
    role_name
FROM users
ORDER BY created_at DESC;
```
> **Note pédagogique :** On utilise `DESC` (Descending) pour mettre les plus grands chiffres (les dates les plus récentes) en premier.

---

#### 📄 Fichier : `02_find_short_items.sql`
*L'enjeu : Filtrer sur la longueur d'un texte `TEXT` ou `VARCHAR`.*

```sql
SELECT
    title,
        content_type
        FROM items
        WHERE LENGTH(content) > 20;
```
> **Note pédagogique :** La fonction `LENGTH()` ignore si c'est un titre ou un paragraphe, elle compte chaque caractère (espaces inclus).

---

#### 📄 Fichier : `03_check_video_sources.sql`
*L'enjeu : Extraire une donnée texte d'un objet JSONB.*

```sql
SELECT
    title,
    metadata->>'source_url' AS url
FROM items
WHERE content_type = 'video'
  AND metadata->>'source_url' NOT LIKE '%youtube%';
```
> **Note pédagogique :**
> 1. L'opérateur `->>` (double flèche) est crucial : il transforme la valeur JSON en texte pur.
> 2. Sans ce texte pur, l'opérateur `LIKE` ne fonctionnerait pas.
> 3. `AS source_url` permet de donner un nom propre à la colonne dans les résultats.

---

#### 📄 Fichier : `04_get_critical_logs.sql`
*L'enjeu : Debugger via les logs système.*

```sql
SELECT
    message,
    metadata->>'duration_ms' AS duree,
    metadata->>'query' AS requete_en_cause
FROM app_events
WHERE severity = 'warning';
```
> **Note pédagogique :** Dans une vraie application, c'est ta requête de secours. Elle te permet de voir immédiatement le message d'erreur SQL ou système qui a été capturé dans query.

---

### 🧠 Ce qu'il faut retenir avant de passer aux jointures :

1.  **Le JSONB n'est pas une "boite noire" :** Tu peux interroger ce qu'il y a dedans aussi facilement qu'une colonne normale grâce à `->>`.
2.  **L'importance du type :** Dans l'exercice 1.3, on a filtré sur `content_type`. C'est une énumération (`ENUM`). SQL est très strict : si tu écris `Vidéo` avec un accent dans ta table, tu dois mettre l'accent dans ta requête.
3.  **Alias (`AS`) :** C'est très pratique pour rendre les résultats lisibles pour le frontend plus tard.

---

### 🚀 Prochaine étape : Les Jointures (Phase 2)

Maintenant que l'on sait vérifier la santé d'une table seule, on va apprendre à **relier les points**.
*   *Comment savoir quel utilisateur possède quel tag ?*
*   *Comment afficher le pseudo de l'auteur à côté du titre de la pépite ?*

**Es-tu prêt à attaquer les jointures (INNER JOIN / LEFT JOIN) ?** C'est là que la puissance de SQL s'exprime vraiment pour notre application Memoria.
