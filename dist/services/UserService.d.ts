import type { User } from "@prisma/client";
import type { PaginationResult } from "../utils/pagination.js";
export declare class UserService {
    private repo;
    constructor();
    getAllUsers(page: number, limit: number): Promise<PaginationResult<User>>;
    findUserById(id: number): Promise<User | null>;
    createUser(data: Omit<User, "id">): Promise<User>;
    updateUser(id: number, data: Partial<Omit<User, "id">>): Promise<User>;
    deleteUser(id: number): Promise<void>;
}
//# sourceMappingURL=UserService.d.ts.map