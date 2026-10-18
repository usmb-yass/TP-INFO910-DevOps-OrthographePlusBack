# Rules API

OpenAPI description des endpoints de gestion des Règles sous `/admin/rules`.

---

```yaml
paths:
  /admin/rules:
    get:
      summary: Liste des règles
      description: Récupère la liste de toutes les règles (accessible uniquement aux administrateurs).
      operationId: GetAllRules
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
          description: Liste des règles récupérée avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/rule_item_populated'
              example:
                - _id: "64b9a5f2c7a1000000000001"
                  name: "Accord du participe passé"
                  data:
                    explanation:
                      - _type: "block"
                        children:
                          - _type: "span"
                            text: "Le participe passé employé avec avoir s'accorde avec le COD si celui-ci est placé avant."
                    summary: []
                    example: []
                    tip: []
                  categoryId:
                    _id: "64b9a5f2c7a0000000000002"
                    name: "Grammaire"
                  __v: 0
        '500':
          description: Erreur serveur interne
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

    post:
      summary: Créer une règle
      description: Crée une nouvelle règle (accessible uniquement aux administrateurs).
      operationId: CreateRule
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_rule_request'
      responses:
        '201':
          description: Règle créée avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  rule:
                    $ref: '#/components/schemas/rule_item_raw'
              example:
                message: "Règle créée avec succès"
                rule:
                  _id: "64b9a5f2c7a2000000000003"
                  name: "Pluriel des noms en -ou"
                  data:
                    explanation:
                      - _type: "block"
                        children:
                          - _type: "span"
                            text: "Les noms en -ou prennent un s au pluriel, sauf 7 exceptions..."
                    summary: []
                    example: []
                    tip: []
                  categoryId: "64b9a5f2c7a0000000000002"
                  __v: 0
        '400':
          description: Données invalides ou catégorie inexistante.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                  details:
                    type: object
              examples:
                ValidationError:
                  value:
                    error: "Données invalides"
                    details:
                      name:
                        _errors: ["Le nom de la règle est requis"]
                CategoryNotFound:
                  value:
                    error: "La catégorie spécifiée n'existe pas"
        '409':
          description: Une règle avec ce nom existe déjà.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
              example:
                error: "Une règle avec ce nom existe déjà"
        '500':
          description: Erreur serveur interne
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

  /admin/rules/{id}:
    get:
      summary: Obtenir une règle par ID
      description: Récupère les détails d'une règle spécifique (accessible uniquement aux administrateurs).
      operationId: GetRuleById
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID de la règle (format ObjectId MongoDB)
          schema:
            type: string
            pattern: '^[0-9a-fA-F]{24}$'
      responses:
        '200':
          description: Détails de la règle.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rule_item_populated'
        '404':
          description: Règle non trouvée
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
              example:
                error: "Règle non trouvée"
        '500':
          description: Erreur serveur interne
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

    put:
      summary: Mettre à jour une règle
      description: Met à jour une règle existante (accessible uniquement aux administrateurs).
      operationId: UpdateRule
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID de la règle (format ObjectId MongoDB)
          schema:
            type: string
            pattern: '^[0-9a-fA-F]{24}$'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/update_rule_request'
      responses:
        '200':
          description: Règle mise à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  rule:
                    $ref: '#/components/schemas/rule_item_raw'
              example:
                message: "Règle mise à jour avec succès"
                rule:
                  id: "64b9a5f2c7a2"
                  name: "Pluriel des noms en -ou"
                  data:
                    explanation:
                      - _type: "block"
                        children:
                          - _type: "span"
                            text: "Les noms en -ou prennent un s au pluriel, sauf 7 exceptions..."
                    summary: []
                    example: []
                    tip: []
                  categoryId: "64b9a5f2c7a0"
        '400':
          description: Données invalides ou catégorie inexistante.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                  details:
                    type: object
              examples:
                ValidationError:
                  value:
                    error: "Données invalides"
                    details:
                      name:
                        _errors: ["Expected string, received number"]
                CategoryNotFound:
                  value:
                    error: "La catégorie spécifiée n'existe pas"
        '404':
          description: Règle non trouvée.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
              example:
                error: "Règle non trouvée"
        '409':
          description: Une règle avec ce nom existe déjà.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
              example:
                error: "Une règle avec ce nom existe déjà"
        '500':
          description: Erreur serveur interne
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
                
    delete:
      summary: Supprimer une règle
      description: Supprime une règle existante (accessible uniquement aux administrateurs).
      operationId: DeleteRule
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID de la règle (format ObjectId MongoDB)
          schema:
            type: string
            pattern: '^[0-9a-fA-F]{24}$'
      responses:
        '200':
          description: Règle supprimée avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
              example:
                message: "Règle supprimée avec succès"
        '404':
          description: Règle non trouvée.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
              example:
                error: "Règle non trouvée"
        '500':
          description: Erreur serveur interne
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

components:
  schemas:
    error_response:
      type: object
      properties:
        error:
          type: string
    orthographe_plus_rich_text_block:
      type: object
      required:
        - _type
        - children
      properties:
        _type:
          type: string
          enum: ["block"]
          example: "block"
        _key:
          type: string
        style:
          type: string
          enum: ["normal", "h1", "h2", "blockquote"]
          example: "normal"
        listItem:
          type: string
          enum: ["bullet", "number"]
        level:
          type: number
        children:
          type: array
          items:
            type: object
            properties:
              _type:
                type: string
                example: "span"
              text:
                type: string
              marks:
                type: array
                items:
                  type: string
        markDefs:
          type: array
          items:
            type: object
            properties:
              _key:
                type: string
              _type:
                type: string
              value:
                type: string
    rule_data:
      type: object
      required:
        - explanation
        - summary
        - example
        - tip
      properties:
        explanation:
          type: array
          items:
            $ref: '#/components/schemas/orthographe_plus_rich_text_block'
        summary:
          type: array
          items:
            $ref: '#/components/schemas/orthographe_plus_rich_text_block'
        example:
          type: array
          items:
            $ref: '#/components/schemas/orthographe_plus_rich_text_block'
        tip:
          type: array
          items:
            $ref: '#/components/schemas/orthographe_plus_rich_text_block'
    category_sub_item:
      type: object
      properties:
        _id:
          type: string
          description: ID de la catégorie au format ObjectId
          pattern: '^[0-9a-fA-F]{24}$'
        name:
          type: string
    rule_item_populated:
      type: object
      properties:
        _id:
          type: string
          description: ID de la règle au format ObjectId
          pattern: '^[0-9a-fA-F]{24}$'
        name:
          type: string
        data:
          $ref: '#/components/schemas/rule_data'
        categoryId:
          $ref: '#/components/schemas/category_sub_item'
        __v:
          type: number
    rule_item_raw:
      type: object
      properties:
        _id:
          type: string
          description: ID de la règle au format ObjectId
          pattern: '^[0-9a-fA-F]{24}$'
        name:
          type: string
        data:
          $ref: '#/components/schemas/rule_data'
        categoryId:
          type: string
          description: ID de la catégorie au format ObjectId
          pattern: '^[0-9a-fA-F]{24}$'
        __v:
          type: number
    create_rule_request:
      type: object
      required:
        - name
        - data
        - categoryId
      properties:
        name:
          type: string
          description: Doit contenir au moins 1 caractère
        data:
          $ref: '#/components/schemas/rule_data'
        categoryId:
          type: string
          description: ID de la catégorie au format ObjectId
          pattern: '^[0-9a-fA-F]{24}$'
    update_rule_request:
      type: object
      properties:
        name:
          type: string
          description: Doit contenir au moins 1 caractère si fourni
        data:
          $ref: '#/components/schemas/rule_data'
        categoryId:
          type: string
          description: ID de la catégorie au format ObjectId
          pattern: '^[0-9a-fA-F]{24}$'
```
