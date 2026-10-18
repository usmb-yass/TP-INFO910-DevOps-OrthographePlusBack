# Grade Levels API (Publique)

OpenAPI description des endpoints publics de gestion des Niveaux Scolaires (Grade Levels) sous `/grade-levels`.

---

```yaml
paths:
  /grade-levels:
    get:
      summary: Liste des niveaux
      description: Récupère la liste de tous les niveaux (accessible à tous, route publique).
      operationId: GetAllGradeLevels
      responses:
        '200':
          description: Liste des niveaux récupérée avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/grade_level_item'
              example:
                - _id: "64b9a5f2c7p1"
                  level: 1
                  grades: 
                    - countryId: "FR"
                      name: "CP"
                    - countryId: "BE"
                      name: "1ère primaire"
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
    error_response:
      type: object
      properties:
        error:
          type: string
```
