const collectionsSchemas = {
  users: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        email: { bsonType: "string" },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        role: { bsonType: "string" },
        profilePicture: { bsonType: "string" },
        schoolId: { bsonType: "objectId" },
        classId: { bsonType: "objectId" },
        isSchoolLicense: { bsonType: "bool" },
        countryId: { bsonType: "string" },
        gradeLevelId: { bsonType: "objectId" },
        timezone: { bsonType: "string" },
        currentProgressId: { bsonType: "objectId" },
        progressSummary: {
          bsonType: "object",
          properties: {
            streak: { bsonType: "int" },
            lastActivityAt: { bsonType: "date" },
            xp: { bsonType: "int" },
            gamificationLevel: { bsonType: "int" },
            dailyLessons: {
              bsonType: "object",
              properties: {
                count: { bsonType: "int" },
                periodStart: { bsonType: "date" }
              }
            }
          }
        },
        totalConnectionDuration: { bsonType: "int" },
        passwordHash: { bsonType: "string" },
        saltHash: { bsonType: "string" },
        passwordMetadata: {
          bsonType: "object",
          properties: {
            resetPasswordToken: { bsonType: "string" },
            resetPasswordExpires: { bsonType: "date" }
          }
        },
        createdAt: { bsonType: "date" }
      }
    }
  },
  subscriptions: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        userId: { bsonType: "objectId" },
        plan: { bsonType: "string" },
        status: { bsonType: "string" },
        startedAt: { bsonType: "date" },
        expiresAt: { bsonType: "date" },
        cancelAtPeriodEnd: { bsonType: "bool" }
      }
    }
  },
  schools: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        name: { bsonType: "string" },
        country: { bsonType: "string" },
        schoolAdminId: { bsonType: "objectId" },
        licences: {
          bsonType: "object",
          properties: {
            totalSlots: { bsonType: "int" },
            slotsUsed: { bsonType: "int" }
          }
        }
      }
    }
  },
  "school-invitations": {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        schoolId: { bsonType: "objectId" },
        invitedByUserId: { bsonType: "objectId" },
        email: { bsonType: "string" },
        role: { bsonType: "string" },
        status: { bsonType: "string" },
        token: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        expiresAt: { bsonType: "date" },
        acceptedAt: { bsonType: "date" },
        userId: { bsonType: "objectId" }
      }
    }
  },
  "activity-logs": {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        userId: { bsonType: "objectId" },
        schoolId: { bsonType: "objectId" },
        type: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        details: { bsonType: "string" }
      }
    }
  },
  categories: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        name: { bsonType: "string" }
      }
    }
  },
  rules: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        name: { bsonType: "string" },
        data: { bsonType: "object" },
        categoryId: { bsonType: "objectId" }
      }
    }
  },
  questions: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        ruleId: { bsonType: "objectId" },
        type: { bsonType: "string" },
        isDisabled: { bsonType: "bool" },
        data: {
          bsonType: "object",
          properties: {
            sentence: { bsonType: "string" },
            audioUrl: { bsonType: "string" },
            options: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  id: { bsonType: "string" },
                  text: { bsonType: "string" }
                }
              }
            },
            correctOption: { bsonType: "string" },
            answer: {
              bsonType: "array",
              items: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
};

const collections = Object.keys(collectionsSchemas);

async function ensureCollection(db, collectionName, validatorSchema) {
  const existingCollections = await db.listCollections({ name: collectionName }).toArray();

  if (existingCollections.length === 0) {
    if (validatorSchema) {
      await db.createCollection(collectionName, { validator: validatorSchema });
    } else {
      await db.createCollection(collectionName);
    }
  } else if (validatorSchema) {
    await db.command({ collMod: collectionName, validator: validatorSchema });
  }
}

async function ensureIndex(collection, indexSpec, options) {
  await collection.createIndex(indexSpec, options);
}

module.exports = {
  up: async (db) => {
    for (const collectionName of collections) {
      await ensureCollection(db, collectionName, collectionsSchemas[collectionName]);
    }

    // Indexes based on relationships and usage
    await ensureIndex(db.collection('users'), { email: 1 }, { unique: true, name: 'users_email_unique' });
    await ensureIndex(db.collection('users'), { schoolId: 1 }, { name: 'users_schoolId' });
    await ensureIndex(db.collection('users'), { classId: 1 }, { name: 'users_classId' });
    await ensureIndex(db.collection('users'), { isSchoolLicense: 1 }, { name: 'users_isSchoolLicense' });
    
    await ensureIndex(db.collection('schools'), { name: 1 }, { name: 'schools_name' });
    await ensureIndex(db.collection('schools'), { schoolAdminId: 1 }, { name: 'schools_schoolAdminId' });
    
    await ensureIndex(db.collection('school-invitations'), { schoolId: 1 }, { name: 'school_invitations_schoolId' });
    await ensureIndex(db.collection('school-invitations'), { token: 1 }, { unique: true, name: 'school_invitations_token_unique', sparse: true });
    
    await ensureIndex(db.collection('activity-logs'), { userId: 1 }, { name: 'activity_logs_userId' });
    await ensureIndex(db.collection('activity-logs'), { schoolId: 1 }, { name: 'activity_logs_schoolId' });
    
    await ensureIndex(db.collection('categories'), { name: 1 }, { unique: true, name: 'categories_name_unique' });
    
    await ensureIndex(db.collection('rules'), { name: 1 }, { unique: true, name: 'rules_name_unique' });
    await ensureIndex(db.collection('rules'), { categoryId: 1 }, { name: 'rules_categoryId' });
    
    await ensureIndex(db.collection('questions'), { ruleId: 1 }, { name: 'questions_ruleId' });
  },
  down: async (db) => {
    for (const collectionName of collections.slice().reverse()) {
      const existingCollections = await db.listCollections({ name: collectionName }).toArray();

      if (existingCollections.length > 0) {
        await db.collection(collectionName).drop();
      }
    }
  },
};