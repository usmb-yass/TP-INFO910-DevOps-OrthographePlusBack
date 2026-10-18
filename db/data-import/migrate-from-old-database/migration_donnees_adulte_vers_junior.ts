import mongoose from 'mongoose';
import dotenv from 'dotenv-safe';
import path from 'node:path';
import { CategoriesModel, RulesModel, QuestionsModel } from '../../../src/models';
import { htmlToRichText } from './htmlToRichText';

// Charger les variables d'environnement
// 1. Depuis la racine (pour MONGODB_URI (la DB Junior))
dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
    example: path.resolve(__dirname, '../../../.env.example')
});
// 2. Depuis le dossier db/data-import (pour l'ancienne DB)
dotenv.config({
    path: path.resolve(__dirname, '../.env'),
    example: path.resolve(__dirname, '../.env.example')
});

// Construire l'URI de l'ancienne DB à partir des variables d'environnement
const {
    OLD_DB_USER,
    OLD_DB_PASSWORD,
    OLD_DB_HOST,
    OLD_DB_PORT,
    OLD_DB_AUTH_SOURCE,
} = process.env;

if (!OLD_DB_USER || !OLD_DB_PASSWORD || !OLD_DB_HOST || !OLD_DB_PORT || !OLD_DB_AUTH_SOURCE) {
    console.error("❌ Erreur: Les variables d'environnement pour l'ancienne DB (OLD_DB_USER, OLD_DB_PASSWORD, OLD_DB_HOST, OLD_DB_PORT, OLD_DB_AUTH_SOURCE) ne sont pas toutes définies.");
    process.exit(1);
}

const OLD_DB_URI = `mongodb://${OLD_DB_USER}:${OLD_DB_PASSWORD}@${OLD_DB_HOST}:${OLD_DB_PORT}/?authSource=${OLD_DB_AUTH_SOURCE}`;

async function run() {
    console.log("=== Lancement de la migration vers la base orthographe_plus_junior ===");
    try {
        // 1. Connexion à la nouvelle DB (orthographe_plus_junior) en utilisant l'URI du serveur
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ Connecté à la NOUVELLE base via Mongoose");

        // 2. Connexion à l'ancienne DB (orthographe-plus)
        const oldDb = await mongoose.createConnection(OLD_DB_URI).asPromise();
        const oldDatabase = oldDb.useDb('orthographe-plus'); // le nom de la base est 'orthographe-plus', il peut être modifié ici si besoin.
        console.log("✅ Connecté à l'ANCIENNE base (orthographe-plus) (provenant du dépôt github orthographe-plus-v2)");

        // Charger modèles anciens
        const OldRule = oldDatabase.model('OldRule', new mongoose.Schema({}, { strict: false }), 'rules');
        const OldQuestion = oldDatabase.model('OldQuestion', new mongoose.Schema({}, { strict: false }), 'questions');

        // 3. Charger catégories depuis la nouvelle base
        const categories = await CategoriesModel.find();
        const categoryMap = new Map();
        for (const cat of categories) {
            categoryMap.set(cat.name, cat._id.toString());
        }
        console.log(`📌 Catégories trouvées : ${categories.length}`);

        // 4. Migrer les Règles
        const oldRules = await OldRule.find();
        let migratedRulesCount = 0;
        let skippedRulesCount = 0;
        const ruleIdMap = new Map(); // Dictionnaire AncienID -> NouvelID

        console.log("\n--- Migration des Règles ---");
        for (const oldRule of oldRules) {
            const oldCategoryName = oldRule.category;
            
            if (!categoryMap.has(oldCategoryName)) {
                skippedRulesCount++;
                console.log(`⚠️ Règle ignorée "${oldRule.name}" : catégorie "${oldCategoryName}" inexistante.`);
                continue;
            }

            const categoryId = categoryMap.get(oldCategoryName);

            try {
                const newRule = await RulesModel.create({
                    name: oldRule.name,
                    data: {
                        explanation: htmlToRichText(oldRule.description),
                        summary: [],
                        example: [],
                        tip: []
                    },
                    categoryId: categoryId
                });
                ruleIdMap.set(oldRule._id.toString(), newRule._id.toString());
                migratedRulesCount++;
            } catch (err: any) {
                console.error(`Erreur création règle "${oldRule.name}":`, err.message);
            }
        }
        console.log(`✅ Règles migrées: ${migratedRulesCount}`);
        console.log(`❌ Règles ignorées: ${skippedRulesCount}`);

        // 5. Migrer les Questions
        const oldQuestions = await OldQuestion.find({ type: { $in: ['UCQ', 'AUDIO'] } });
        let migratedQuestionsCount = 0;
        let skippedQuestionsCount = 0;

        console.log("\n--- Migration des Questions ---");
        for (const oldQuestion of oldQuestions) {
            const oldRuleId = oldQuestion.rule ? oldQuestion.rule.toString() : null;

            if (!oldRuleId) {
                skippedQuestionsCount++;
                console.log(`⚠️ Question ignorée (Ancien ID: ${oldQuestion._id}) : Aucune règle associée.`);
                continue;
            }

            if (!ruleIdMap.has(oldRuleId)) {
                skippedQuestionsCount++;
                console.log(`⚠️ Question ignorée (Ancien ID: ${oldQuestion._id}) : La règle associée (Ancien ID: ${oldRuleId}) n'a pas pu être migrée ou a été ignorée ou est liée à une catégorie qui n'a pas été migrée.`);
                continue;
            }

            const newRuleId = ruleIdMap.get(oldRuleId);
            let questionType;
            let questionData: any = {};

            if (oldQuestion.type === 'UCQ') {
                questionType = 'QCM';
                const options = oldQuestion.content?.options || [];
                const mappedOptions = options.map((opt: string, idx: number) => ({
                    id: `opt_${idx}`,
                    text: opt
                }));
                const validIndex = oldQuestion.content?.valid;
                const correctOptionId = (validIndex !== undefined && validIndex !== null && mappedOptions[validIndex]) ? mappedOptions[validIndex].id : undefined;

                if (!correctOptionId) {
                    skippedQuestionsCount++;
                    console.log(`⚠️ Question ignorée (Ancien ID: ${oldQuestion._id}) : La réponse ne fait pas partie des options proposées.`);
                    continue;
                }

                questionData = {
                    sentence: oldQuestion.content?.sentence || '',
                    options: mappedOptions,
                    correctOption: correctOptionId
                };
            } else if (oldQuestion.type === 'AUDIO') {
                questionType = 'TROU';
                const answerText = oldQuestion.content?.valid;
                questionData = {
                    sentence: oldQuestion.content?.sentence || '',
                    answer: answerText ? [answerText] : []
                };
                
                const audioFileName = oldQuestion.content?.audio;
                if (audioFileName) {
                    questionData.audioUrl = `${audioFileName}`;
                }
            }

            try {
                await QuestionsModel.create({
                    ruleId: newRuleId,
                    type: questionType,
                    data: questionData
                });
                migratedQuestionsCount++;
            } catch (err: any) {
                console.error(`Erreur création question (ancienne ID: ${oldQuestion._id}):`, err.message);
            }
        }

        console.log(`✅ Questions migrées: ${migratedQuestionsCount}`);
        console.log(`❌ Questions ignorées (Règle orpheline / ignorée): ${skippedQuestionsCount}`);

        // Nettoyage final
        await oldDb.close();
        await mongoose.disconnect();
        console.log("\n=== Migration terminée ===");
        process.exit(0);

    } catch (err) {
        console.error("Erreur critique:", err);
        process.exit(1);
    }
}

run();
