# OrthographePlusShared

Types et documentation partagés.

## Scripts de publication (Release)

Des raccourcis sont disponibles dans le `package.json` pour gérer le versionnement (incrémentation de la version, création du commit, et publication avec les tags) :

- `npm run version:patch` : Incrémente la version patch (ex: `1.0.0` -> `1.0.1`), crée le commit, puis pousse le code et les tags vers le dépôt.
- `npm run version:minor` : Incrémente la version mineure (ex: `1.0.0` -> `1.1.0`), crée le commit, puis pousse le code et les tags vers le dépôt.
- `npm run version:major` : Incrémente la version majeure (ex: `1.0.0` -> `2.0.0`), crée le commit, puis pousse le code et les tags vers le dépôt.
