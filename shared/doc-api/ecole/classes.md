# Classes API (École)

OpenAPI description des endpoints de gestion des classes pour les administrateurs d'école sous `/school-admin/classes`.

---

```yaml
paths:
  /classes:
    get:
      summary: Lister les classes
      description: Récupère la liste des classes associées à l'école de l'administrateur connecté.
      operationId: GetSchoolClasses
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des classes.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/class'
        '403':
          description: Accès interdit (pas d'école associée).
        '500':
          description: Erreur serveur.

    post:
      summary: Créer une classe
      description: Crée une nouvelle classe pour l'école de l'administrateur connecté.
      operationId: CreateSchoolClass
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_class_request'
      responses:
        '201':
          description: Classe créée avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/class'
        '400':
          description: Données invalides.
        '403':
          description: Accès interdit (pas d'école associée).
        '500':
          description: Erreur serveur.

  /classes/{id}:
    put:
      summary: Mettre à jour une classe
      description: Met à jour une classe existante.
      operationId: UpdateSchoolClass
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: ID de la classe.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/update_class_request'
      responses:
        '200':
          description: Classe mise à jour avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/class'
        '400':
          description: Données invalides.
        '403':
          description: Accès interdit.
        '404':
          description: Classe introuvable.
        '500':
          description: Erreur serveur.

    delete:
      summary: Supprimer une classe
      description: Supprime une classe existante.
      operationId: DeleteSchoolClass
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: ID de la classe.
      responses:
        '200':
          description: Classe supprimée avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Classe supprimée"
        '403':
          description: Accès interdit.
        '404':
          description: Classe introuvable.
        '500':
          description: Erreur serveur.

components:
  schemas:
    create_class_request:
      type: object
      required:
        - name
        - gradeLevelId
      properties:
        name:
          type: string
        gradeLevelId:
          type: string
          pattern: '^[0-9a-fA-F]{24}$'
          description: "ID du niveau"
    update_class_request:
      type: object
      properties:
        name:
          type: string
        gradeLevelId:
          type: string
          pattern: '^[0-9a-fA-F]{24}$'
          description: "ID du niveau"
    class:
      type: object
      properties:
        _id:
          type: string
        name:
          type: string
        schoolId:
          type: string
        gradeLevelId:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```
