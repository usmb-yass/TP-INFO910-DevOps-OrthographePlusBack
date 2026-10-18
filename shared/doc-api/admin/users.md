# Users API (Admin)

OpenAPI description des endpoints d'administration des Utilisateurs sous `/admin/users`.

---

```yaml
paths:
  /admin/users:
    get:
      summary: Liste des utilisateurs
      description: Récupère la liste complète des utilisateurs de l'application (accessible uniquement aux administrateurs).
      operationId: AdminGetAllUsers
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des utilisateurs.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/user_item'
              example:
                - _id: "65ab81234b4c3e21a1f0a123"
                  email: "user@example.com"
                  firstName: "Jean"
                  lastName: "Dupont"
                  profilePicture: "default.png"
                  role: "STUDENT"
                  schoolId:
                    _id: "65ab81234b4c3e21a1f0a000"
                    name: "École Primaire Victor Hugo"
                  classId:
                    _id: "65ab81234b4c3e21a1f0a001"
                    name: "CM2 A"
                  countryId:
                    _id: "FR"
                    name: "France"
                  gradeLevelId:
                    _id: "65ab81234b4c3e21a1f0a002"
                    name: "CM2"
                  isSchoolLicense: true
                  timezone: "Europe/Paris"
                  currentProgressId: "65ab81234b4c3e21a1f0a003"
                  progressSummary:
                    streak: 5
                    xp: 1200
                    gamificationLevel: 3
                    dailyLessons:
                      count: 1
                  createdAt: "2024-01-20T10:00:00.000Z"
        '401':
          description: Non autorisé.
        '403':
          description: Accès interdit.
        '500':
          description: Erreur serveur interne.

components:
  schemas:
    user_item:
      type: object
      properties:
        _id:
          type: string
        email:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        profilePicture:
          type: string
        role:
          type: string
        schoolId:
          type: object
        classId:
          type: object
        countryId:
          type: object
        gradeLevelId:
          type: object
        isSchoolLicense:
          type: boolean
        timezone:
          type: string
        currentProgressId:
          type: string
        progressSummary:
          type: object
        createdAt:
          type: string
          format: date-time
```
