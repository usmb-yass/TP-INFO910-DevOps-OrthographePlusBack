# Settings API

OpenAPI description des endpoints de gestion des Paramètres (Settings) accessibles exclusivement sous `/admin/settings`.

---

```yaml
paths:
  /admin/settings:
    get:
      summary: Liste des paramètres
      description: Récupère la liste de tous les paramètres de l'application (accessible uniquement aux administrateurs).
      operationId: GetAllSettings
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des paramètres récupérée avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/setting_item'
              example:
                - _id: "64b9a5f2c7s1"
                  maxLessonsPerDay: 2
                  dailyReset:
                    type: "ROLLING_24H"
                  createdAt: "2023-10-01T12:00:00.000Z"
                  updatedAt: "2023-10-01T12:00:00.000Z"
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

  /admin/settings/{id}:
    get:
      summary: Obtenir un paramètre par ID
      description: Récupère les détails d'un paramètre spécifique (accessible uniquement aux administrateurs).
      operationId: GetSettingById
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
          description: Détails du paramètre récupérés avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/setting_item'
              example:
                _id: "64b9a5f2c7s1"
                maxLessonsPerDay: 2
                dailyReset:
                  type: "ROLLING_24H"
                createdAt: "2023-10-01T12:00:00.000Z"
                updatedAt: "2023-10-01T12:00:00.000Z"
        '404':
          description: Paramètre non trouvé.
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
      summary: Mettre à jour un paramètre
      description: Met à jour les valeurs d'un paramètre existant. Le champ `updatedAt` est automatiquement mis à jour (accessible uniquement aux administrateurs).
      operationId: UpdateSetting
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
              $ref: '#/components/schemas/update_setting_request'
      responses:
        '200':
          description: Paramètre mis à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Paramètre mis à jour avec succès"
                  setting:
                    $ref: '#/components/schemas/setting_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '404':
          description: Paramètre non trouvé.
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
    setting_item:
      type: object
      properties:
        _id:
          type: string
          description: "ID du paramètre (ObjectId)"
        maxLessonsPerDay:
          type: integer
          default: 2
        dailyReset:
          type: object
          properties:
            type:
              type: string
              enum: ["ROLLING_24H", "LOCAL_TIME"]
            time:
              type: string
              description: "Format HH:mm, requis si type est LOCAL_TIME"
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    update_setting_request:
      type: object
      properties:
        maxLessonsPerDay:
          type: integer
          minimum: 1
          description: "Le nombre maximum de leçons par jour (optionnel)"
        dailyReset:
          type: object
          properties:
            type:
              type: string
              enum: ["ROLLING_24H", "LOCAL_TIME"]
            time:
              type: string
              description: "Format HH:mm"
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
