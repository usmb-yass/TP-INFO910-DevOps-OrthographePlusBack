# Procédure de migration de la base de données sur le VPS (Staging & Prod)

Cette documentation explique comment lancer les scripts de migration locaux directement sur une des bases de données MongoDB du VPS.

## 1. Informations de connexion
La base de données MongoDB sur le VPS de l'environnement Staging écoute sur le port **27018**.

La base de données MongoDB sur le VPS de l'environnement Prod écoute sur le port **27017**.

## 2. Création du tunnel SSH
Pour interagir avec la base du VPS depuis votre machine locale, vous devez créer un tunnel SSH en mappant le port distant vers un port local. Ouvrez un terminal et exécutez la commande suivante :

```bash
ssh -N -L <PORT_LOCAL>:localhost:<27018|27017> <USER>@<VPS_IP>
```
*(Gardez ce terminal ouvert en arrière-plan pendant toute la durée des opérations)*

## 3. Vérification de la base de données
Ouvrez un outil de gestion MongoDB (comme MongoDB Compass) et connectez-vous pour vérifier que la connexion au tunnel fonctionne.

## 4. Configuration de l'environnement local
Ouvrez votre fichier `.env` local (celui situé à la racine du backend) et modifiez temporairement la variable `MONGODB_URI` pour qu'elle cible la base de données du VPS :

```env
MONGODB_URI="mongodb://127.0.0.1:<PORT_LOCAL>/orthographe_plus_junior"
```

## 5. Vérification du statut des migrations
Lancez la commande suivante pour tester la connexion via le tunnel et lister les migrations en attente :

```bash
npm run db:status
```
*Si aucune erreur n'apparaît, c'est que votre backend local est bien connecté à la base du VPS.*

### ⚠️ Gestion des collections préexistantes (Staging UNIQUEMENT)

> [!WARNING]
> Les informations qui suivent ne concernent que l'environnement de Staging. Les données en Production ne doivent pas être touchées ou modifiées.

Si vous constatez via Compass que la base du VPS contient déjà des collections (et des index) alors que vous n'avez jamais lancé de migration, c'est normal. Lorsque l'API s'est lancée sur le VPS, Mongoose a automatiquement créé ces structures.

- **Action requise :** Si la base de données ne contient aucune donnée utile (base vierge de test), vous devez supprimer entièrement la base de données (Drop Database) depuis MongoDB Compass. Cela évitera les conflits de nommage d'index lors du passage des scripts de migration.

## 6. Exécution des migrations
Une fois la base de données nettoyée (si nécessaire), vous pouvez lancer les migrations en toute sécurité :

```bash
npm run db:migrate
```

## 7. Vérifications finales
1. Vérifiez que toutes les migrations sont passées avec succès en relançant :
   ```bash
   npm run db:status
   ```
2. Retournez sur MongoDB Compass, rafraîchissez l'affichage et vérifiez que vos collections, index et éventuelles données initiales sont bien présents dans la base.
