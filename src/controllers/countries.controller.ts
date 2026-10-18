import { Request, Response } from 'express';
import { countriesService } from '../services/countries.service';
import { countrySchema } from '#shared/schemas/CountrySchema';

export const countriesController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const parsed = countrySchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }
            const newCountry = await countriesService.createCountry(parsed.data);
            res.status(201).json({ message: 'Pays créé avec succès', country: newCountry });
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(409).json({ error: 'Ce code pays existe déjà' });
                return;
            }
            console.error('Erreur lors de la création du pays:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const countries = await countriesService.getAllCountries();
            res.status(200).json(countries);
        } catch (error) {
            console.error('Erreur lors de la récupération des pays:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const country = await countriesService.getCountryById(id);
            if (!country) {
                res.status(404).json({ error: 'Pays non trouvé' });
                return;
            }
            res.status(200).json(country);
        } catch (error) {
            console.error('Erreur lors de la récupération du pays:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const parsed = countrySchema.partial().safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }
            const updatedCountry = await countriesService.updateCountry(id, parsed.data);
            if (!updatedCountry) {
                res.status(404).json({ error: 'Pays non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Pays mis à jour avec succès', country: updatedCountry });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du pays:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const deletedCountry = await countriesService.deleteCountry(id);
            if (!deletedCountry) {
                res.status(404).json({ error: 'Pays non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Pays supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du pays:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
