# Countries API (Publique)

OpenAPI description des endpoints publics de gestion des Pays sous `/countries`.

---

```yaml
paths:
  /countries:
    get:
      summary: Liste des pays
      description: Récupère la liste de tous les pays (accessible à tous, route publique).
      operationId: GetAllCountries
      responses:
        '200':
          description: Liste des pays récupérée avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/country_item'
              example:
                - _id: "FR"
                  name: "France"
                - _id: "BE"
                  name: "Belgique"
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
    error_response:
      type: object
      properties:
        error:
          type: string
```
