import mongoose from 'mongoose';
import dotenv from 'dotenv-safe';
import fs from 'node:fs';
import path from 'node:path';
import { CountriesModel, GradeLevelsModel } from '../../src/models';

dotenv.config();

function cleanGradeName(raw: string): string {
    let cleaned = raw.replace(/[\u{1F000}-\u{1FAFF}]/gu, '');
    if (/[-–—]/.test(cleaned)) {
        cleaned = cleaned.split(/[-–—]/).pop() || cleaned;
    }
    return cleaned.trim();
}


function splitCsvString(str: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

async function run() {
    console.log("=== Création des pays et des équivalences de classes ===");
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ Connecté à la base de données");

        const csvPath = path.join(__dirname, 'équivalences entre classes de 12 pays.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const lines = csvContent.split(/\r?\n/);

        const countriesData = [
            { name: "France", _id: "FR" },
            { name: "Belgique", _id: "BE" },
            { name: "Suisse romande", _id: "CH" },
            { name: "Canada / Québec", _id: "CA" },
            { name: "Luxembourg", _id: "LU" },
            { name: "Maroc", _id: "MA" },
            { name: "Algérie", _id: "DZ" },
            { name: "Tunisie", _id: "TN" },
            { name: "Côte d’Ivoire", _id: "CI" },
            { name: "Sénégal", _id: "SN" },
            { name: "Cameroun", _id: "CM" },
            { name: "Liban", _id: "LB" }
        ];

        // Insert or update countries
        console.log("\n--- Insertion des pays ---");
        for (const c of countriesData) {
            const existing = await CountriesModel.findById(c._id);
            if (!existing) {
                await CountriesModel.create(c);
                console.log(`✅ Pays "${c.name}" (${c._id}) créé.`);
            } else {
                existing.name = c.name;
                await existing.save();
                console.log(`⚠️ Pays "${c.name}" mis à jour.`);
            }
        }

        console.log("\n--- Insertion des équivalences de classes ---");
        let currentLevel = 1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const row = splitCsvString(line);
            
            // Skip headers or empty rows
            if (row.length < 2) continue;
            const col1 = row[1].trim();
            if (!col1 || col1.includes('CATÉGORIE') || col1.toUpperCase() === 'FRANCE' || col1 === 'Niveau OP France') {
                continue;
            }

            // We found a grade row
            const grades = [];
            for (let cIndex = 0; cIndex < countriesData.length; cIndex++) {
                const cellIndex = cIndex + 1; // country data starts at column 1
                if (cellIndex < row.length) {
                    let cellValue = row[cellIndex].trim();
                    cellValue = cellValue.replace(/^"|"$/g, '').trim();
                    if (cellValue) {
                        grades.push({
                            countryId: countriesData[cIndex]._id,
                            name: cleanGradeName(cellValue)
                        });
                    }
                }
            }

            const existingLevel = await GradeLevelsModel.findOne({ level: currentLevel });
            if (!existingLevel) {
                await GradeLevelsModel.create({
                    level: currentLevel,
                    grades: grades
                });
                console.log(`✅ Niveau ${currentLevel} créé avec ${grades.length} équivalences.`);
            } else {
                // Mettre à jour les équivalences si le niveau existe
                existingLevel.grades = grades;
                await existingLevel.save();
                console.log(`🔄 Niveau ${currentLevel} mis à jour avec ${grades.length} équivalences.`);
            }

            currentLevel++;
        }

        console.log("\n=== Terminé ===");
        process.exit(0);
    } catch (err) {
        console.error("Erreur critique:", err);
        process.exit(1);
    }
}

run();
