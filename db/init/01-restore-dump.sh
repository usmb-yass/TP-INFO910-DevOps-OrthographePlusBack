#!/bin/bash
set -euo pipefail

DUMP_DIR="/docker-entrypoint-initdb.d/dump"
DB_NAME="${MONGO_INITDB_DATABASE:-orthographe_plus_junior}"

if [ ! -d "$DUMP_DIR" ]; then
  echo "Erreur : dossier de dump introuvable : $DUMP_DIR" >&2
  exit 1
fi

echo "Import de la base '${DB_NAME}' depuis ${DUMP_DIR}..."

mongorestore \
  --host 127.0.0.1 \
  --port 27017 \
  --db "${DB_NAME}" \
  "${DUMP_DIR}"

echo "Import de la base '${DB_NAME}' terminé."
