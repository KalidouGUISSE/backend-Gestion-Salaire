import { prisma } from "../prisma/client.js";
// import type { IRepository } from "./Irepository.js";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export class UserRepository extends CRUDRepesitorie {
    constructor() {
        super(prisma, prisma.user);
    }
    async create(data) {
        return prisma.user.create({ data });
    }
}
//# sourceMappingURL=UserRepository.js.map