import type { Request, Response } from "express";
import type {  User } from "@prisma/client";
import { UserService } from "../services/UserService.js";
import { CreateUserSchema } from "../validatorsSchema/UserValidator.js"; 
const service = new UserService();

export class UserController {
    static async getAll(req: Request, res: Response) {
        console.log('ertyuiopoiuyt');
        
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const users = await service.getAllUsers(page,limit);
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }


    static async findById(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const user = await service.findUserById(id);
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            return res.json(user);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
    

    static async create(req: Request, res: Response) {
        try {
            const data = CreateUserSchema.parse(req.body) as unknown as Omit<User, "id">;
            const user = await service.createUser(data);
            
            res.status(201).json(user);
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const data = CreateUserSchema.parse(req.body) as Partial<Omit<User, "id" >>;
            const user = await service.updateUser(id, data);
            res.json(user);
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }


    static async delete(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await service.deleteUser(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
