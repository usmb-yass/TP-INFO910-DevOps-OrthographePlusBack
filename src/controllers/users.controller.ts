import { Request, Response } from 'express';
import { usersService } from '../services/users.service';
import { updateConnectionDurationSchema } from '#shared/schemas/User/UpdateConnectionDurationSchema';

export const usersController = {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await usersService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async uploadProfilePicture(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'Aucun fichier image fourni' });
                return;
            }

            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            const updatedUser = await usersService.updateProfilePicture(userId, req.file.filename);

            if (!updatedUser) {
                res.status(404).json({ error: 'Utilisateur introuvable' });
                return;
            }

            res.status(200).json({ filename: req.file.filename });
        } catch (error) {
            console.error('Erreur lors de l\'upload de la photo de profil:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async updateConnectionDuration(req: Request, res: Response): Promise<void> {
        try {
            const parsed = updateConnectionDurationSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            const updatedUser = await usersService.incrementConnectionDuration(userId, parsed.data.duration);
            if (!updatedUser) {
                res.status(404).json({ error: 'Utilisateur introuvable' });
                return;
            }

            res.status(200).json({ totalConnectionDuration: updatedUser.totalConnectionDuration });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la durée de connexion:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
