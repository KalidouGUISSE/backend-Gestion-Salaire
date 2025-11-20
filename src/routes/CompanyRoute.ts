import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
// Apply authMiddleware to other routes
router.use(authMiddleware);

// Temporarily remove auth for GET /companies to test integration
router.get("/", CompanyController.getAll);


/**
 * @swagger
 * /company:
 *   get:
 *     summary: Lister les entreprises
 *     tags: [Entreprises]
 *     parameters:
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
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des entreprises
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   name: "Entreprise ABC"
 *                   address: "123 Rue de la Paix, Dakar"
 *                   currency: "XOF"
 *                   payPeriodType: "MONTHLY"
 *                   isActive: true
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 5
 *                 totalPages: 1
 */

/**
 * @swagger
 * /company/{id}:
 *   get:
 *     summary: Obtenir une entreprise par ID
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entreprise
 *     responses:
 *       200:
 *         description: Entreprise trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 name: "Entreprise ABC"
 *                 address: "123 Rue de la Paix, Dakar"
 *                 currency: "XOF"
 *                 payPeriodType: "MONTHLY"
 *                 isActive: true
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       403:
 *         description: Accès refusé - Super admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entreprise non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", CompanyController.findById);

/**
 * @swagger
 * /company:
 *   post:
 *     summary: Créer une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Entreprise ABC"
 *               logo:
 *                 type: string
 *               address:
 *                 type: string
 *                 example: "123 Rue de la Paix, Dakar"
 *               currency:
 *                 type: string
 *                 default: "XOF"
 *               payPeriodType:
 *                 type: string
 *                 enum: [MONTHLY, WEEKLY, DAILY]
 *                 default: MONTHLY
 *     responses:
 *       201:
 *         description: Entreprise créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Entreprise créée avec succès"
 *               data:
 *                 id: 1
 *                 name: "Entreprise ABC"
 *                 address: "123 Rue de la Paix, Dakar"
 *                 currency: "XOF"
 *                 payPeriodType: "MONTHLY"
 *                 isActive: true
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       403:
 *         description: Accès refusé - Super admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", CompanyController.create);

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     summary: Mettre à jour une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entreprise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               address:
 *                 type: string
 *               currency:
 *                 type: string
 *               payPeriodType:
 *                 type: string
 *                 enum: [MONTHLY, WEEKLY, DAILY]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Entreprise mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Accès refusé - Super admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", CompanyController.update);

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: Supprimer une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entreprise
 *     responses:
 *       204:
 *         description: Entreprise supprimée
 *       403:
 *         description: Accès refusé - Super admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", CompanyController.delete);

/**
 * @swagger
 * /company/{id}/activate:
 *   patch:
 *     summary: Activer/désactiver une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entreprise
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
 *         description: Entreprise activée/désactivée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Accès refusé - Super admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/activate", CompanyController.activate);

export default router;
