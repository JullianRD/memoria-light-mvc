-- migration/config/02_add_permissions_role_app.sql
-- À exécuter APRES la création de toutes les tables

-- On donne l'accès au schéma
GRANT USAGE ON SCHEMA public TO app_memoria;

-- On donne les droits sur les tables existantes (Lecture / Écriture)
GRANT
SELECT, INSERT,
UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_memoria;

-- On donne les droits sur les séquences (indispensable pour les IDs auto-incrémentés ou UUIDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_memoria;

-- Sécurité pour les tables créées dans le futur
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT
SELECT, INSERT,
UPDATE, DELETE ON TABLES TO app_memoria;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE,
SELECT ON SEQUENCES TO app_memoria;
