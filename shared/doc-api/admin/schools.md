# Schools API (Admin)

OpenAPI description des endpoints de gestion des écoles pour les administrateurs sous `/admin/schools`.

---

```yaml
paths:
  /schools:
    get:
      summary: Lister les écoles
      description: Récupère la liste de toutes les écoles créées dans le système.
      operationId: AdminGetSchools
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des écoles.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/school'
        '401':
          description: Non autorisé.
        '500':
          description: Erreur serveur interne.

    post:
      summary: Créer une école
      description: Crée une nouvelle école et génère un token d'invitation pour l'administrateur de l'école.
      operationId: AdminCreateSchool
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_school_request'
      responses:
        '201':
          description: École créée avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  school:
                    $ref: '#/components/schemas/school'
                  invitationToken:
                    type: string
        '400':
          description: Données invalides.
        '401':
          description: Non autorisé.
        '409':
          description: Cet email est déjà utilisé par une autre école.
        '500':
          description: Erreur serveur interne.

components:
  schemas:
    create_school_request:
      type: object
      required:
        - name
        - email
        - maxLicenses
        - country
      properties:
        name:
          type: string
        email:
          type: string
          format: email
        maxLicenses:
          type: number
          minimum: 1
        country:
          type: string
    school:
      type: object
      properties:
        _id:
          type: string
        name:
          type: string
        adminEmail:
          type: string
        countryId:
          type: string
        maxLicenses:
          type: number
        usedLicenses:
          type: number
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```
