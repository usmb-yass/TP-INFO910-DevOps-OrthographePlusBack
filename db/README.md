# Base de données

Cette base est gérée avec MongoDB dans Docker et les migrations sont pilotées par `migrate-mongo`.

- La base de données utilise Docker.
- Le conteneur Mongo est défini dans [compose.yml](compose.yml)
- La configuration des migrations est dans [migrate-mongo-config.js](migrate-mongo-config.js)
- Les migrations sont dans [db/migrations/](db/migrations)

## Fichiers de migration

La migration initiale est [db/migrations/0001_initial_schema.js](../db/migrations/0001_initial_schema.js).

Les fichiers de migration vivent dans `db/migrations/` et exportent deux fonctions:

- `up(db)` pour appliquer la migration
- `down(db)` pour l'annuler

## Démarrer MongoDB

```bash
npm run docker:start
```

## Voir l'état des migrations / Vérifier que tout est en place

```bash
npm run db:status
```

## Appliquer les migrations / Appliquer le schéma initial / Mettre à jour le schéma existant
```bash
npm run db:migrate
```

## Annuler la dernière migration

```bash
npm run db:rollback
```

## Créer une nouvelle migration

```bash
npm run db:create -- nom_de_la_migration
```
