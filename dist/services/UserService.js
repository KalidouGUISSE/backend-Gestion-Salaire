import { UserRepository } from "../repositories/UserRepository.js";
import bcrypt from "bcrypt";
export class UserService {
    repo;
    constructor() {
        this.repo = new UserRepository();
    }
    getAllUsers(page, limit) {
        return this.repo.findAll({ page: page, limit: limit }, { include: { company: true } });
    }
    findUserById(id) {
        return this.repo.findById(id);
    }
    async createUser(data) {
        // Hachage du mot de passe avant de le sauvegarder
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userData = {
            ...data,
            password: hashedPassword
        };
        return this.repo.create(userData);
        // return this.repo.create(data);
    }
    updateUser(id, data) {
        return this.repo.update(id, data);
    }
    async deleteUser(id) {
        await this.repo.delete(id);
    }
}
//# sourceMappingURL=UserService.js.map