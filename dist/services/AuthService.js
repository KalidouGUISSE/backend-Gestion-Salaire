import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/AuthRepository.js";
export class AuthService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async login(email, password) {
        const user = await this.repo.findUserByLogin(email);
        console.log('user', user);
        if (!user)
            throw new Error("Utilisateur introuvable");
        const valid = await this.repo.verifyPassword(password, user.password);
        console.log('=ppppppppp=');
        if (!valid)
            throw new Error("Mot de passe incorrect");
        console.log('=============');
        const accessToken = jwt.sign({
            id: user.id,
            login: user.email,
            role: user.role,
            companyId: user.companyId
        }, process.env.ACCESS_SECRET, // <-- doit avoir une valeur
        { expiresIn: "1h" });
        const refreshToken = jwt.sign({
            id: user.id
        }, process.env.REFRESH_SECRET, // <-- doit avoir une valeur
        { expiresIn: "7d" });
        return { accessToken, refreshToken, user };
    }
    async verifyAccessToken(token) {
        return jwt.verify(token, process.env.ACCESS_SECRET);
    }
    async verifyRefreshToken(token) {
        return jwt.verify(token, process.env.REFRESH_SECRET);
    }
}
//# sourceMappingURL=AuthService.js.map