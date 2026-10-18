# Orthographe Plus Back

Backend du projet Orthographe Plus Junior.

Ce repo contient un serveur en Node.js/Express à la racine, avec une base MongoDB gérée via Docker et des migrations versionnées avec `migrate-mongo`.

## Installation

### 1. Cloner le dépôt

```bash
git clone --recursive https://github.com/OrthographePlusEnfant/OrthographePlusBack.git 
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copiez le fichier `.env.example` pour créer votre propre fichier `.env`





## Démarrage

### 1. Démarrer la base de données et le backend (api) avec Docker

```bash
npm run docker:start
```

### 2.a. Lancer le backend (api) en mode développement avec refresh automatique sans Docker

```bash
npm run dev
```

### 2.b. Lancer le backend (api) en production sans Docker

Le serveur a comme point d'entrée Express `src/serveur.ts`.

```bash
npm start
```





## Documentation

La documentation du projet se trouve [ici](doc/README.md)
