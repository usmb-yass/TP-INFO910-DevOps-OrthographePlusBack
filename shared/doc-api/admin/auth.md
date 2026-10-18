# Auth API (Admin)

OpenAPI description des endpoints d'authentification pour les administrateurs sous `/auth`.

---

```yaml
paths:
  /auth/admin/login:
    post:
      summary: Connexion administrateur
      description: Authentifie un administrateur et retourne un token JWT.
      operationId: AdminLogin
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/login_request'
      responses:
        '200':
          description: Connexion administrateur réussie.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/auth_response'
              example:
                message: "Connexion admin réussie"
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                user:
                  id: "64b9a5f2c7b2"
                  email: "admin@example.com"
                  role: "admin"

  /auth/admin/verify:
    post:
      summary: Vérification mot de passe administrateur
      description: Vérifie si le mot de passe de l'administrateur est correct sans générer de token.
      operationId: AdminVerify
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/login_request'
      responses:
        '200':
          description: Résultat de la vérification.
          content:
            application/json:
              schema:
                type: boolean
              example: true

components:
  schemas:
    login_request:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string
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
            id:
              type: string
            email:
              type: string
            role:
              type: string
            firstName:
              type: string
            lastName:
              type: string
```
