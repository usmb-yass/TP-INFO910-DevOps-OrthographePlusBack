# Organisation du projet Orthographe Plus Junior

Ce document décrit l'architecture globale, l'organisation des dépôts, le fonctionnement des environnements (Staging / Production) et les CI/CD.



## 1. Les dépôts et leur utilité

Le projet est découpé en plusieurs dépôts distincts, suivant une architecture distribuée séparant clairement les responsabilités et les technologies.

1. **OrthographePlusBack** : Le cœur du système. C'est le serveur Backend (Node.js / Express) qui gère la logique métier, la sécurité, l'accès à la base de données (MongoDB) et expose les routes API (pour l'administration (admins de l'app et admins d'école), l'application mobile, et les accès publics).
2. **OrthographePlusApp** : L'application mobile destinée aux utilisateurs finaux (enfants/élèves). Développée en React Native (avec Expo), elle consomme l'API Backend pour récupérer les leçons, les QCM, et enregistrer la progression des utilisateurs.
3. **OrthographePlusAdmin** : Le tableau de bord d'administration web (React / Vite). Réservé aux administrateurs de l'application, il permet de gérer l'intégralité du contenu (leçons, questions, utilisateurs, écoles, etc.) via l'API. Il contient également une partie pour les administrateurs d'école.
4. **OrthographePlusShared** : Dépôt central contenant les ressources partagées entre le backend et les frontends (types Typescript, schemas Zod, Enums, DTOs). Il garantit une source de vérité unique. Cela évite la redondance et prévient les erreurs de typage lors des échanges de données.
5. **OrthographePlusAppLanding** : Le site vitrine / landing page (Astro). Son but principal est le marketing : présenter l'application, ses fonctionnalités, et rediriger les utilisateurs vers les stores de téléchargement.
6. **OrthographePlusInfra** : Contient toute la configuration d'infrastructure (fichiers Docker, docker-compose, scripts de déploiement, reverse proxy, etc.). C'est la recette qui définit comment le projet tourne sur les serveurs réels de manière orchestrée.
7. **OrthographePlusBack-test** : Dépôt dédié aux tests de l'API. Il contient toutes les routes de l'API afin d'être toujours synchronisé entre développeurs. Il utilise un versionnement avec Git pour le partage. Il faut utiliser [Bruno](https://usebruno.com) pour l'utiliser. Il permet de valider le comportement du backend de manière isolée. Il peut se connecter à 2 environnements : en local (donc le backend tourne en local sur l'ordinateur) et staging (donc le backend tourne sur le VPS) (l'environnement de staging est expliqué plus bas).



## 2. Comment tout se connecte

1. **La Base de données (MongoDB)** : Stocke toutes les données persistantes (Utilisateurs, Leçons, Questions, Historique). Seul le Backend y a un accès direct et sécurisé.
2. **Le Backend (`OrthographePlusBack`)** : Il reçoit des requêtes HTTP des applications (Admin ou App), valide ces requêtes (en utilisant les schémas Zod de `Shared`), interagit avec la base de données via Mongoose, et retourne des réponses formatées (les DTOs de `Shared`).
3. **Les Frontends (`OrthographePlusApp` et `OrthographePlusAdmin`)** : Ces applications ne communiquent jamais directement avec la base de données. Elles effectuent des appels réseau vers les endpoints du Backend. Elles importent le dépôt `OrthographePlusShared` pour s'assurer qu'elles envoient les données au bon format et qu'elles traitent correctement les réponses reçues.
4. **L'Infrastructure (`OrthographePlusInfra`)** : Configure le déploiement en staging et production sur le VPS. Le dépôt configure Nginx, Certbot, le nom de domaine, le certificat TLS/SSL pour être en HTTPS et les reverse proxy.



## 3. Les Environnements : Staging et Production

Afin de garantir la stabilité, la qualité et la sécurité du produit final, le cycle de développement s'appuie sur deux environnements distincts.

### L'environnement de Staging (Pré-production)
- **Qu'est-ce que c'est ?** C'est une réplique quasi-identique de l'environnement de production. Il tourne sur un environnement distinct avec sa propre base de données isolée.
- **Utilité / Pourquoi ?** C'est un environnement de validation et de test grandeur nature. Avant qu'une nouvelle fonctionnalité ne soit rendue publique, elle est déployée en Staging.
- **Fonctionnement :** L'équipe de développement et les testeurs utilisent le Staging pour tester l'application. Si un bug critique survient ici, il n'impacte aucun vrai utilisateur. C'est l'étape de validation finale.

### L'environnement de Production (Prod)
- **Qu'est-ce que c'est ?** C'est l'environnement réel, utilisé par les vrais utilisateurs.
- **Utilité / Pourquoi ?** Fournir le service final, stable et performant aux vrais utilisateurs (les utilisateurs, les écoles).
- **Fonctionnement :** Le code n'arrive en Production que s'il a été approuvé et testé (d'abord en Staging). Les données y sont de vraies données (sensibles), et l'accès aux serveurs de production est très protégé. Il ne faut pas toucher ou modifier manuellement la base de données.



## 4. CI/CD (GitHub Actions)

Pour automatiser les tests et les déploiements sur le VPS, le projet s'appuie sur des workflows GitHub Actions. Le flux de déploiement est piloté directement par les branches Git :
- La branche `dev` correspond à l'environnement de **Staging**.
- La branche `main` correspond à l'environnement de **Production**.

### Fonctionnement
À chaque fois que du code est validé et fusionné sur la branche `dev` ou `main`, le processus suivant se déclenche automatiquement :

1. **Exécution des tests** : Le workflow commence par analyser le code et lance les suites de tests automatisés pour s'assurer que la nouvelle version est stable et ne casse rien.
2. **Création des images Docker** : Si les tests passent avec succès, il va ensuite build l'application et générer les nouvelles images Docker.
3. **Déploiement sur le VPS** : Une fois les images créées, il se connecte de manière sécurisée au VPS, y copie les nouvelles images Docker, et relance automatiquement les conteneurs avec la nouvelle version.

### Avantages
- **Qualité garantie** : Un code qui échoue aux tests est bloqué, empêchant tout déploiement défectueux sur le VPS.
- **Rapidité** : L'ensemble du processus (tests, build, mise en ligne des conteneurs) se fait de manière 100% autonome en quelques minutes.
