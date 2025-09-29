import  { prisma }  from "../prisma/client.js";
import type { User } from "@prisma/client";
// import type { IRepository } from "./Irepository.js";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";

export class UserRepository extends CRUDRepesitorie<User> {

    constructor(){
        super(prisma,prisma.user)
    }
    // async create(data: Omit<User, "id">): Promise<User> {
    //     return prisma.user.create({ data });
    // }

    // async update(id: number, data: Partial<Omit<User, "id">>): Promise<User> {
    //     return prisma.user.update({ where: { id }, data });
    // }

    // async delete(id: number): Promise<void> {
    //     await prisma.user.delete({ where: { id } });
    // }
}
