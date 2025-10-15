import type { User } from "@prisma/client";
import  { UserRepository } from "../repositories/UserRepository.js";
import bcrypt from "bcrypt";
import type { PaginationResult } from "../utils/pagination.js";

export class UserService {
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
    }

    getAllUsers(page:number, limit:number):Promise<PaginationResult<User>>{
        return this.repo.findAll({ page: page, limit: limit }, { include: { company: true } });
    }

    findUserById(id: number): Promise<User | null> {
        return this.repo.findById(id);
    }

    async createUser(data: Omit<User, "id">): Promise<User> {
        // Hachage du mot de passe avant de le sauvegarder
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userData = {
            ...data,
            password: hashedPassword
        };

        return this.repo.create(userData);
        // return this.repo.create(data);
    }

    updateUser(
        id: number,
        data: Partial<Omit<User, "id">>
    ): Promise<User> {
        return this.repo.update(id, data);
    }

    async deleteUser(id: number): Promise<void> {
        await this.repo.delete(id);
    }

}
