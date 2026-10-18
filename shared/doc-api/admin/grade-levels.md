# Admin Grade Levels API

OpenAPI description des endpoints de gestion des Niveaux Scolaires (Grade Levels) sous `/admin/grade-levels`.

---

```yaml
paths:

  /admin/grade-levels:
    post:
      summary: Créer un niveau
      description: Crée un nouveau niveau (accessible uniquement aux administrateurs).
      operationId: CreateGradeLevel
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_grade_level_request'
      responses:
        '201':
          description: Niveau créé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Grade Level créé avec succès"
                  gradeLevel:
                    $ref: '#/components/schemas/grade_level_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '409':
          description: Conflit, un niveau avec ce numéro (level) existe déjà.
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

  /admin/grade-levels/{id}:
    get:
      summary: Obtenir un niveau par ID
      description: Récupère les détails d'un niveau spécifique (accessible uniquement aux administrateurs).
      operationId: GetGradeLevelById
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
          description: Détails du niveau récupérés avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/grade_level_item'
              example:
                _id: "64b9a5f2c7p1"
                level: 1
                grades: 
                  - countryId: "FR"
                    name: "CP"
        '404':
          description: Niveau non trouvé.
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
      summary: Mettre à jour un niveau
      description: Met à jour un niveau existant (accessible uniquement aux administrateurs).
      operationId: UpdateGradeLevel
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
              $ref: '#/components/schemas/update_grade_level_request'
      responses:
        '200':
          description: Niveau mis à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Grade Level mis à jour avec succès"
                  gradeLevel:
                    $ref: '#/components/schemas/grade_level_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '404':
          description: Niveau non trouvé.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '409':
          description: Conflit, un niveau avec ce numéro (level) existe déjà.
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
      summary: Supprimer un niveau
      description: Supprime un niveau existant (accessible uniquement aux administrateurs).
      operationId: DeleteGradeLevel
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
          description: Niveau supprimé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Grade Level supprimé avec succès"
        '404':
          description: Niveau non trouvé.
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
    grade_level_item:
      type: object
      properties:
        _id:
          type: string
          description: "ID du niveau (ObjectId)"
        level:
          type: integer
          description: "Le numéro d'ordre ou identifiant de niveau"
        grades:
          type: array
          items:
            type: object
            properties:
              countryId:
                type: string
                description: "Le code du pays (ex: FR)"
              name:
                type: string
                description: "Le nom du grade dans ce pays (ex: CP)"
    create_grade_level_request:
      type: object
      required:
        - level
        - grades
      properties:
        level:
          type: integer
          minimum: 1
          description: "Le numéro de niveau (entier > 0)"
        grades:
          type: array
          minItems: 1
          items:
            type: object
            required:
              - countryId
              - name
            properties:
              countryId:
                type: string
                minLength: 2
              name:
                type: string
                minLength: 1
    update_grade_level_request:
      type: object
      properties:
        level:
          type: integer
          minimum: 1
        grades:
          type: array
          minItems: 1
          items:
            type: object
            required:
              - countryId
              - name
            properties:
              countryId:
                type: string
                minLength: 2
              name:
                type: string
                minLength: 1
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
          description: "Format d'erreur de Zod détaillé"
```
