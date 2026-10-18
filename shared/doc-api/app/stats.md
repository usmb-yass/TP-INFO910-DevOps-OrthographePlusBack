# Stats API (App)

Description OpenAPI de l'endpoint de statistiques de l'utilisateur sous `/stats`.

---

```yaml
paths:
  /stats/my-stats:
    get:
      summary: Récupérer les statistiques de l'utilisateur
      description: "Calcule et renvoie à la volée les statistiques de l'utilisateur courant : progression globale, nombre de catégories et règles vues par rapport au total de son programme, ainsi que l'historique de ses tentatives (erreurs, score, questions) regroupées par leçon."
      operationId: GetMyStats
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Statistiques récupérées avec succès.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/user_stat'
        '401':
          description: Non autorisé (token manquant ou invalide).
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error_response'
        '404':
          description: Progression ou programme de l'utilisateur introuvable.
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
    user_stat:
      type: object
      properties:
        globalProgression:
          type: object
          properties:
            lastCompletedLessonNumber:
              type: integer
              description: "Le numéro de la dernière leçon complétée (index 0 = 0 complété)."
            totalLessons:
              type: integer
              description: "Le nombre total de leçons dans le programme de l'utilisateur."
          required:
            - lastCompletedLessonNumber
            - totalLessons
        categories:
          type: object
          properties:
            seen:
              type: integer
              description: "Le nombre de catégories déjà vues par l'utilisateur."
            total:
              type: integer
              description: "Le nombre total de catégories distinctes présentes dans le programme de l'utilisateur."
          required:
            - seen
            - total
        rules:
          type: object
          properties:
            seen:
              type: integer
              description: "Le nombre de règles déjà vues par l'utilisateur."
            total:
              type: integer
              description: "Le nombre total de règles distinctes présentes dans le programme de l'utilisateur."
          required:
            - seen
            - total
        attemptsByLesson:
          type: object
          additionalProperties:
            type: object
            properties:
              minScore:
                type: integer
                description: "Le score minimal requis pour réussir cette leçon."
              attempts:
                type: array
                items:
                  type: object
                  properties:
                    sessionId:
                      type: string
                      description: "L'ID de la session (ObjectId)."
                    attemptNumber:
                      type: integer
                      description: "Le numéro de la tentative."
                    scorePercentage:
                      type: number
                      description: "Le pourcentage de réussite."
                      nullable: true
                    errorCount:
                      type: integer
                      description: "Le nombre de questions ayant été répondues de manière incorrecte."
                    totalQuestions:
                      type: integer
                      description: "Le nombre total de questions de la session."
                    startedAt:
                      type: string
                      format: date-time
                    completedAt:
                      type: string
                      format: date-time
                      nullable: true
                  required:
                    - sessionId
                    - attemptNumber
                    - errorCount
                    - totalQuestions
                    - startedAt
            required:
              - minScore
              - attempts
          description: "Un dictionnaire associant l'ID de chaque leçon à ses statistiques (score minimum et liste de ses tentatives)."
        mistakesEvolution:
          type: object
          properties:
            dataPoints:
              type: array
              items:
                type: object
                properties:
                  sessionIndex:
                    type: integer
                    description: "L'index de la session (commençant à 1), dans l'ordre chronologique."
                  faultCount:
                    type: integer
                    description: "Le nombre de fautes par règle (nombre de questionId distincts incorrects, groupés par ruleId)."
                  startedAt:
                    type: string
                    format: date-time
                    description: "La date de début de la session."
                required:
                  - sessionIndex
                  - faultCount
                  - startedAt
            improvement:
              type: object
              properties:
                percentage:
                  type: integer
                  description: "Le pourcentage d'amélioration entre la première et la dernière tentative. Positif = amélioration, négatif = régression."
                absoluteReduction:
                  type: integer
                  description: "Le nombre absolu de fautes en moins entre la première et la dernière tentative."
                firstFaultCount:
                  type: integer
                  description: "Le nombre de fautes de la première tentative."
                lastFaultCount:
                  type: integer
                  description: "Le nombre de fautes de la dernière tentative."
              required:
                - percentage
                - absoluteReduction
                - firstFaultCount
                - lastFaultCount
          required:
            - dataPoints
            - improvement
          description: "Évolution des fautes par règle à travers les sessions daily_lesson complétées, triées chronologiquement."
      required:
        - globalProgression
        - categories
        - rules
        - attemptsByLesson
        - mistakesEvolution
```
