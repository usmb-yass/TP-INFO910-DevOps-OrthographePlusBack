# Programs API

OpenAPI description des endpoints de gestion des Programmes sous `/admin/programs`.

---

```yaml
paths:

  /admin/programs:
    get:
      summary: Liste des programmes
      description: Récupère la liste de tous les programmes (accessible uniquement aux administrateurs).
      operationId: GetAllPrograms
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
          description: Liste des programmes récupérée avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/program_item'
              example:
                - _id: "64b9a5f2c7p1"
                  name: "Programme Orthographe Débutant"
                  lessons: ["64b9a5f2c7a1", "64b9a5f2c7a2"]
                  createdAt: "2023-10-01T12:00:00.000Z"
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

    post:
      summary: Créer un programme
      description: Crée un nouveau programme (accessible uniquement aux administrateurs).
      operationId: CreateProgram
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_program_request'
      responses:
        '201':
          description: Programme créé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Programme créé avec succès"
                  program:
                    $ref: '#/components/schemas/program_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '409':
          description: Conflit, un programme avec ce nom existe déjà.
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

  /admin/programs/{id}:
    get:
      summary: Obtenir un programme par ID
      description: Récupère les détails d'un programme spécifique (accessible uniquement aux administrateurs).
      operationId: GetProgramById
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
          description: Détails du programme récupérés avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/program_item'
              example:
                _id: "64b9a5f2c7p1"
                name: "Programme Orthographe Débutant"
                gradeLevelId: "64b9a5f2c7g1"
                lessons: 
                  - lessonId: "64b9a5f2c7a1"
                    order: 1
                  - lessonId: "64b9a5f2c7a2"
                    order: 2
                createdAt: "2023-10-01T12:00:00.000Z"
        '404':
          description: Programme non trouvé.
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
      summary: Mettre à jour un programme
      description: Met à jour un programme existant (accessible uniquement aux administrateurs).
      operationId: UpdateProgram
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
              $ref: '#/components/schemas/update_program_request'
      responses:
        '200':
          description: Programme mis à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Programme mis à jour avec succès"
                  program:
                    $ref: '#/components/schemas/program_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '404':
          description: Programme non trouvé.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '409':
          description: Conflit, un programme avec ce nom existe déjà.
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
      summary: Supprimer un programme
      description: Supprime un programme existant (accessible uniquement aux administrateurs).
      operationId: DeleteProgram
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
          description: Programme supprimé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Programme supprimé avec succès"
        '404':
          description: Programme non trouvé.
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
    program_item:
      type: object
      properties:
        _id:
          type: string
          description: "ID du programme (ObjectId)"
        name:
          type: string
        gradeLevelId:
          type: string
          description: "ID du niveau (ObjectId)"
        lessons:
          type: array
          items:
            type: object
            properties:
              lessonId:
                type: string
                description: "ID de la leçon (ObjectId)"
              order:
                type: integer
                description: "L'ordre de la leçon"
        createdAt:
          type: string
          format: date-time
    create_program_request:
      type: object
      required:
        - name
        - gradeLevelId
        - lessons
      properties:
        name:
          type: string
          description: "Le nom du programme (minimum 1 caractère)"
        gradeLevelId:
          type: string
          pattern: "^[0-9a-fA-F]{24}$"
          description: "ID de niveau au format ObjectId"
        lessons:
          type: array
          minItems: 1
          items:
            type: object
            required:
              - lessonId
              - order
            properties:
              lessonId:
                type: string
                pattern: "^[0-9a-fA-F]{24}$"
              order:
                type: integer
    update_program_request:
      type: object
      properties:
        name:
          type: string
        gradeLevelId:
          type: string
          pattern: "^[0-9a-fA-F]{24}$"
        lessons:
          type: array
          items:
            type: object
            properties:
              lessonId:
                type: string
                pattern: "^[0-9a-fA-F]{24}$"
              order:
                type: integer
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
