# Admin Countries API

OpenAPI description des endpoints de gestion des Pays sous `/admin/countries`.

---

```yaml
paths:

  /admin/countries:
    post:
      summary: Créer un pays
      description: Crée un nouveau pays (accessible uniquement aux administrateurs).
      operationId: CreateCountry
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_country_request'
      responses:
        '201':
          description: Pays créé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Pays créé avec succès"
                  country:
                    $ref: '#/components/schemas/country_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '409':
          description: Conflit, un pays avec ce code existe déjà.
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

  /admin/countries/{id}:
    get:
      summary: Obtenir un pays par ID
      description: Récupère les détails d'un pays spécifique via son code (accessible uniquement aux administrateurs).
      operationId: GetCountryById
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: Le code du pays (ex. FR)
      responses:
        '200':
          description: Détails du pays récupérés avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/country_item'
              example:
                _id: "FR"
                name: "France"
        '404':
          description: Pays non trouvé.
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
      summary: Mettre à jour un pays
      description: Met à jour un pays existant (accessible uniquement aux administrateurs).
      operationId: UpdateCountry
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: Le code du pays
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/update_country_request'
      responses:
        '200':
          description: Pays mis à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Pays mis à jour avec succès"
                  country:
                    $ref: '#/components/schemas/country_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '404':
          description: Pays non trouvé.
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
      summary: Supprimer un pays
      description: Supprime un pays existant (accessible uniquement aux administrateurs).
      operationId: DeleteCountry
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: Le code du pays
      responses:
        '200':
          description: Pays supprimé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Pays supprimé avec succès"
        '404':
          description: Pays non trouvé.
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
    country_item:
      type: object
      properties:
        _id:
          type: string
          description: "Le code du pays (ex: FR)"
        name:
          type: string
          description: "Le nom du pays"
    create_country_request:
      type: object
      required:
        - _id
        - name
      properties:
        _id:
          type: string
          minLength: 2
          description: "Le code du pays (minimum 2 caractères)"
        name:
          type: string
          minLength: 1
          description: "Le nom du pays"
    update_country_request:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          description: "Le nom du pays"
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
