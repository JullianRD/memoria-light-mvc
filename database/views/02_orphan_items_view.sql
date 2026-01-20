CREATE OR REPLACE VIEW v_orphan_items AS
SELECT i.title, u.pseudo AS owner_pseudo
FROM
    items AS i
    JOIN users AS u ON i.user_id = u.id_user
    LEFT JOIN item_tags AS it ON i.id_item = it.id_item
WHERE
    it.id_item IS NULL;
