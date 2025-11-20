import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/AuthRepository.js";
export declare class AuthService {
    private repo;
    constructor(repo: AuthRepository);
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            email: string;
            password: string;
            id: number;
            fullName: string | null;
            role: import("@prisma/client").$Enums.Role;
            companyId: number | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
    }>;
    verifyAccessToken(token: string): Promise<string | jwt.JwtPayload>;
    verifyRefreshToken(token: string): Promise<string | jwt.JwtPayload>;
}
//# sourceMappingURL=AuthService.d.ts.map