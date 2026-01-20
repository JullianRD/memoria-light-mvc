#!/usr/bin/env sh

# ============================================
# 🐼 MEMORIA - DB Initialization Script
# ============================================

set -e

# Message colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🐼 Memoria - Database Initialization${NC}\n"

# 1. Chargement des variables (Check .env)
# ----------------------------------------
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    DB_USER=${DB_USER:-postgres}
    DB_NAME=${DB_NAME:-memoria_db_dev}
else
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    exit 1
fi

# 2. Fonctions utilitaires
# ----------------------------------------

# Exécute un fichier SQL unique
# Execute a SQL file with credentials passed via .env or flags
# Example: execute_sql "database/migrations/01_add_security_role.sql" "Creating security roles"
# Will print "➜ Creating security roles" and execute the SQL file if it exists
# If the file does not exist, will print "❌ File not found: <file name> (Skipping)"
# If the file exists but tables do not exist, will print "⚠️  Step notice: Resource might already exist. Continuing..."
execute_sql() {
    local file=$1
    local description=$2
    local db_to_use=${3:-$DB_NAME}

    if [ -f "$file" ]; then
        echo -e "${YELLOW}➜${NC} $description"
        # ON_ERROR_STOP=1 permet de s'arrêter si le SQL est faux
        psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$db_to_use" -f "$file" -q || \
        echo -e "${BLUE}⚠️  Step notice: Resource might already exist. Continuing...${NC}"
    else
        echo -e "${RED}❌ File not found: $file${NC}"
        exit 1
    fi
}

# Exécute tous les fichiers SQL d'un dossier (alphabétiquement)
# Execute all SQL files in a directory and its subdirectories
# This function will execute all SQL files in alphabetical order
# and will skip the directory if it does not exist
# Parameters:
#   dir: The directory to process
#   db_name: The database name to use for the execution
# Example: execute_directory "database/migrations" "memoria_db_dev"
execute_directory() {
    local dir=$1
    local db_name=$2

    if [ -d "$dir" ]; then
        echo -e "${GREEN}📂 Folder: $dir${NC}"
        # Utilisation de find pour trier proprement les fichiers .sql
        for file in $(find "$dir" -maxdepth 1 -name "*.sql" | sort); do
            execute_sql "$file" "Executing $(basename "$file")" "$db_name"
        done
    else
        echo -e "${YELLOW}⚠️  Directory $dir not found, skipping...${NC}"
    fi
}

# ============================================
# Execution Phases
# ============================================

# Phase 0 : Création de la DB si elle n'existe pas
# ----------------------------------------
echo -e "${GREEN}📦 Phase 0: Database Check${NC}"
DB_EXISTS=$(psql -lqt -U "$DB_USER" | cut -d \| -f 1 | grep -qw "$DB_NAME" && echo "yes" || echo "no")

if [ "$DB_EXISTS" = "no" ]; then
    echo -e "${YELLOW}➜ Creating database $DB_NAME...${NC}"
    # On utilise le fichier de config spécifique si tu en as un (00_add_database_config.sql)
    # Sinon on fait un createdb standard
    createdb -U "$DB_USER" "$DB_NAME" || echo "DB already exists"
else
    echo -e "➜ Database $DB_NAME already exists."
fi

# Phase 1 : Configuration (Roles, Extensions, Types)
# ----------------------------------------
echo -e "\n${GREEN}⚙️  Phase 1: Core Configuration${NC}"
# Note : Pour les rôles, on se connecte souvent à 'postgres' car la DB cible n'est pas encore prête
execute_sql "database/migrations/config/01_add_roles_app.sql" "Setting up roles app" "postgres"
execute_sql "database/migrations/config/03_add_extensions.sql" "Installing extensions" "$DB_NAME"
execute_sql "database/migrations/config/04_add_types.sql" "Creating custom types" "$DB_NAME"

# Phase 2 : Triggers
# ----------------------------------------
echo -e "\n${GREEN}🛠️  Phase 2: Triggers${NC}"
execute_directory "database/triggers" "$DB_NAME"

# Phase 3 : Tables (La structure métier)
# ----------------------------------------
echo -e "\n${GREEN}🗄️  Phase 3: Tables Creation${NC}"
execute_directory "database/migrations/tables" "$DB_NAME"

# Phase 4 : PERMISSIONS ROLES
# ----------------------------------------
echo -e "\n${GREEN}🗄️  Phase 4: GRANT PERMISSIONS ROLES${NC}"
execute_sql "database/migrations/config/02_add_permissions_roles_app.sql" "Setting up permissions" "$DB_NAME"



# Phase 5: Seed Data (Optionnel)
# ----------------------------------------
echo -e "\n${GREEN}🌱 Phase 5: Seed Data${NC}"
printf "Insert seed data? (y/N) : "
read -n 1 -r
echo
if [[ $REPLY =~ ^[YyOo]$ ]]; then
    execute_directory "database/seeders" "$DB_NAME"
else
    echo -e "${BLUE}➜ Skipping seeds.${NC}"
fi

# Phase 6 : Views
# ----------------------------------------
echo -e "\n${GREEN}🗄️  Phase 6: Views Creation${NC}"
execute_directory "database/views" "$DB_NAME"

echo -e "\n${GREEN}🐼 Memoria is ready to go!${NC}"
