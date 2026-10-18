import { Request, Response } from 'express';
import { schoolsService } from '../services/schools.service';
import { createSchoolSchema } from '#shared/schemas/School/CreateSchoolSchema';

export const schoolsController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const parsed = createSchoolSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const adminId = req.user?.id;
            if (!adminId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            const result = await schoolsService.createSchool(parsed.data, adminId);
            res.status(201).json({ 
                message: 'École créée avec succès. Une invitation a été générée.', 
                school: result.school,
                invitationToken: result.invitationToken // Pour faciliter les tests
            });
        } catch (error: any) {
            if (error.message === 'EMAIL_ALREADY_USED') {
                res.status(409).json({ error: 'Cet email est déjà utilisé par une autre école' });
                return;
            }
            console.error('Erreur lors de la création de l\'école:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const schools = await schoolsService.getAllSchools();
            res.status(200).json(schools);
        } catch (error) {
            console.error('Erreur lors de la récupération des écoles:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const schoolId = req.user?.schoolId;
            if (!schoolId) {
                res.status(403).json({ error: 'Aucune école associée à votre profil' });
                return;
            }
            const school = await schoolsService.getSchoolById(schoolId.toString());
            if (!school) {
                res.status(404).json({ error: 'École non trouvée' });
                return;
            }
            res.status(200).json(school);
        } catch (error) {
            console.error('Erreur getProfile:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
