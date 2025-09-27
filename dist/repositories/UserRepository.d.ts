import type { User } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export declare class UserRepository extends CRUDRepesitorie<User> {
    constructor();
    create(data: Omit<User, "id">): Promise<User>;
}
//# sourceMappingURL=UserRepository.d.ts.map