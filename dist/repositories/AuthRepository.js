import { prisma } from "../prisma/client.js";
import bcrypt from "bcrypt";
export class AuthRepository {
    async findUserByLogin(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }
    async verifyPassword(password, hash) {
        console.log('wwwwwwww');
        console.log('Password received:', JSON.stringify(password));
        console.log('Hash:', hash);
        const result = await bcrypt.compare(password, hash);
        console.log('Compare result:', result);
        return result;
    }
}
//# sourceMappingURL=AuthRepository.js.map