-- ============================================================================
-- TODO ÉTAPE 2 (DCL) : SÉCURISATION ET RÔLES (à exécuter avec le rôle postgres)
-- ============================================================================

-- Création du rôle applicatif avec droits restreints (jamais se connecter avec postgres !)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_memoria') THEN
        CREATE ROLE app_memoria WITH LOGIN PASSWORD 'unpandarouxquidort';
    END IF;
END
$$;

-- On donne les accès à ce rôle sur la base de données
GRANT CONNECT ON DATABASE memoria_db_dev TO app_memoria;

-- On se connecter à la base de données memoria_db_dev
