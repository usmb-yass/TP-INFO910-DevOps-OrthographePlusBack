const collectionsSchemas = {
  classes: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        name: { bsonType: "string" },
        schoolId: { bsonType: "objectId" },
        gradeLevelId: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
      }
    }
  },
  "student-invitations": {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        email: { bsonType: "string" },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        schoolId: { bsonType: "objectId" },
        classId: { bsonType: "objectId" },
        token: { bsonType: "string" },
        status: { bsonType: "string" },
        invitedByUserId: { bsonType: "objectId" },
        acceptedByUserId: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        acceptedAt: { bsonType: "date" },
        expiresAt: { bsonType: "date" }
      }
    }
  }
};

const collections = Object.keys(collectionsSchemas);

async function ensureCollection(db, collectionName, validatorSchema) {
  const existingCollections = await db.listCollections({ name: collectionName }).toArray();
  const collectionNames = new Set(existingCollections.map(c => c.name));

  if (!collectionNames.has(collectionName)) {
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
  async up(db) {
    for (const collectionName of collections) {
      await ensureCollection(db, collectionName, collectionsSchemas[collectionName]);
    }

    // Indexes pour `classes`
    const classesCollection = db.collection('classes');
    await ensureIndex(classesCollection, { schoolId: 1 }, { name: 'classes_schoolId' });
    await ensureIndex(classesCollection, { gradeLevelId: 1 }, { name: 'classes_gradeLevelId' });

    // Indexes pour `student-invitations`
    const studentInvitationsCollection = db.collection('student-invitations');
    await ensureIndex(studentInvitationsCollection, { schoolId: 1 }, { name: 'student_invitations_schoolId' });
    await ensureIndex(studentInvitationsCollection, { classId: 1 }, { name: 'student_invitations_classId' });
    await ensureIndex(studentInvitationsCollection, { email: 1 }, { name: 'student_invitations_email' });
    await ensureIndex(studentInvitationsCollection, { token: 1 }, { unique: true, name: 'student_invitations_token_unique', sparse: true });
  },

  async down(db) {
    const existingCollections = await db.listCollections().toArray();
    const collectionNames = new Set(existingCollections.map(c => c.name));

    if (collectionNames.has('student-invitations')) {
      await db.collection('student-invitations').drop();
    }
    if (collectionNames.has('classes')) {
      await db.collection('classes').drop();
    }
  }
};
