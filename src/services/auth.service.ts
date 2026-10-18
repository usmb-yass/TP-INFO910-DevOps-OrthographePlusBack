import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models';

export class AuthService {
    /**
     * Hache un mot de passe en utilisant bcrypt avec un coût de 12.
     * @param password Le mot de passe en clair
     * @returns Un objet contenant le hash et le salt
     */
    static async hashPassword(password: string): Promise<{ hash: string, salt: string }> {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return { hash, salt };
    }

    /**
     * Vérifie si le mot de passe en clair correspond au hash
     * @param password Le mot de passe en clair
     * @param hash Le hash stocké en base de données
     */
    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Génère un token JWT pour l'utilisateur
     * @param userId L'ID de l'utilisateur
     * @returns Le token JWT
     */
    static generateToken(userId: string): string {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET n\'est pas défini');
        }
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '7d' // Le token expire dans 7 jours
        });
    }

    /**
     * Vérifie si un email existe déjà en base
     */
    static async emailExists(email: string): Promise<boolean> {
        const count = await UserModel.countDocuments({ email });
        return count > 0;
    }

    /**
     * Valide les identifiants d'un administrateur
     */
    static async validateAdmin(email: string, password: string): Promise<{ user: any } | { error: string, status: number }> {
        // 1. Recherche de l'utilisateur (avec le hash)
        const user = await UserModel.findOne({ email }).select('+passwordHash').populate('schoolId');
        if (!user) {
            return { error: 'Email ou mot de passe incorrect', status: 401 };
        }

        // 2. Vérification du rôle admin ou school_admin
        if (user.role !== 'admin' && user.role !== 'school_admin') {
            return { error: 'Accès non autorisé : rôle administrateur ou école requis', status: 403 };
        }

        // 3. Vérification du mot de passe
        const isValid = await this.verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return { error: 'Email ou mot de passe incorrect', status: 401 };
        }

        return { user };
    }
}
