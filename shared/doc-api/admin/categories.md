# Categories API

Description OpenAPI des endpoints d'administration des Catégories sous `/admin/categories`.

---

```yaml
paths:
  /admin/categories:
    get:
      summary: Liste de toutes les catégories
      description: Récupère toutes les catégories enregistrées en base de données. Accessible uniquement aux administrateurs.
      operationId: GetAllCategories
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des catégories récupérée avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/category_item'
              example:
                - id: "64b9a5f2c7a0"
                  name: "Conjugaison"
                - id: "64b9a5f2c7a1"
                  name: "Orthographe"
        '401':
          description: Non authentifié.
        '403':
          description: Accès interdit (rôle administrateur requis).
        '500':
          description: Erreur serveur interne.
          
    post:
      summary: Créer une catégorie
      description: Crée une nouvelle catégorie en base de données. Accessible uniquement aux administrateurs.
      operationId: CreateCategory
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_category_request'
      responses:
        '201':
          description: Catégorie créée avec succès.
          content:
            application/json:
              schema:
                type: object
                required:
                  - message
                  - category
                properties:
                  message:
                    type: string
                  category:
                    $ref: '#/components/schemas/category_item'
              example:
                message: "Catégorie créée avec succès"
                category:
                  id: "64b9a5f2c7a2"
                  name: "Grammaire"
        '400':
          description: Données invalides (ex. nom de catégorie manquant).
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
          description: Non authentifié.
        '403':
          description: Accès interdit (rôle administrateur requis).
        '409':
          description: Conflit (une catégorie avec ce nom existe déjà).
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Une catégorie avec ce nom existe déjà"
        '500':
          description: Erreur serveur interne.

  /admin/categories/{id}:
    get:
      summary: Obtenir une catégorie par son ID
      description: Récupère les détails d'une catégorie spécifique à l'aide de son ID MongoDB. Accessible uniquement aux administrateurs.
      operationId: GetCategoryById
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID unique (format ObjectId MongoDB sur 24 caractères hexadécimaux) de la catégorie.
          schema:
            type: string
            pattern: '^[0-9a-fA-F]{24}$'
      responses:
        '200':
          description: Détails de la catégorie.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/category_item'
              example:
                id: "64b9a5f2c7a0"
                name: "Conjugaison"
        '401':
          description: Non authentifié.
        '403':
          description: Accès interdit (rôle administrateur requis).
        '404':
          description: Catégorie non trouvée.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Catégorie non trouvée"
        '500':
          description: Erreur serveur interne.

    put:
      summary: Mettre à jour une catégorie
      description: Met à jour une catégorie existante. Accessible uniquement aux administrateurs.
      operationId: UpdateCategory
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID unique (format ObjectId MongoDB sur 24 caractères hexadécimaux) de la catégorie à mettre à jour.
          schema:
            type: string
            pattern: '^[0-9a-fA-F]{24}$'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/update_category_request'
      responses:
        '200':
          description: Catégorie mise à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                required:
                  - message
                  - category
                properties:
                  message:
                    type: string
                  category:
                    $ref: '#/components/schemas/category_item'
              example:
                message: "Catégorie mise à jour avec succès"
                category:
                  id: "64b9a5f2c7a0"
                  name: "Conjugaison et Accords"
        '400':
          description: Données invalides.
        '401':
          description: Non authentifié.
        '403':
          description: Accès interdit (rôle administrateur requis).
        '404':
          description: Catégorie non trouvée.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Catégorie non trouvée"
        '409':
          description: Conflit (le nouveau nom existe déjà sur une autre catégorie).
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Une catégorie avec ce nom existe déjà"
        '500':
          description: Erreur serveur interne.

    delete:
      summary: Supprimer une catégorie
      description: Supprime une catégorie de la base de données. Accessible uniquement aux administrateurs.
      operationId: DeleteCategory
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID unique (format ObjectId MongoDB sur 24 caractères hexadécimaux) de la catégorie à supprimer.
          schema:
            type: string
            pattern: '^[0-9a-fA-F]{24}$'
      responses:
        '200':
          description: Catégorie supprimée avec succès.
          content:
            application/json:
              schema:
                type: object
                required:
                  - message
                properties:
                  message:
                    type: string
              example:
                message: "Catégorie supprimée avec succès"
        '401':
          description: Non authentifié.
        '403':
          description: Accès interdit (rôle administrateur requis).
        '404':
          description: Catégorie non trouvée.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
              example:
                error: "Catégorie non trouvée"
        '500':
          description: Erreur serveur interne.

components:
  schemas:
    category_item:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: string
          description: Format ObjectId MongoDB (24 caractères hexadécimaux)
        name:
          type: string
    create_category_request:
      type: object
      required:
        - name
      properties:
        name:
          type: string
    update_category_request:
      type: object
      properties:
        name:
          type: string
```
