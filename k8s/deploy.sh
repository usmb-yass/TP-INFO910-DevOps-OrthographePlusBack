#!/usr/bin/env bash
#
# Déploie l'application OrthographePlus dans Kubernetes avec minikube
#
# Les Secrets sont générés à partir du fichier .env à la racine du projet
#
# Usage :
#   ./k8s/deploy.sh            # déploie (ou met à jour) tout
#   ./k8s/deploy.sh --build    # reconstruit aussi les images dans Minikube avant
#
set -euo pipefail

NAMESPACE="orthographe-plus"
DB_NAME="orthographe_plus_junior"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
BUILD=false

for arg in "$@"; do
  case "$arg" in
    --build) BUILD=true ;;
    -h|--help)
      sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Option inconnue : $arg" >&2
      exit 1
      ;;
  esac
done

info() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m/!\\\033[0m %s\n' "$*"; }
error() { printf '\033[1;31mErreur :\033[0m %s\n' "$*" >&2; exit 1; }

# --- Vérifications préalables -------------------------------------------------

command -v kubectl >/dev/null 2>&1 || error "kubectl est introuvable dans le PATH."
[ -f "$ENV_FILE" ] || error "Fichier .env introuvable : $ENV_FILE (copiez .env.example puis renseignez-le)."

info "Chargement de $ENV_FILE"
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

for var in MONGO_USER MONGO_PASSWORD JWT_SECRET; do
  [ -n "${!var:-}" ] || error "La variable $var est vide ou absente dans $ENV_FILE."
done

# --- Reconstruction des images (optionnel) ----------------------------------

if [ "$BUILD" = true ]; then
  command -v minikube >/dev/null 2>&1 || error "minikube est introuvable dans le PATH."
  info "Construction de l'image MongoDB avec le dump de la base de données"
  minikube image build -f "$ROOT_DIR/Dockerfile.mongodb" -t orthographe-plus-mongodb:latest "$ROOT_DIR"
  info "Construction de l'image API"
  minikube image build -t orthographe-plus-api:latest "$ROOT_DIR"
fi

# --- Namespace ----------------------------------------------------------------

info "Application du namespace '$NAMESPACE'"
kubectl apply -f "$SCRIPT_DIR/namespace.yaml"

# --- Secrets générés depuis .env ---------------------------------------------

info "Création du Secret 'mongodb-secret'"
kubectl create secret generic mongodb-secret \
  --namespace "$NAMESPACE" \
  --from-literal=root-username="$MONGO_USER" \
  --from-literal=root-password="$MONGO_PASSWORD" \
  --from-literal=database="$DB_NAME" \
  --dry-run=client -o yaml | kubectl apply -f -

info "Création du Secret 'api-secret'"
kubectl create secret generic api-secret \
  --namespace "$NAMESPACE" \
  --from-literal=jwt-secret="$JWT_SECRET" \
  --dry-run=client -o yaml | kubectl apply -f -

# --- le dump n'est importé que sur un volume vide -------------------
# vérifié AVANT l'application des manifests, sinon le PVC vient d'être créé

if kubectl get pvc mongodb-data -n "$NAMESPACE" >/dev/null 2>&1; then
  warn "Le PVC 'mongodb-data' existe déjà : le dump ne sera PAS réimporté."
  warn "Pour repartir d'une base fraîche :"
  warn "  kubectl scale deployment/mongodb -n $NAMESPACE --replicas=0"
  warn "  kubectl delete pvc mongodb-data -n $NAMESPACE"
  warn "  kubectl scale deployment/mongodb -n $NAMESPACE --replicas=1"
fi

# --- Manifests -----------------------------------------------------------------

info "Application des manifests dans le namespace '$NAMESPACE'"
shopt -s nullglob
for manifest in "$SCRIPT_DIR"/*.yaml; do
  echo "    - $(basename "$manifest")"
  kubectl apply -n "$NAMESPACE" -f "$manifest"
done

# --- Redémarrage si les images viennent d'être reconstruites -----------------
# garder le même tag 'latest' ne modifie pas le spec du pod
# sans restart, l'ancien conteneur continue de tourner avec l'ancienne image

if [ "$BUILD" = true ]; then
  info "Redémarrage des déploiements pour utiliser les nouvelles images"
  kubectl rollout restart deployment/mongodb -n "$NAMESPACE"
  kubectl rollout restart deployment/api -n "$NAMESPACE"
fi

# --- Attente du déploiement ---------------------------------------------------

info "Attente de MongoDB..."
kubectl rollout status deployment/mongodb -n "$NAMESPACE" --timeout=180s || \
  warn "MongoDB n'est pas prêt (vérifiez 'kubectl get pods -n $NAMESPACE')."

info "Attente de l'API..."
kubectl rollout status deployment/api -n "$NAMESPACE" --timeout=180s || \
  warn "L'API n'est pas prête (image construite ? voir './k8s/deploy.sh --build')."

# --- Résumé -------------------------------------------------------------------

echo
info "État des ressources :"
kubectl get pods,svc,pvc -n "$NAMESPACE"

echo
info "Accès à l'API :"
echo "    minikube service api -n $NAMESPACE --url"
echo "    curl \$(minikube service api -n $NAMESPACE --url)/health-check"
