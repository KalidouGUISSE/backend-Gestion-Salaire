export declare class AuthRepository {
    findUserByLogin(email: string): Promise<{
        id: number;
        email: string;
        password: string;
        fullName: string | null;
        role: import("@prisma/client").$Enums.Role;
        companyId: number | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    } | null>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
}
//# sourceMappingURL=AuthRepository.d.ts.map