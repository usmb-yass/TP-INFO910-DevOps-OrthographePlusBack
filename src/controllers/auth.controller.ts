import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import UserModel from '../models/Users';
import { registerSchema } from '#shared/schemas/Auth/RegisterSchema';
import { loginSchema } from '#shared/schemas/Auth/LoginSchema';
import { registerSchoolAdminSchema } from '#shared/schemas/Auth/RegisterSchoolAdminSchema';
import { userProgressesService } from '../services/user-progresses.service';
import { SchoolInvitationModel, StudentInvitationModel } from '../models';
import { Role } from '#shared/enums/Role';

export const authController = {
    async register(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validation des données
            const parsed = registerSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const { email, password, firstName, lastName, countryId, gradeLevelId, timezone } = parsed.data;

            // 2. Vérification si l'utilisateur existe
            const exists = await AuthService.emailExists(email);
            if (exists) {
                res.status(409).json({ error: 'Cet email est déjà utilisé' });
                return;
            }

            // 3. Hashage du mot de passe
            const { hash, salt } = await AuthService.hashPassword(password);

            // 3.5. Vérification d'une invitation école pour cet élève
            const invitation = await StudentInvitationModel.findOne({ email, status: 'PENDING' });

            const userPayload: any = {
                email,
                passwordHash: hash,
                saltHash: salt,
                firstName,
                lastName,
                countryId,
                gradeLevelId,
                timezone,
                role: 'student'
            };

            if (invitation) {
                userPayload.isSchoolLicense = true;
                userPayload.schoolId = invitation.schoolId;
                if (invitation.classId) {
                    userPayload.classId = invitation.classId;
                }
            }

            // 4. Création de l'utilisateur
            const newUser = await UserModel.create(userPayload);

            if (invitation) {
                invitation.status = 'ACCEPTED';
                await invitation.save();
            }

            // 5. Génération du token
            const token = AuthService.generateToken(newUser._id.toString());

            // 6. Réponse (sans renvoyer les hash)
            const userResponse = newUser.toObject() as any;
            delete userResponse.passwordHash;
            delete userResponse.saltHash;

            res.status(201).json({
                message: 'Inscription réussie',
                token,
                user: userResponse
            });

        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    async registerSchoolAdmin(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validation des données
            const parsed = registerSchoolAdminSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const { token, password, firstName, lastName } = parsed.data;

            // 2. Vérification de l'invitation
            const invitation = await SchoolInvitationModel.findOne({ token, status: 'PENDING' });
            if (!invitation || (invitation.expiresAt && invitation.expiresAt < new Date())) {
                res.status(400).json({ error: 'Invitation invalide ou expirée' });
                return;
            }

            // 3. Vérification si l'utilisateur existe déjà
            const exists = await AuthService.emailExists(invitation.email);
            if (exists) {
                res.status(409).json({ error: 'Un compte existe déjà pour cet email' });
                return;
            }

            // 4. Hashage du mot de passe
            const { hash, salt } = await AuthService.hashPassword(password);

            // 5. Création de l'utilisateur
            const newUser = await UserModel.create({
                email: invitation.email,
                passwordHash: hash,
                saltHash: salt,
                firstName,
                lastName,
                role: Role.SCHOOL_ADMIN,
                schoolId: invitation.schoolId
            });
            await newUser.populate('schoolId');

            // 6. Mise à jour de l'invitation
            invitation.status = 'ACCEPTED';
            invitation.userId = newUser._id;
            invitation.acceptedAt = new Date();
            await invitation.save();

            // 7. Génération du token JWT pour connexion automatique
            const jwtToken = AuthService.generateToken(newUser._id.toString());

            const userResponse = newUser.toObject() as any;
            delete userResponse.passwordHash;
            delete userResponse.saltHash;

            res.status(201).json({
                message: 'Inscription administrateur école réussie',
                token: jwtToken,
                user: userResponse
            });

        } catch (error) {
            console.error('Erreur lors de l\'inscription school-admin :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    async login(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validation des données
            const parsed = loginSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const { email, password } = parsed.data;

            // 2. Recherche de l'utilisateur (avec le hash)
            const user = await UserModel.findOne({ email }).select('+passwordHash');
            if (!user) {
                res.status(401).json({ error: 'Email ou mot de passe incorrect' });
                return;
            }

            // 3. Vérification du mot de passe
            const isValid = await AuthService.verifyPassword(password, user.passwordHash);
            if (!isValid) {
                res.status(401).json({ error: 'Email ou mot de passe incorrect' });
                return;
            }

            // 4. Génération du token
            const token = AuthService.generateToken(user._id.toString());

            // 5. Réponse
            const userResponse = user.toObject() as any;
            delete userResponse.passwordHash;
            delete userResponse.saltHash;

            res.status(200).json({
                message: 'Connexion réussie',
                token,
                user: userResponse
            });

        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    async adminLogin(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validation des données
            const parsed = loginSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const { email, password } = parsed.data;

            // 2. Vérification des identifiants
            const validationResult = await AuthService.validateAdmin(email, password);
            if ('error' in validationResult) {
                res.status(validationResult.status).json({ error: validationResult.error });
                return;
            }

            const user = validationResult.user;

            // 3. Génération du token
            const token = AuthService.generateToken(user._id.toString());

            // 4. Réponse
            const userResponse = user.toObject() as any;
            delete userResponse.passwordHash;
            delete userResponse.saltHash;

            res.status(200).json({
                message: 'Connexion administrateur réussie',
                token,
                user: userResponse
            });

        } catch (error) {
            console.error('Erreur lors de la connexion admin :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    async adminVerify(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validation des données
            const parsed = loginSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json(false);
                return;
            }

            const { email, password } = parsed.data;

            // 2. Vérification des identifiants
            const validationResult = await AuthService.validateAdmin(email, password);
            if ('error' in validationResult) {
                res.status(200).json(false);
                return;
            }

            // 3. Réponse
            res.status(200).json(true);
        } catch (error) {
            console.error('Erreur lors de la vérification admin :', error);
            res.status(500).json(false);
        }
    },

    async getMe(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            await userProgressesService.checkAndResetStreak(userId);
            await userProgressesService.syncDailyLessonsLimit(userId);

            const user = await UserModel.findById(userId)
                .populate('countryId')
                .populate('gradeLevelId');
            if (!user) {
                res.status(404).json({ error: 'Utilisateur introuvable' });
                return;
            }

            const userResponse = user.toObject() as any;
            delete userResponse.passwordHash;
            delete userResponse.saltHash;
            delete userResponse.passwordMetadata;

            if (userResponse.countryId) {
                userResponse.country = userResponse.countryId;
                delete userResponse.countryId;
            }
            if (userResponse.gradeLevelId) {
                if (userResponse.country && userResponse.gradeLevelId.grades) {
                    const matchingGrade = userResponse.gradeLevelId.grades.find(
                        (g: any) => g.countryId === userResponse.country._id
                    );
                    userResponse.gradeLevelId.grade = matchingGrade;
                    delete userResponse.gradeLevelId.grades;
                }
                userResponse.gradeLevel = userResponse.gradeLevelId;
                delete userResponse.gradeLevelId;
            }

            res.status(200).json(userResponse);
        } catch (error) {
            console.error('Erreur lors de la récupération du profil :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }
};
