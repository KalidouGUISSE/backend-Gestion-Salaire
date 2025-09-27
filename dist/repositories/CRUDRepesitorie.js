// import { Etat } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import { paginate } from "../utils/pagination.js";
export class CRUDRepesitorie {
    prisma;
    model;
    constructor(prisma, model) {
        this.prisma = prisma;
        this.model = model;
    }
    // Nouvelle version de findAll avec pagination
    async findAll(query, options = {}) {
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
        return paginate(this.model._modelName || this.model, query, options);
    }
    async findById(id, options // 👈 option pour inclure des relations
    ) {
        return await this.model.findUnique({
            where: { id },
            ...options, // 👈 on fusionne les options ici
        });
    }
    async update(id, data) {
        return this.model.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await this.model.delete({
            where: { id }
        });
    }
    async create(data) {
        return this.model.create({ data });
    }
}
//# sourceMappingURL=CRUDRepesitorie.js.map