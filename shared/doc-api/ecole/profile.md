# Profile API (École)

OpenAPI description des endpoints du profil pour les administrateurs d'école sous `/school-admin/profile`.

---

```yaml
paths:
  /profile/me:
    get:
      summary: Obtenir le profil de l'école
      description: Récupère les informations de l'école associée à l'administrateur connecté.
      operationId: GetSchoolProfile
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Profil de l'école.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/school_profile'
        '403':
          description: Aucune école associée à votre profil.
        '404':
          description: École non trouvée.
        '500':
          description: Erreur serveur interne.

components:
  schemas:
    school_profile:
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
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```
