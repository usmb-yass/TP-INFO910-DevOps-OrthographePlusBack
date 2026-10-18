# Routes API

Les routes sont organisées par accès :
- Public : ouvertes à tous
- User : requiert un token valide au minimum (un admin pourra y accéder)
- Admin : requiert un token d'administrateur
- École : requiert un token d'administrateur d'école

## Public

### General
- [GET] /health-check


### Fichiers
- [GET] /audio/*
- [GET] /profile-picture/*

### Auth
- [POST] /v1/auth/register
- [POST] /v1/auth/login 
- [POST] /v1/auth/admin/login
- [POST] /v1/auth/admin/verify
- [POST] /v1/auth/school-admin/register

### Countries
- [GET] /v1/countries

### Grade Levels
- [GET] /v1/grade-levels


## User

### Auth
- [GET] /v1/auth/me

### Countries
- [GET] /v1/countries

### Grade Levels
- [GET] /v1/grade-levels

### Learning Sessions
- [POST] /v1/learning-sessions/start
- [POST] /v1/learning-sessions/:id/submit-answer
- [POST] /v1/learning-sessions/:id/finish
- [DELETE] /v1/learning-sessions/training

### Stats
- [GET] /v1/stats/my-stats

### User Progresses
- [GET] /v1/user-progresses/my-progress
- [GET] /v1/user-progresses/my-categories
- [GET] /v1/user-progresses/my-rules

### Users
- [POST] /v1/users/upload-profile-picture
- [PATCH] /v1/users/connection-duration


## Admin

### Categories
- [GET] /v1/admin/categories
> [!NOTE]
> La route suivante n'est actuellement pas utilisée dans le projet.
- [GET] /v1/admin/categories/:id
- [POST] /v1/admin/categories
- [PUT] /v1/admin/categories/:id
- [DELETE] /v1/admin/categories/:id

### Countries
- [GET] /v1/countries
- [GET] /v1/admin/countries/:id
- [POST] /v1/admin/countries
- [PUT] /v1/admin/countries/:id
- [DELETE] /v1/admin/countries/:id

### Grade Levels
- [GET] /v1/grade-levels
- [GET] /v1/admin/grade-levels/:id
- [POST] /v1/admin/grade-levels
- [PUT] /v1/admin/grade-levels/:id
- [DELETE] /v1/admin/grade-levels/:id

### Lessons
- [GET] /v1/admin/lessons
- [GET] /v1/admin/lessons/:id
- [POST] /v1/admin/lessons
- [PUT] /v1/admin/lessons/:id
- [DELETE] /v1/admin/lessons/:id

### Programs
- [GET] /v1/admin/programs
- [GET] /v1/admin/programs/:id
- [POST] /v1/admin/programs
- [PUT] /v1/admin/programs/:id
- [DELETE] /v1/admin/programs/:id

### Questions
- [GET] /v1/admin/questions
- [GET] /v1/admin/questions/:id
- [POST] /v1/admin/questions
- [POST] /v1/admin/questions/upload-audio
- [PUT] /v1/admin/questions/:id
- [DELETE] /v1/admin/questions/:id

### Rules
- [GET] /v1/admin/rules
- [GET] /v1/admin/rules/:id
- [POST] /v1/admin/rules
- [PUT] /v1/admin/rules/:id
- [DELETE] /v1/admin/rules/:id

### Schools
- [GET] /v1/admin/schools
- [POST] /v1/admin/schools

### Settings
- [GET] /v1/admin/settings
> [!NOTE]
> La route suivante n'est actuellement pas utilisée dans le projet.
- [GET] /v1/admin/settings/:id
- [PUT] /v1/admin/settings/:id

### Users
- [GET] /v1/admin/users


## École

### Classes
- [GET] /v1/school-admin/classes
- [POST] /v1/school-admin/classes
- [PUT] /v1/school-admin/classes/:id
- [DELETE] /v1/school-admin/classes/:id

### Profile
- [GET] /v1/school-admin/profile/me

### Students
- [GET] /v1/school-admin/students
- [POST] /v1/school-admin/students/invite
- [DELETE] /v1/school-admin/students/invitations/:id
