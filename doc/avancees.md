# Fonctionnalités non implémentées à 100%

Ce document liste l'état d'avancement de plusieurs fonctionnalités qui ne sont pas encore totalement achevées, avec des explications sur ce qui a été fait et ce qu'il reste à faire.

## 1. Désactivation des questions

- **Niveau d'avancement :** Avancé (Logique interne en place).
- **État actuel :** La propriété `isDisabled` est prise en compte dans le backend. Par exemple, le service `questions.service.ts` filtre correctement les questions désactivées lors de la récupération (avec la condition `isDisabled: { $ne: true }`).
- **Ce qu'il manque :** Il manque l'intégration complète dans le back-office pour permettre aux administrateurs de facilement basculer le statut d'une question (l'activer / la désactiver). Des routes spécifiques ou une intégration dans le flux de mise à jour des questions depuis le front-end admin n'ont pas été fait.

## 2. Abonnements

- **Niveau d'avancement :** Initial (Structure de données uniquement).
- **État actuel :** Le modèle de base de données Mongoose (`Subscriptions.ts`) et l'interface TypeScript associée sont créés. La structure des données (plan, status, dates de début et de fin) est définie mais pas complète.
- **Pourquoi ce n'est pas fini :** Les comptes Google et Apple n'ont pas été fournis pour permettre l'implémentation.

## 3. Activity Logs (Journaux d'activité)

- **Niveau d'avancement :** Initial (Structure de données uniquement).
- **État actuel :** Le modèle Mongoose (`ActivityLogs.ts`) définissant le schéma d'un journal (utilisateur, type d'action, horodatage, détails) est présent.
- **Ce qu'il manque :** Le système de traçabilité n'est pas branché au reste de l'application. Aucun middleware ni intercepteur n'a été implémenté pour enregistrer automatiquement ces journaux lors des actions des utilisateurs.

## 4. Écoles, Invitations

- **Niveau d'avancement :** Avancé (Logique interne en place).
- **État actuel :** Toute l'architecture de base est prête. Les modèles (`Schools`, `SchoolInvitations`, `StudentInvitations`), les services, les contrôleurs et les routes fonctionnent. La logique de création d'écoles, de gestion des licences, de création de tokens d'invitation et de génération de liens d'inscription est présente.
- **Pourquoi ce n'est pas fini :** Aucun compte mail n'a été fourni pour permettre l'implémentation. L'envoi réel des emails n'est pas implémenté. Actuellement, le système se contente d'afficher les tokens d'invitation dans la console du serveur (`console.log("[SIMULATION EMAIL]")`). Pour finaliser cette fonctionnalité, il faut intégrer un véritable fournisseur de messagerie pour envoyer les emails d'invitation. De plus, il faudra s'assurer que le parcours utilisateur côté frontend (utilisation du token pour créer un compte ou rejoindre l'école) est synchronisé avec l'API.
