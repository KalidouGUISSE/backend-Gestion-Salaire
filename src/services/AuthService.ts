import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/AuthRepository.js";

export class AuthService {
    constructor(private repo: AuthRepository) {}

    async login(email: string, password: string) {
        const user = await this.repo.findUserByLogin(email);
        
        if (!user) throw new Error("Utilisateur introuvable");

        const valid = await this.repo.verifyPassword(password, user.password);
        
        if (!valid) throw new Error("Mot de passe incorrect");

        const accessToken = jwt.sign(
            { 
                id: user.id, 
                login: user.email,
                role: user.role,
                companyId: user.companyId
            },
            process.env.ACCESS_SECRET!,  // <-- doit avoir une valeur
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { 
                id: user.id 
            },
            process.env.REFRESH_SECRET!,  // <-- doit avoir une valeur
            { expiresIn: "7d" }
        );

        
        return { accessToken, refreshToken, user };
    }

    async verifyAccessToken(token: string) {
        return jwt.verify(token, process.env.ACCESS_SECRET!);
    }

    async verifyRefreshToken(token: string) {
        return jwt.verify(token, process.env.REFRESH_SECRET!);
    }
}
