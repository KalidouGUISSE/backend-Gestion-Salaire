import { AuthService } from "../services/AuthService.js";
import { AuthRepository } from "../repositories/AuthRepository.js";
import { LoginSchema } from "../validatorsSchema/AuthValidator.js";
import jwt from "jsonwebtoken"; // <-- Import manquant
const authService = new AuthService(new AuthRepository());
export class AuthController {
    static async login(req, res) {
        console.log('oooooooooo');
        try {
            const { email, password } = LoginSchema.parse(req.body);
            const { accessToken, refreshToken, user } = await authService.login(email, password);
            console.log('accessToken', accessToken, refreshToken, 'user', user);
            // Mettre le refreshToken dans un cookie HttpOnly
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
            });
            return res.json({ accessToken, user });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async refreshToken(req, res) {
        try {
            const token = req.cookies.refreshToken;
            if (!token)
                throw new Error("Pas de refresh token");
            const payload = await authService.verifyRefreshToken(token);
            const accessToken = jwt.sign({ id: payload.id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
            return res.json({ accessToken });
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=AuthController.js.map