import { UserService } from "../services/UserService.js";
import { CreateUserSchema } from "../validatorsSchema/UserValidator.js";
const service = new UserService();
export class UserController {
    static async getAll(req, res) {
        console.log('ertyuiopoiuyt');
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const users = await service.getAllUsers(page, limit);
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async findById(req, res) {
        try {
            const id = Number(req.params.id);
            const user = await service.findUserById(id);
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            return res.json(user);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async create(req, res) {
        try {
            const data = CreateUserSchema.parse(req.body);
            const user = await service.createUser(data);
            res.status(201).json(user);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }
    static async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = CreateUserSchema.parse(req.body);
            const user = await service.updateUser(id, data);
            res.json(user);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await service.deleteUser(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=UserController.js.map