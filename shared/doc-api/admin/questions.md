# Questions API

OpenAPI description des endpoints de gestion des Questions sous `/admin/questions`.

---

```yaml
paths:

  /admin/questions:
    get:
      summary: Liste des questions
      description: Récupère la liste de toutes les questions (accessible uniquement aux administrateurs).
      operationId: GetAllQuestions
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
          description: Liste des questions récupérée avec succès.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/question_item'
              example:
                - id: "64b9a5f2c7b1"
                  type: "QCM"
                  isDisabled: false
                  data:
                    sentence: "Quel est le pluriel de chou ?"
                    options:
                      - id: "a"
                        text: "choux"
                      - id: "b"
                        text: "chous"
                    correctOption: "a"
                  ruleId: "64b9a5f2c7a2"

    post:
      summary: Créer une question
      description: Crée une nouvelle question (accessible uniquement aux administrateurs).
      operationId: CreateQuestion
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/create_question_request'
      responses:
        '201':
          description: Question créée avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  question:
                    $ref: '#/components/schemas/question_item'
              example:
                message: "Question créée avec succès"
                question:
                  id: "64b9a5f2c7b2"
                  type: "TROU"
                  isDisabled: false
                  data:
                    sentence: "Les bij___ sont beaux."
                    answer:
                      - "oux"
                  ruleId: "64b9a5f2c7a2"

  /admin/questions/upload-audio:
    post:
      summary: Uploader un fichier audio
      description: Upload un fichier audio pour une question (accessible uniquement aux administrateurs).
      operationId: UploadQuestionAudio
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                audio:
                  type: string
                  format: binary
      responses:
        '200':
          description: Fichier uploadé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  filename:
                    type: string
        '400':
          description: Aucun fichier fourni.
        '500':
          description: Erreur serveur interne.

  /admin/questions/{id}:
    get:
      summary: Obtenir une question par ID
      description: Récupère les détails d'une question spécifique (accessible uniquement aux administrateurs).
      operationId: GetQuestionById
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Détails de la question.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/question_item'
              example:
                id: "64b9a5f2c7b1"
                type: "QCM"
                isDisabled: false
                data:
                  sentence: "Quel est le pluriel de chou ?"
                  options:
                    - id: "a"
                      text: "choux"
                    - id: "b"
                      text: "chous"
                  correctOption: "a"
                ruleId: "64b9a5f2c7a2"

    put:
      summary: Mettre à jour une question
      description: Met à jour une question existante (accessible uniquement aux administrateurs).
      operationId: UpdateQuestion
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/update_question_request'
      responses:
        '200':
          description: Question mise à jour avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  question:
                    $ref: '#/components/schemas/question_item'
    delete:
      summary: Supprimer une question
      description: Supprime une question existante (accessible uniquement aux administrateurs).
      operationId: DeleteQuestion
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Question supprimée avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
              example:
                message: "Question supprimée avec succès"

components:
  schemas:
    question_option:
      type: object
      properties:
        id:
          type: string
        text:
          type: string
      required:
        - id
        - text
    question_data:
      type: object
      properties:
        sentence:
          type: string
        options:
          type: array
          items:
            $ref: '#/components/schemas/question_option'
        correctOption:
          type: string
        answer:
          type: array
          items:
            type: string
      required:
        - sentence
    question_item:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
          enum: [QCM, TROU]
        isDisabled:
          type: boolean
        data:
          $ref: '#/components/schemas/question_data'
        ruleId:
          type: string
    create_question_request:
      type: object
      required:
        - type
        - data
      properties:
        type:
          type: string
          enum: [QCM, TROU]
        isDisabled:
          type: boolean
        data:
          $ref: '#/components/schemas/question_data'
        ruleId:
          type: string
    update_question_request:
      type: object
      properties:
        type:
          type: string
          enum: [QCM, TROU]
        isDisabled:
          type: boolean
        data:
          $ref: '#/components/schemas/question_data'
        ruleId:
          type: string
```
