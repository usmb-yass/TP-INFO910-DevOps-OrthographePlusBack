# Auth API (École)

OpenAPI description des endpoints d'authentification pour les écoles sous `/auth`.

---

```yaml
paths:
  /auth/school-admin/register:
    post:
      summary: Inscription d'un administrateur d'école
      description: Crée un nouveau compte administrateur d'école à partir d'un token d'invitation.
      operationId: RegisterSchoolAdmin
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/register_school_admin_request'
      responses:
        '201':
          description: Inscription administrateur école réussie.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/auth_response'
              example:
                message: "Inscription administrateur école réussie"
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                user:
                  _id: "64b9a5f2c7a1"
                  email: "directeur@ecole.com"
                  role: "school-admin"
                  firstName: "Jean"
                  lastName: "Dupont"
                  schoolId: 
                    _id: "64b9a5f2c7a2"
                    name: "École Primaire Victor Hugo"
        '400':
          description: Données invalides ou invitation expirée.
        '409':
          description: Un compte existe déjà pour cet email.
        '500':
          description: Erreur interne du serveur.

components:
  schemas:
    register_school_admin_request:
      type: object
      required:
        - token
        - firstName
        - lastName
        - password
      properties:
        token:
          type: string
          description: "Token d'invitation fourni par l'administrateur principal"
        firstName:
          type: string
          minLength: 2
        lastName:
          type: string
          minLength: 2
        password:
          type: string
          minLength: 8
    auth_response:
      type: object
      properties:
        message:
          type: string
        token:
          type: string
        user:
          type: object
          properties:
            _id:
              type: string
            email:
              type: string
            role:
              type: string
            firstName:
              type: string
            lastName:
              type: string
            schoolId:
              type: object
              description: "Objet de l'école (peuplé)"
```
