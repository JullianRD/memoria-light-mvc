CREATE OR REPLACE VIEW v_shared_access AS
SELECT i.title AS item_title, u.email AS owner_email, s.recipient_email
FROM
    items AS i
    JOIN users AS u ON i.user_id = u.id_user
    JOIN shares AS s ON i.id_item = s.item_id;
