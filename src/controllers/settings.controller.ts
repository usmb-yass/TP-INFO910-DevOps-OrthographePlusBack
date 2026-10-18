import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';
import { settingSchema } from '#shared/schemas/SettingSchema';

export const settingsController = {
    // Lire tous les paramètres
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const settings = await settingsService.getAllSettings();
            res.status(200).json(settings);
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire un paramètre par son ID
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const setting = await settingsService.getSettingById(id);

            if (!setting) {
                res.status(404).json({ error: 'Paramètre non trouvé' });
                return;
            }

            res.status(200).json(setting);
        } catch (error) {
            console.error('Erreur lors de la récupération du paramètre:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Mettre à jour un paramètre
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const parsed = settingSchema.safeParse(req.body);
            
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const updatedSetting = await settingsService.updateSetting(id, parsed.data);
            
            if (!updatedSetting) {
                res.status(404).json({ error: 'Paramètre non trouvé' });
                return;
            }

            res.status(200).json({ message: 'Paramètre mis à jour avec succès', setting: updatedSetting });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du paramètre:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
