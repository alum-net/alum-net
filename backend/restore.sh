#!/bin/bash
set -e

# Esperar a que PostgreSQL esté listo
until pg_isready -U $POSTGRES_USER -d $POSTGRES_DB; do
  echo "Esperando a que PostgreSQL esté listo..."
  sleep 2
done

# Verificar si la base de datos ya tiene datos
TABLE_COUNT=$(psql -U $POSTGRES_USER -d $POSTGRES_DB -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")

if [ "$TABLE_COUNT" -eq 0 ]; then
  echo "Base de datos vacía. Restaurando backup..."
  psql -U $POSTGRES_USER -d $POSTGRES_DB < /backup/keycloak_db_backup.sql
  echo "Backup restaurado exitosamente."
else
  echo "La base de datos ya contiene datos. Saltando restauración."
fi
