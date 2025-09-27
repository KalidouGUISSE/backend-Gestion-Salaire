import { z } from "zod";
export const LoginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
});
export const registerSchema = z.object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
});
//# sourceMappingURL=AuthValidator.js.map