// import { Etat } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension"
import { paginate,type PaginationQuery, type PaginationResult } from "../utils/pagination.js";


export class CRUDRepesitorie <T>{
    protected prisma: PrismaClient;
    protected model: any;

    constructor(prisma: PrismaClient, model: any) {
        this.prisma = prisma;
        this.model = model;
    }

  // Nouvelle version de findAll avec pagination
    async findAll(
        query?: PaginationQuery, 
        options: { where?: any; include?: any; orderBy?: any } = {}
    ): Promise<PaginationResult<T>> {
    // Si aucun query fourni, renvoyer tout (mode legacy)
        if (!query) {
        const data = await this.model.findMany(options);
        const total = await this.model.count({ where: options.where });
        return {
            data,
            meta: {
                total,
                page: 1,
                lastPage: 1,
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
    }

        // Sinon utiliser la fonction paginate
        return paginate<T>(this.model._modelName || this.model, query, options);
    }

    async findById(
        id: number,
        options?: { include?: any }     // 👈 option pour inclure des relations
      ): Promise<T | null> {
        return await this.model.findUnique({
            where: { id },
            ...options,                 // 👈 on fusionne les options ici
        });
    }

    async update(id: number, data: Partial<Omit<T, "id">>): Promise<T> {
        return this.model.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<void> {
        await this.model.delete({ 
            where: { id } 
        })
    }

    async create(data: Omit<T, "id">): Promise<T> {
        return this.model.create({ data });
    }

}
