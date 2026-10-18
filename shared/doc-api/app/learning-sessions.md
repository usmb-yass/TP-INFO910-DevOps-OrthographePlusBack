# Learning Sessions API

OpenAPI description des endpoints de gestion des sessions d'apprentissage sous `/learning-sessions`.

---

```yaml
paths:
  /learning-sessions/start:
    post:
      summary: Démarrer une session
      description: "Démarre une nouvelle session d'apprentissage (ou reprend une session en cours s'il en existe déjà une de même type). S'il s'agit d'une session de type `DAILY_LESSON`, le backend sélectionne aléatoirement 7 questions pour chaque règle de la leçon courante. S'il s'agit d'une session de type `TRAINING`, il faut fournir `categoryIds` et `numberOfQuestions` ; le backend distribuera équitablement le nombre de questions demandé parmi les règles des catégories ciblées."
      operationId: StartLearningSession
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - type
              properties:
                type:
                  type: string
                  enum: ["DAILY_LESSON", "TRAINING"]
                  description: "Le type de session à démarrer."
                categoryIds:
                  type: array
                  items:
                    type: string
                    pattern: "^[0-9a-fA-F]{24}$"
                  description: "Obligatoire si type=TRAINING (pour créer un nouvel entraînement). Omettre pour reprendre l'entraînement en cours."
                numberOfQuestions:
                  type: integer
                  description: "Obligatoire si type=TRAINING (pour créer un nouvel entraînement). Omettre pour reprendre l'entraînement en cours."
      responses:
        '201':
          description: Session démarrée (ou reprise) avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/populated_learning_session_item'
        '400':
          description: Données invalides (erreur de validation Zod).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '401':
          description: Non autorisé (token manquant ou invalide).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '403':
          description: Accès interdit (tentative d'entraînement sur des catégories non vues).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '404':
          description: Leçon actuelle ou progression introuvable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '409':
          description: Conflit (une session de ce type est déjà en cours, si l'index MongoDB bloque la création).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

  /learning-sessions/{id}/submit-answer:
    post:
      summary: Soumettre une réponse
      description: Soumet la réponse de l'utilisateur pour la question courante de la session. Vérifie si la réponse est correcte, met à jour la question, et avance à la question suivante. Si la session n'est pas un entraînement, met également à jour la liste des règles et catégories vues par l'utilisateur dans sa progression.
      operationId: SubmitAnswer
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: "L'ID de la session (ObjectId)"
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - questionId
                - userAnswer
              properties:
                questionId:
                  type: string
                  pattern: "^[0-9a-fA-F]{24}$"
                  description: "L'ID de la question en cours."
                userAnswer:
                  type: string
                  description: "La réponse fournie par l'utilisateur (le texte ou l'ID de l'option)."
                duration:
                  type: integer
                  description: "La durée totale (en secondes) écoulée depuis le début de la session. Cette valeur écrase la durée précédemment sauvegardée."
      responses:
        '200':
          description: Réponse soumise et validée.
          content:
            application/json:
              schema:
                type: object
                properties:
                  session:
                    $ref: '#/components/schemas/learning_session_item'
                  isCorrect:
                    type: boolean
                    description: "Indique si la réponse soumise est correcte ou non."
                  correctAnswer:
                    type: string
                    description: "Le texte de la bonne réponse."
                  ruleExplanation:
                    type: array
                    description: "L'explication de la règle associée (au format OrthographePlusRichText)."
                    items:
                      type: object
                  newQuestions:
                    type: array
                    items:
                      $ref: '#/components/schemas/populated_learning_session_item/properties/questions/items'
                    description: "Renvoyé uniquement si la liste des questions a été dynamiquement modifiée (ajout de questions suite à des erreurs)."
        '400':
          description: Données invalides, ou session plus en cours, ou questionId ne correspondant pas.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/validation_error_response'
        '401':
          description: Non autorisé.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '404':
          description: Session ou question introuvable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

  /learning-sessions/{id}/finish:
    post:
      summary: Terminer une session
      description: Clôture manuellement une session d'apprentissage, calcule le score final, définit le statut de réussite (`isPassed`) selon le `minScore` de la leçon, et met à jour la progression de l'utilisateur en conséquence.
      operationId: FinishLearningSession
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: "L'ID de la session (ObjectId)"
          schema:
            type: string
      responses:
        '200':
          description: Session terminée avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/learning_session_item'
        '401':
          description: Non autorisé.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '404':
          description: Session introuvable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

  /learning-sessions/training:
    delete:
      summary: Supprimer l'entraînement en cours
      description: "Supprime physiquement de la base de données la session d'entraînement `IN_PROGRESS` de l'utilisateur. Utile lorsque l'utilisateur décide d'abandonner l'entraînement en cours pour en recommencer un autre."
      operationId: DeleteCurrentTraining
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Entraînement supprimé avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        '401':
          description: Non autorisé.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '404':
          description: Aucun entraînement en cours trouvé.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '500':
          description: Erreur serveur interne.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'

components:
  schemas:
    learning_session_item:
      type: object
      properties:
        _id:
          type: string
          description: "ID de la session (ObjectId)"
        userId:
          type: string
          description: "ID de l'utilisateur (ObjectId)"
        userProgressId:
          type: string
          description: "ID de la progression liée (ObjectId)"
        type:
          type: string
          enum: ["DAILY_LESSON", "TRAINING"]
        status:
          type: string
          enum: ["in_progress", "completed"]
        lessonId:
          type: string
          description: "ID de la leçon concernée (ObjectId)"
        attemptNumber:
          type: integer
        scorePercentage:
          type: integer
        isPassed:
          type: boolean
        currentQuestionIndex:
          type: integer
        duration:
          type: integer
          description: "Durée totale de la session en secondes."
        questions:
          type: array
          items:
            type: object
            properties:
              questionId:
                type: string
                description: "ID de la question (ObjectId)"
              userAnswer:
                type: string
                nullable: true
              isCorrect:
                type: boolean
                nullable: true
              answeredAt:
                type: string
                format: date-time
                nullable: true
        startedAt:
          type: string
          format: date-time
        completedAt:
          type: string
          format: date-time
        xpGained:
          type: array
          description: "Liste des gains d'XP (base et bonus) obtenus lors de cette session. Renseigné uniquement une fois la session terminée."
          items:
            type: object
            properties:
              type:
                type: string
                description: "Le type de gain (ex: 'BASE_LESSON', 'FAIL_LESSON', 'SECOND_LESSON_BONUS', 'PERFORMANCE_BONUS')"
              amount:
                type: integer
                description: "Le montant d'XP gagné"
    populated_learning_session_item:
      allOf:
        - $ref: '#/components/schemas/learning_session_item'
        - type: object
          properties:
            questions:
              type: array
              items:
                type: object
                properties:
                  question:
                    $ref: '#/components/schemas/question_item'
                  rule:
                    type: object
                    properties:
                      name:
                        type: string
    error_response:
      type: object
      properties:
        error:
          type: string
    validation_error_response:
      type: object
      properties:
        error:
          type: string
        details:
          type: object
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
        _id:
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
```
