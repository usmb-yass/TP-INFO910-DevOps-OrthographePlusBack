module.exports = {
  up: async (db) => {
    // 1. Créer les nouvelles collections avec leurs validateurs
    await db.createCollection('countries', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            _id: { bsonType: "string" },
            name: { bsonType: "string" }
          }
        }
      }
    });

    await db.createCollection('grade-levels', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            level: { bsonType: "int" },
            grades: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  countryId: { bsonType: "string" },
                  name: { bsonType: "string" }
                }
              }
            }
          }
        }
      }
    });

    await db.createCollection('programs', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            gradeLevelId: { bsonType: "objectId" },
            lessons: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  lessonId: { bsonType: "objectId" },
                  order: { bsonType: "int" }
                }
              }
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });

    await db.createCollection('lessons', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            name: { bsonType: "string" },
            type: { bsonType: "string", enum: ["NORMAL", "REVIEW"] },
            rules: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  ruleId: { bsonType: "objectId" },
                  order: { bsonType: "int" }
                }
              }
            },
            minScore: { bsonType: "int" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });

    await db.createCollection('settings', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            _id: { bsonType: "string" },
            maxLessonsPerDay: { bsonType: "int" },
            numberOfQuestionsPerRule: { bsonType: "int" },
            dailyReset: {
              bsonType: "object",
              properties: {
                type: { bsonType: "string", enum: ["ROLLING_24H", "LOCAL_TIME"] },
                time: { bsonType: "string" }
              }
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });

    // Insertion des paramètres globaux par défaut
    const defaultSettings = await db.collection('settings').findOne({ _id: "global_limits" });
    if (!defaultSettings) {
      await db.collection('settings').insertOne({
        _id: "global_limits",
        maxLessonsPerDay: 2,
        numberOfQuestionsPerRule: 7,
        dailyReset: {
          type: "ROLLING_24H"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // 2. Création des index pertinents
    await db.collection('programs').createIndex({ gradeLevelId: 1 }, { unique: true, name: 'programs_gradeLevelId_unique' });
    await db.collection('grade-levels').createIndex({ level: 1 }, { unique: true, name: 'grade-levels_level_unique' });
  },

  down: async (db) => {
    // 1. Supprimer les collections créées
    const existingCollections = await db.listCollections().toArray();
    const collectionNames = new Set(existingCollections.map(c => c.name));

    if (collectionNames.has('countries')) await db.collection('countries').drop();
    if (collectionNames.has('grade-levels')) await db.collection('grade-levels').drop();
    if (collectionNames.has('programs')) await db.collection('programs').drop();
    if (collectionNames.has('lessons')) await db.collection('lessons').drop();
    if (collectionNames.has('settings')) await db.collection('settings').drop();
  }
};
