import { Request, Response } from 'express';
import { rulesService } from '../services/rules.service';
import { ruleSchema } from '../schemas/Rule/RuleSchema';

export const rulesController = {
    // Créer une nouvelle règle
    async create(req: Request, res: Response): Promise<void> {
        try {
            const parsed = ruleSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const newRule = await rulesService.createRule(parsed.data);
            res.status(201).json({ message: 'Règle créée avec succès', rule: newRule });
        } catch (error: any) {
            if (error.message === 'CATEGORY_NOT_FOUND') {
                res.status(400).json({ error: 'La catégorie spécifiée n\'existe pas' });
                return;
            }
            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({ error: 'Une règle avec ce nom existe déjà' });
                return;
            }
            console.error('Erreur lors de la création de la règle:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire toutes les règles
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
            const rules = await rulesService.getAllRules(limit);
            res.status(200).json(rules);
        } catch (error) {
            console.error('Erreur lors de la récupération des règles:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire une règle par son ID
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const rule = await rulesService.getRuleById(id);

            if (!rule) {
                res.status(404).json({ error: 'Règle non trouvée' });
                return;
            }

            res.status(200).json(rule);
        } catch (error) {
            console.error('Erreur lors de la récupération de la règle:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Mettre à jour une règle
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const parsed = ruleSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const updatedRule = await rulesService.updateRule(id, parsed.data);
            
            if (!updatedRule) {
                res.status(404).json({ error: 'Règle non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Règle mise à jour avec succès', rule: updatedRule });
        } catch (error: any) {
            if (error.message === 'CATEGORY_NOT_FOUND') {
                res.status(400).json({ error: 'La catégorie spécifiée n\'existe pas' });
                return;
            }
            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({ error: 'Une règle avec ce nom existe déjà' });
                return;
            }
            console.error('Erreur lors de la mise à jour de la règle:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Supprimer une règle
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const deletedRule = await rulesService.deleteRule(id);

            if (!deletedRule) {
                res.status(404).json({ error: 'Règle non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Règle supprimée avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de la règle:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
