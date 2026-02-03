--database/migrations/table/07_add_user_sessions_table.sql

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = "public" AND ="user_sessions") THEN
        CREATE TABLE user_session (
            sid VARCHAR PRIMARY KEY,
            sess JSON NOT NULL,
            expire TIMESTAMP(6) NOT NULL
        );
        CREATE INDEX "idx_user_sessions_expire" ON user_sesisons(expire);
        RAISE NOTICE 'Table "user_sessions" créée.';
        END IF