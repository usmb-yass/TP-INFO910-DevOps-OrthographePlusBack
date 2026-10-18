# Migration des données (Adulte vers Junior)

Ce dossier contient les scripts nécessaires pour importer et migrer les données depuis l'ancienne base de données (version "Adulte") vers la nouvelle base de données (version "Junior").

Il vous sera nécessaire d'avoir une instance de la base de données adulte pour importer les données. Soit un accès, soit une copie locale.

## Configuration de l'accès à la nouvelle base

1. Assurez-vous d'avoir configuré l'accès à la nouvelle base de données. Le script utilise la variable `MONGODB_URI` définie dans le fichier `.env` situé à la racine du projet.

## Configuration de l'accès à l'ancienne base

1. Dans le dossier (`db/data-import`), copiez le fichier `.env.example` pour créer votre propre fichier `.env`
2. Complétez les informations de connexion à l'ancienne base de données dans le fichier `.env`

## Lancer les scripts de création et de migration

L'importation de toutes les données initiales et la migration de l'ancienne base doivent s'effectuer dans un ordre précis.

Placez-vous à la racine du projet et exécutez ces commandes les unes après les autres :

### 1. Créer les pays et les classes (niveaux scolaires)

```bash
npx tsx db/data-import/create_countries_and_grades.ts
```

### 2. Créer les catégories

```bash
npx tsx db/data-import/create_categories.ts
```

### 3. Migrer les règles et questions

Ce script dépend des catégories préalablement créées.

```bash
npx tsx db/data-import/migrate-from-old-database/migration_donnees_adulte_vers_junior.ts
```

## Migrer les données sur le VPS

### 1. Migrer les fichiers audio

Pour lancer cette commande, vous devrez avoir l'ensemble des fichiers audios des questions audio.

L'utilisateur sur le VPS doit avoir accès au dossier `/srv/orthographe-plus-junior/audio/prod/` et `/srv/orthographe-plus-junior/audio/staging/` pour que la copie réussisse.

```bash
# Pour le staging
rsync -avz </path/to/audio/> <USER>@<IP_VPS>:/srv/orthographe-plus-junior/audio/staging/

# Pour la production
rsync -avz </path/to/audio/> <USER>@<IP_VPS>:/srv/orthographe-plus-junior/audio/prod/
```

### 2. Migrer la photo de profil par défaut

> [!IMPORTANT]
> Le fichier doit absolument se nommer `default.png`

Pour lancer cette commande, vous devrez avoir une photo de profil à mettre par défaut.

L'utilisateur sur le VPS doit avoir accès au dossier `/srv/orthographe-plus-junior/profile-picture/prod/` et `/srv/orthographe-plus-junior/profile-picture/staging/` pour que la copie réussisse.

```bash
# Pour le staging
scp </path/to/file/>default.png <USER>@<IP_VPS>:/srv/orthographe-plus-junior/profile-picture/staging/

# Pour la production
scp </path/to/file/>default.png <USER>@<IP_VPS>:/srv/orthographe-plus-junior/profile-picture/prod/
```
