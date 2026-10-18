module.exports = {
  up: async (db) => {
    // 1. Créer la collection user-progresses avec validateurs
    await db.createCollection('user-progresses', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            userId: { bsonType: "objectId" },
            programId: { bsonType: "objectId" },
            currentLessonId: { bsonType: "objectId" },
            startedAt: { bsonType: "date" },
            completedAt: { bsonType: "date" },
            seenCategories: { 
              bsonType: "array", 
              items: { bsonType: "objectId" }
            },
            seenRules: { 
              bsonType: "array", 
              items: { bsonType: "objectId" } 
            }
          }
        }
      }
    });

    // 2. Créer la collection learning-sessions avec validateurs
    await db.createCollection('learning-sessions', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            userId: { bsonType: "objectId" },
            userProgressId: { bsonType: "objectId" },
            type: { bsonType: "string", enum: ["daily_lesson", "training"] },
            status: { bsonType: "string", enum: ["in_progress", "completed"] },
            lessonId: { bsonType: "objectId" },
            attemptNumber: { bsonType: "int" },
            scorePercentage: { bsonType: ["int", "double", "null"] },
            isPassed: { bsonType: ["bool", "null"] },
            currentQuestionIndex: { bsonType: "int" },
            questions: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  questionId: { bsonType: "objectId" },
                  userAnswer: { bsonType: ["string", "null"] },
                  isCorrect: { bsonType: ["bool", "null"] },
                  answeredAt: { bsonType: ["date", "null"] }
                }
              }
            },
            duration: { bsonType: "int" },
            startedAt: { bsonType: "date" },
            completedAt: { bsonType: "date" },
            xpGained: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  type: { bsonType: "string" },
                  amount: { bsonType: "int" }
                }
              }
            }
          }
        }
      }
    });

    // 3. Création des index
    await db.collection('user-progresses').createIndex({ userId: 1, programId: 1 });
    await db.collection('learning-sessions').createIndex({ userId: 1, status: 1 });
    await db.collection('learning-sessions').createIndex({ userId: 1, type: 1, lessonId: 1 });
    
    // Contrainte métier : Une seule session active par type
    await db.collection('learning-sessions').createIndex(
      { userId: 1, type: 1 },
      { unique: true, partialFilterExpression: { status: "in_progress" } }
    );
  },

  down: async (db) => {
    // 1. Supprimer les collections créées
    const existingCollections = await db.listCollections().toArray();
    const collectionNames = new Set(existingCollections.map(c => c.name));

    if (collectionNames.has('user-progresses')) await db.collection('user-progresses').drop();
    if (collectionNames.has('learning-sessions')) await db.collection('learning-sessions').drop();
  }
};
