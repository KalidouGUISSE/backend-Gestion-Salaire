import { prisma } from "../prisma/client.js";
import bcrypt from "bcrypt";

export class AuthRepository {
    async findUserByLogin(email: string) {
        console.log('?????????????????????');
        
        console.log(
           await prisma.user.findUnique({
                where: { email }
            })
        );
        return prisma.user.findUnique({
            where: { email }
        });
    }

    async verifyPassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}
