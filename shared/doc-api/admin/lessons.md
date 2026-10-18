# Lessons API (Admin)

OpenAPI description des endpoints d'administration des Leçons sous `/admin/lessons`.

---

```yaml
paths:


  /admin/lessons:
    get:
      summary: Liste des leçons
      description: Récupère la liste de toutes les leçons (accessible uniquement aux administrateurs).
      operationId: GetAllLessons
      security:
        - bearerAuth: []
      parameters:
        - name: limit
          in: query
          description: Limiter le nombre de résultats
          schema:
            type: integer
      responses:
        '200':
          description: Liste des leçons récupérée avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/lesson_item'
              example:
                - _id: "64b9a5f2c7a1"
                  name: "Leçon 1 - Les accords"
                  type: "NORMAL"
                  rules: 
                    - ruleId: "64b9a5f2c7a0"
                      order: 1
                    - ruleId: "64b9a5f2c7a2"
                      order: 2
                  minScore: 70
                  createdAt: "2023-10-01T12:00:00.000Z"
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

    post:
      summary: Créer une leçon
      description: Crée une nouvelle leçon (accessible uniquement aux administrateurs).
      operationId: CreateLesson
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_lesson_request'
      responses:
        '201':
          description: Leçon créée avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Leçon créée avec succès"
                  lesson:
                    $ref: '#/components/schemas/lesson_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '409':
          description: Conflit, une leçon avec ce nom existe déjà.
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

  /admin/lessons/{id}:
    get:
      summary: Obtenir une leçon par ID
      description: Récupère les détails d'une leçon spécifique (accessible uniquement aux administrateurs).
      operationId: GetLessonById
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Détails de la leçon récupérés avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/lesson_item'
              example:
                _id: "64b9a5f2c7a1"
                name: "Leçon 1 - Les accords"
                type: "NORMAL"
                rules: 
                  - ruleId: "64b9a5f2c7a0"
                    order: 1
                  - ruleId: "64b9a5f2c7a2"
                    order: 2
                minScore: 70
                createdAt: "2023-10-01T12:00:00.000Z"
        '404':
          description: Leçon non trouvée.
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

    put:
      summary: Mettre à jour une leçon
      description: Met à jour une leçon existante (accessible uniquement aux administrateurs).
      operationId: UpdateLesson
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/update_lesson_request'
      responses:
        '200':
          description: Leçon mise à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Leçon mise à jour avec succès"
                  lesson:
                    $ref: '#/components/schemas/lesson_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '404':
          description: Leçon non trouvée.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '409':
          description: Conflit, une leçon avec ce nom existe déjà.
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

    delete:
      summary: Supprimer une leçon
      description: Supprime une leçon existante (accessible uniquement aux administrateurs).
      operationId: DeleteLesson
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Leçon supprimée avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Leçon supprimée avec succès"
        '404':
          description: Leçon non trouvée.
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
    lesson_item:
      type: object
      properties:
        _id:
          type: string
          description: "ID de la leçon (ObjectId)"
        name:
          type: string
        type:
          type: string
          enum: ["NORMAL", "REVIEW"]
        rules:
          type: array
          items:
            type: object
            properties:
              ruleId:
                type: string
                description: "ID de la règle (ObjectId)"
              order:
                type: integer
                description: "L'ordre de la règle dans la leçon"
        minScore:
          type: integer
          default: 70
        createdAt:
          type: string
          format: date-time
    create_lesson_request:
      type: object
      required:
        - name
        - type
        - rules
      properties:
        name:
          type: string
          description: "Le nom de la leçon (minimum 1 caractère)"
        type:
          type: string
          enum: ["NORMAL", "REVIEW"]
        rules:
          type: array
          minItems: 1
          items:
            type: object
            required:
              - ruleId
              - order
            properties:
              ruleId:
                type: string
                pattern: "^[0-9a-fA-F]{24}$"
              order:
                type: integer
        minScore:
          type: integer
          minimum: 0
          maximum: 100
          description: "Score minimum attendu (Optionnel, 70 par défaut dans le modèle Mongoose)"
    update_lesson_request:
      type: object
      properties:
        name:
          type: string
        type:
          type: string
          enum: ["NORMAL", "REVIEW"]
        rules:
          type: array
          items:
            type: object
            properties:
              ruleId:
                type: string
                pattern: "^[0-9a-fA-F]{24}$"
              order:
                type: integer
        minScore:
          type: integer
          minimum: 0
          maximum: 100
    error_response:
      type: object
      properties:
        error:
          type: string
    validation_error_response:
      type: object
      properties:
        error:
          type: string
          example: "Données invalides"
        details:
          type: object
          description: "Format d'erreur de Zod détaillé (varie selon l'erreur)"
```
