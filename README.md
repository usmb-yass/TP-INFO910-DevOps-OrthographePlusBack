# TP INFO910 DevOps - Orthographe Plus Back

## Auteur
- Benkirane Yassine

## Présentation de l'application et utilisation

Orthographe Plus Back est une API REST développée en Node.js (Express et TypeScript) connectée à une base de données MongoDB. Elle sert de backend pour une application éducative d'apprentissage et d'exercices d'orthographe (authentification, gestion de leçons, de questions et suivi de progression).

L'API expose des routes HTTP REST. Pour tester l'application, vous pouvez interroger les endpoints suivants (via une plateforme de test d'API (Postman, Bruno) ou via cURL) :

- `GET /health-check` : vérifie la disponibilité HTTP du serveur (retourne `OK`).
- `GET /healthz` : vérifie la disponibilité globale incluant la connexion active à MongoDB (utilisé par la *readiness probe* Kubernetes).
- `GET /v1/countries` : renvoie la liste publique des pays configurés.

Exemples d'appel via `curl` :

```bash
# Vérification de l'état de l'API
curl http://<ADRESSE_API>:<PORT>/health-check

# Tests de routes publiques
curl http://<ADRESSE_API>:<PORT>/v1/countries
curl http://<ADRESSE_API>:<PORT>/v1/grade-levels

# Se connecter au compte administrateur existant (le compte existe déjà)
curl -X POST "http://<ADRESSE_API>:<PORT>/v1/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@admin.com", "password": "^LUdjd&A98Zv!V8f$jEe*g!T2%"}'

# Sauvegarder le token pour l'utiliser
TOKEN=<LE_TOKEN_RENVOYE_PAR_/v1/auth/admin/login>

# Voir les catégories existantes
curl -H "Authorization: Bearer $TOKEN" "http://<ADRESSE_API>:<PORT>/v1/admin/categories"

# Créer une nouvelle catégorie
curl -X POST "http://<ADRESSE_API>:<PORT>/v1/admin/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Pronoms"}'

# Vérifier l'ajout de la nouvelle catégorie
curl -H "Authorization: Bearer $TOKEN" "http://<ADRESSE_API>:<PORT>/v1/admin/categories"
```

## Déploiement sur un cluster Kubernetes avec Minikube

### Architecture

Le déploiement est géré dans un namespace dédié `orthographe-plus` :
- Base de données MongoDB :
  - PersistentVolumeClaim de 2Go pour la persistance des données
  - Deployment avec l'image `orthographe-plus-mongodb:latest` qui initialise la base avec des données
  - Sondes de santé (startupProbe, livenessProbe, readinessProbe)
  - Service interne de type ClusterIP exposant le port `27017`
- Backend API :
  - Deployment pour le serveur Node.js
  - Sondes de santé (startupProbe, livenessProbe sur `/health-check`, readinessProbe sur `/healthz`)
  - Service de type NodePort exposant l'API sur le port `80`
- Configuration :
  - ConfigMap pour les variables non-sensibles
  - Les Secrets sont générés via kubectl à partir du fichier `.env` pour que les variables sensibles ne soient pas exposées

### Prérequis
- kubectl
- minikube démarré (`minikube start`)
- Créer le fichier `.env` à la racine pour les secrets en copiant `.env.example` et en remplissant les variables

### Méthode 1 : Déploiement via un script

Un script de déploiement [`k8s/deploy.sh`](k8s/deploy.sh) est fourni. Il construit les images Docker dans le cluster Minikube, génère les secrets depuis le fichier `.env`, applique les manifestes et attend que les services soient prêts.

```bash
# 1. Démarrer Minikube
minikube start
```

```bash
# 2. Déployer l'application (l'option --build construit les images dans le cluster)
./k8s/deploy.sh --build
```

```bash
# Obtenir l'URL de l'API
minikube service api -n orthographe-plus --url
```

### Méthode 2 : Déploiement manuel étape par étape

#### 1. Démarrer Minikube
```bash
minikube start
```

#### 2. Construire les images dans l'environnement Minikube
```bash
# Image MongoDB personnalisée avec le dump de données
minikube image build -f Dockerfile.mongodb -t orthographe-plus-mongodb:latest .

# Image Backend API
minikube image build -t orthographe-plus-api:latest .
```

#### 3. Créer le namespace
```bash
kubectl apply -f k8s/namespace.yaml
```

#### 4. Créer les Secrets à partir du fichier `.env`
```bash
source .env

kubectl create secret generic mongodb-secret \
  --namespace orthographe-plus \
  --from-literal=root-username="$MONGO_USER" \
  --from-literal=root-password="$MONGO_PASSWORD" \
  --from-literal=database="orthographe_plus_junior" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic api-secret \
  --namespace orthographe-plus \
  --from-literal=jwt-secret="$JWT_SECRET" \
  --dry-run=client -o yaml | kubectl apply -f -
```

#### 5. Appliquer les manifestes Kubernetes
```bash
kubectl apply -n orthographe-plus -f k8s/
```

#### 6. Vérifier le lancement
```bash
kubectl get pods,svc,pvc -n orthographe-plus

# alternative pour avoir le suivi en temps réel
kubectl get pods -n orthographe-plus -w
```

#### 7. Accéder à l'API
```bash
minikube service api -n orthographe-plus --url
```

## Autres commandes

- Afficher les logs de l'API :
  ```bash
  kubectl logs -n orthographe-plus -l tiers=backend -f
  ```

- Afficher les logs de MongoDB :
  ```bash
  kubectl logs -n orthographe-plus -l tiers=database -f
  ```

- Supprimer l'ensemble du déploiement :
  ```bash
  kubectl delete namespace orthographe-plus
  ```
