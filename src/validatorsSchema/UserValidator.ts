import { z } from "zod";
// import { ErreurMessages } from "../utils/errorsMessage.js";

export const CreateUserSchema = z.object({
    fullName: z
        .string()
        .min(3, "Le nom doit contenir au moins 3 caractères")
        .max(50, "Le nom ne doit pas dépasser 50 caractères"),

    email: z
        .string()
        .email("Email invalide"),

    password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .max(100, "Le mot de passe est trop long"),

    role: z
        .enum(["ADMIN", "USER", "MANAGER"])
        .default("ADMIN"), // tu peux adapter selon ton projet


    companyId: z.number().nullable().optional(),
    isActive: z.boolean().default(true),
});
