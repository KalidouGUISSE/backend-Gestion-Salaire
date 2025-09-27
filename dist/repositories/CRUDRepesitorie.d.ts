import { PrismaClient } from "@prisma/client/extension";
import { type PaginationQuery, type PaginationResult } from "../utils/pagination.js";
export declare class CRUDRepesitorie<T> {
    protected prisma: PrismaClient;
    protected model: any;
    constructor(prisma: PrismaClient, model: any);
    findAll(query?: PaginationQuery, options?: {
        where?: any;
        include?: any;
        orderBy?: any;
    }): Promise<PaginationResult<T>>;
    findById(id: number, options?: {
        include?: any;
    }): Promise<T | null>;
    update(id: number, data: Partial<Omit<T, "id">>): Promise<T>;
    delete(id: number): Promise<void>;
    create(data: Omit<T, "id">): Promise<T>;
}
//# sourceMappingURL=CRUDRepesitorie.d.ts.map