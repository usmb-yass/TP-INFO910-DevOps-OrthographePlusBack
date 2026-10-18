# User Progresses API

OpenAPI description des endpoints de gestion de la progression utilisateur sous `/user-progresses`.

---

```yaml
paths:
  /user-progresses/my-progress:
    get:
      summary: Obtenir ma progression
      description: Récupère la progression active de l'utilisateur authentifié. L'utilisateur est identifié via le token JWT, et sa progression est récupérée via la propriété `currentProgressId` de son profil. Si l'utilisateur n'a pas encore de progression, elle est initialisée avec la première leçon de son programme.
      operationId: GetMyProgress
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Progression récupérée (ou initialisée) avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/user_progress_item'
              example:
                _id: "64b9a5f2c7b1"
                userId: "64b9a5f2c7b0"
                programId: "64b9a5f2c7a5"
                currentLessonId: 
                  _id: "64b9a5f2c7a1"
                  name: "Leçon 1"
                  type: "NORMAL"
                  minScore: 70
                  rules:
                    - order: 1
                      ruleId:
                        _id: "64b9a5f2c7r1"
                        name: "Règle des pluriels"
                        categoryId:
                          _id: "64b9a5f2c7c1"
                          name: "Orthographe"
                startedAt: "2023-10-01T12:00:00.000Z"
                seenCategories: ["64b9a5f2c7c1"]
                seenRules: ["64b9a5f2c7r1"]
        '401':
          description: Non autorisé (token manquant ou invalide).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '404':
          description: Utilisateur introuvable ou aucun niveau (grade level) / programme n'est assigné pour initialiser la progression.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

  /user-progresses/my-categories:
    get:
      summary: Obtenir mes catégories
      description: Récupère la liste des catégories déjà vues par l'utilisateur, triées par ordre d'ajout (les plus anciennes d'abord).
      operationId: GetMyCategories
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des catégories vues.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  description: "Objet Category"
        '401':
          description: Non autorisé.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

  /user-progresses/my-rules:
    get:
      summary: Obtenir mes règles
      description: Récupère la liste des règles déjà vues par l'utilisateur, triées par ordre inverse d'ajout (les plus récentes d'abord).
      operationId: GetMyRules
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des règles vues avec leur catégorie populée.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  description: "Objet Rule populé"
        '401':
          description: Non autorisé.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

components:
  schemas:
    user_progress_item:
      type: object
      properties:
        _id:
          type: string
          description: "ID de la progression (ObjectId)"
        userId:
          type: string
          description: "ID de l'utilisateur (ObjectId)"
        programId:
          type: string
          description: "ID du programme (ObjectId)"
        currentLessonId:
          type: object
          description: "La leçon courante (peuplée avec ses règles et leurs catégories associées). Ce champ est absent (omitted) si l'utilisateur a déjà validé ses 2 leçons journalières (quota atteint)."
          properties:
            _id:
              type: string
            name:
              type: string
            type:
              type: string
            minScore:
              type: number
            rules:
              type: array
              items:
                type: object
                properties:
                  order:
                    type: number
                  ruleId:
                    type: object
                    properties:
                      _id:
                        type: string
                      name:
                        type: string
                      categoryId:
                        type: object
                        properties:
                          _id:
                            type: string
                          name:
                            type: string
        startedAt:
          type: string
          format: date-time
        completedAt:
          type: string
          format: date-time
        seenCategories:
          type: array
          items:
            type: string
          description: "Liste des IDs de catégories vues par l'utilisateur (ObjectId)"
        seenRules:
          type: array
          items:
            type: string
          description: "Liste des IDs de règles vues par l'utilisateur (ObjectId)"
    error_response:
      type: object
      properties:
        error:
          type: string
```
