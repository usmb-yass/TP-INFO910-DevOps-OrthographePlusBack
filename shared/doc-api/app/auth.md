# Auth API (App)

OpenAPI description des endpoints d'authentification sous `/auth`.

---

```yaml
paths:
  /auth/register:
    post:
      summary: Inscription d'un utilisateur
      description: Crée un nouveau compte utilisateur (limité par le rate-limiter).
      operationId: RegisterUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/register_request'
      responses:
        '201':
          description: Utilisateur créé avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/auth_response'
              example:
                message: "Inscription réussie"
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                user:
                  id: "64b9a5f2c7a1"
                  email: "user@example.com"
                  role: "student"
                  firstName: "Jean"
                  lastName: "Dupont"
                  profilePicture: "default.png"

  /auth/login:
    post:
      summary: Connexion utilisateur
      description: Authentifie un utilisateur classique et retourne un token JWT.
      operationId: LoginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/login_request'
      responses:
        '200':
          description: Connexion réussie.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/auth_response'
              example:
                message: "Connexion réussie"
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                user:
                  id: "64b9a5f2c7a1"
                  email: "user@example.com"
                  role: "student"
                  firstName: "Jean"
                  lastName: "Dupont"
                  profilePicture: "default.png"

  /auth/me:
    get:
      summary: Récupérer le profil utilisateur
      description: Renvoie les informations de l'utilisateur actuellement connecté (protégé par JWT).
      operationId: GetMe
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Profil de l'utilisateur.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/user_profile'

components:
  schemas:
    user_profile:
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
        profilePicture:
          type: string
        country:
          type: object
          properties:
            _id:
              type: string
            name:
              type: string
        gradeLevel:
          type: object
          properties:
            _id:
              type: string
            level:
              type: integer
            grade:
              type: object
              properties:
                countryId:
                  type: string
                name:
                  type: string
        timezone:
          type: string
    register_request:
      type: object
      required:
        - email
        - password
        - countryId
        - gradeLevelId
        - timezone
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8
        firstName:
          type: string
        lastName:
          type: string
        countryId:
          type: string
          minLength: 2
          description: "ID du pays (ex: FR)"
        gradeLevelId:
          type: string
          pattern: "^[0-9a-fA-F]{24}$"
          description: "ID du niveau au format ObjectId"
        timezone:
          type: string
          description: "Fuseau horaire de l'utilisateur (ex: Europe/Paris)"
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
            profilePicture:
              type: string
```
