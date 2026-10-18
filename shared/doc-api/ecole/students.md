# Students API (École)

OpenAPI description des endpoints de gestion des élèves pour les administrateurs d'école sous `/school-admin/students`.

---

```yaml
paths:
  /students:
    get:
      summary: Lister les élèves et les invitations
      description: Récupère la liste des élèves actifs et des invitations en attente pour l'école de l'administrateur connecté.
      operationId: GetSchoolStudents
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des élèves et invitations.
          content:
            application/json:
              schema:
                type: object
                properties:
                  activeStudents:
                    type: array
                    items:
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
                        classId:
                          type: string
                  invitations:
                    type: array
                    items:
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
                        classId:
                          type: string
                        status:
                          type: string
                        expiresAt:
                          type: string
                          format: date-time
        '403':
          description: Accès interdit.
        '500':
          description: Erreur serveur.

  /students/invite:
    post:
      summary: Inviter un élève
      description: Crée une invitation pour un nouvel élève à rejoindre une classe de l'école.
      operationId: InviteSchoolStudent
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/invite_student_request'
      responses:
        '201':
          description: Élève invité avec succès.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  invitation:
                    type: object
                  invitationToken:
                    type: string
        '400':
          description: Données invalides.
        '403':
          description: Accès interdit ou Limite de licences atteinte pour cette école.
        '409':
          description: Cet email est déjà utilisé par un autre compte ou une invitation est déjà en attente pour cet email.
        '500':
          description: Erreur serveur.

  /students/invitations/{id}:
    delete:
      summary: Révoquer une invitation
      description: Révoque et supprime une invitation d'élève en attente.
      operationId: RevokeStudentInvitation
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: ID de l'invitation.
      responses:
        '200':
          description: Invitation révoquée.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Invitation révoquée"
        '403':
          description: Accès interdit.
        '404':
          description: Invitation introuvable ou déjà traitée.
        '500':
          description: Erreur serveur.

components:
  schemas:
    invite_student_request:
      type: object
      required:
        - email
        - firstName
        - lastName
        - classId
      properties:
        email:
          type: string
          format: email
        firstName:
          type: string
          minLength: 2
        lastName:
          type: string
          minLength: 2
        classId:
          type: string
          minLength: 24
          maxLength: 24
          description: "ID de la classe de l'élève"
```
