# Utilisateurs (Commun)

OpenAPI description des endpoints liés aux utilisateurs sous `/users`.

---

```yaml
paths:
  /users/upload-profile-picture:
    post:
      summary: Uploader une photo de profil
      description: Upload d'une image pour servir de photo de profil. L'image est stockée et un nom de fichier unique est renvoyé. Cette route nécessite une authentification valide.
      operationId: UploadProfilePicture
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                picture:
                  type: string
                  format: binary
                  description: Fichier image (jpeg, png, etc.) limité à 5 Mo.
      responses:
        '200':
          description: Fichier uploadé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  filename:
                    type: string
                    description: Le nom du fichier généré (ex. profile_picture_uuid.png)
              example:
                filename: "profile_picture_123e4567-e89b-12d3-a456-426614174000.png"
        '400':
          description: Erreur lors de l'upload (ex. fichier manquant ou format invalide).
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Aucun fichier image fourni"
        '401':
          description: Utilisateur non authentifié.
        '500':
          description: Erreur serveur interne.

  /users/connection-duration:
    patch:
      summary: Mettre à jour la durée de connexion
      description: Incrémente la durée totale de connexion de l'utilisateur authentifié avec la valeur fournie.
      operationId: UpdateConnectionDuration
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - duration
              properties:
                duration:
                  type: integer
                  description: "La durée en secondes à ajouter à la durée totale de connexion."
      responses:
        '200':
          description: Durée de connexion mise à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  totalConnectionDuration:
                    type: integer
                    description: "La nouvelle durée totale de connexion en secondes."
        '400':
          description: Données invalides (durée manquante ou invalide).
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                  details:
                    type: object
        '401':
          description: Utilisateur non authentifié.
        '404':
          description: Utilisateur introuvable.
        '500':
          description: Erreur serveur interne.

