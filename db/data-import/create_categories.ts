import mongoose from 'mongoose';
import dotenv from 'dotenv-safe';
import { CategoriesModel } from '../../src/models';

dotenv.config();

const categories = [
    "Conjugaison",
    "Grammaire",
    "Orthographe",
    "Accords",
    "Homophones",
    "Ponctuation",
    "Vocabulaire"
];

async function run() {
    console.log("=== Création des catégories ===");
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ Connecté à la base de données");

        for (const catName of categories) {
            const existing = await CategoriesModel.findOne({ name: catName });
            if (!existing) {
                await CategoriesModel.create({ name: catName });
                console.log(`✅ Catégorie "${catName}" créée.`);
            } else {
                console.log(`⚠️ Catégorie "${catName}" existe déjà.`);
            }
        }

        console.log("\n=== Terminé ===");
        process.exit(0);
    } catch (err) {
        console.error("Erreur critique:", err);
        process.exit(1);
    }
}

run();
