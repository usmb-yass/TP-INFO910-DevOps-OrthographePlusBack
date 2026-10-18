import User from "#shared/types/User";

// Extension de l'interface Request d'Express pour y ajouter l'utilisateur
declare global {
    namespace Express {
        interface Request {
            user?: Partial<User> & { id: string }; // car AuthService.generateToken retourne { id: userId }, donc l'id existe toujours
        }
    }
}