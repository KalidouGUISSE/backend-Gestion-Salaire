import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
import * as path from "path";
import * as fs from "fs";
const multerLib = multer?.default || multer;
const router = Router();
// Multer configuration for photos uploads
const storage = multerLib.diskStorage({
    destination: (req, file, cb) => {
        const dest = "uploads/photos";
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, `employee_${req.params.id}_${Date.now()}${ext}`);
    },
});
const upload = multerLib({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype))
            return cb(null, true);
        return cb(new Error("Type de fichier non supporté"));
    },
});
// Appliquer authMiddleware à toutes les routes
router.use(authMiddleware);
/**
 * @swagger
 * /employees/company/{companyId}:
 *   get:
 *     summary: Lister les employés d'une entreprise
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entreprise
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: contractType
 *         schema:
 *           type: string
 *           enum: [JOURNALIER, FIXE, HONORAIRE]
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des employés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   companyId: 1
 *                   firstName: "Jean"
 *                   lastName: "Dupont"
 *                   fullName: "Jean Dupont"
 *                   email: "jean.dupont@company.com"
 *                   contractType: "FIXE"
 *                   salary: 500000
 *                   position: "Développeur"
 *                   isActive: true
 *                   attendanceCount: 15
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/company/:companyId", EmployeeController.getByCompany);
/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Lister tous les employés
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: contractType
 *         schema:
 *           type: string
 *           enum: [JOURNALIER, FIXE, HONORAIRE]
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des employés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", EmployeeController.getAll);
/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Obtenir un employé par ID
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     responses:
 *       200:
 *         description: Employé trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Employé non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", EmployeeController.findById);
/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Créer un employé
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - contractType
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jean"
 *               lastName:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@company.com"
 *               phone:
 *                 type: string
 *                 example: "+221 77 123 45 67"
 *               position:
 *                 type: string
 *                 example: "Développeur"
 *               contractType:
 *                 type: string
 *                 enum: [JOURNALIER, FIXE, HONORAIRE]
 *                 example: "FIXE"
 *               salary:
 *                 type: number
 *                 format: decimal
 *                 example: 500000
 *               bankAccount:
 *                 type: string
 *                 example: "SN1234567890123456789012"
 *               bankName:
 *                 type: string
 *                 example: "CBAO"
 *               taxIdentifier:
 *                 type: string
 *                 example: "123456789"
 *               hireDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *     responses:
 *       201:
 *         description: Employé créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Employé créé avec succès"
 *               data:
 *                 id: 1
 *                 companyId: 1
 *                 firstName: "Jean"
 *                 lastName: "Dupont"
 *                 contractType: "FIXE"
 *                 salary: 500000
 *                 isActive: true
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", EmployeeController.create);
/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Mettre à jour un employé
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               position:
 *                 type: string
 *               contractType:
 *                 type: string
 *                 enum: [JOURNALIER, FIXE, HONORAIRE]
 *               salary:
 *                 type: number
 *                 format: decimal
 *               bankAccount:
 *                 type: string
 *               bankName:
 *                 type: string
 *               taxIdentifier:
 *                 type: string
 *               hireDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Employé mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", EmployeeController.update);
/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Supprimer un employé
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     responses:
 *       204:
 *         description: Employé supprimé
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", EmployeeController.delete);
/**
 * @swagger
 * /employees/{id}/activate:
 *   patch:
 *     summary: Activer/désactiver un employé
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Employé activé/désactivé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/activate", EmployeeController.activate);
/**
 * @swagger
 * /employees/{id}/photos:
 *   post:
 *     summary: Télécharger une photo d'employé
 *     tags: [Employés]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image (JPEG, PNG, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Photo mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Erreur de validation du fichier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id/photos", upload.single("image"), EmployeeController.uploadPhotos);
export default router;
//# sourceMappingURL=EmployeeRoute.js.map