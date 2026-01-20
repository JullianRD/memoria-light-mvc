CREATE OR REPLACE VIEW v_items_with_tags AS
SELECT i.id_item, i.user_id, i.title, i.content_type, i.thumbnail_url, COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', t.id_tag, 'name', t.tag_name
            )
        ) FILTER (
            WHERE
                t.id_tag IS NOT NULL
        ), '[]'
    ) AS tags
FROM
    items AS i
    LEFT JOIN item_tags AS it ON i.id_item = it.id_item
    LEFT JOIN tags AS t ON it.id_tag = t.id_tag
GROUP BY
    i.id_item;
