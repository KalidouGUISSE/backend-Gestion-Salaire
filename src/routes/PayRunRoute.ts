import { Router } from "express";
import { PayRunController } from "../controllers/PayRunController.js";
import { PayslipController } from "../controllers/PayslipController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Appliquer authMiddleware à toutes les routes
router.use(authMiddleware);

/**
 * @swagger
 * /payruns:
 *   get:
 *     summary: Lister les cycles de paie
 *     tags: [Cycles de Paie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, APPROVED, CLOSED]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MONTHLY, WEEKLY, DAILY]
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
 *     responses:
 *       200:
 *         description: Liste des cycles de paie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   companyId: 1
 *                   title: "Paie Janvier 2024"
 *                   type: "MONTHLY"
 *                   periodStart: "2024-01-01T00:00:00.000Z"
 *                   periodEnd: "2024-01-31T23:59:59.999Z"
 *                   status: "DRAFT"
 *                   totalGross: 15000000
 *                   totalDeductions: 1500000
 *                   totalNet: 13500000
 *                   totalPaid: 0
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", PayRunController.getAll);

/**
 * @swagger
 * /payruns/{id}:
 *   get:
 *     summary: Obtenir un cycle de paie par ID
 *     tags: [Cycles de Paie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cycle de paie
 *     responses:
 *       200:
 *         description: Cycle de paie trouvé
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
 *       404:
 *         description: Cycle de paie non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", PayRunController.findById);

/**
 * @swagger
 * /payruns:
 *   post:
 *     summary: Créer un cycle de paie
 *     tags: [Cycles de Paie]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - periodStart
 *               - periodEnd
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Paie Janvier 2024"
 *               type:
 *                 type: string
 *                 enum: [MONTHLY, WEEKLY, DAILY]
 *                 example: "MONTHLY"
 *               periodStart:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               periodEnd:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-31"
 *               notes:
 *                 type: string
 *                 example: "Cycle de paie mensuel"
 *     responses:
 *       201:
 *         description: Cycle de paie créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "PayRun créé avec succès"
 *               data:
 *                 id: 1
 *                 companyId: 1
 *                 title: "Paie Janvier 2024"
 *                 type: "MONTHLY"
 *                 periodStart: "2024-01-01T00:00:00.000Z"
 *                 periodEnd: "2024-01-31T23:59:59.999Z"
 *                 status: "DRAFT"
 *                 totalGross: 0
 *                 totalDeductions: 0
 *                 totalNet: 0
 *                 totalPaid: 0
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", PayRunController.create);

/**
 * @swagger
 * /payruns/{id}:
 *   put:
 *     summary: Mettre à jour un cycle de paie
 *     tags: [Cycles de Paie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cycle de paie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cycle de paie mis à jour
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
router.put("/:id", PayRunController.update);

/**
 * @swagger
 * /payruns/{id}:
 *   delete:
 *     summary: Supprimer un cycle de paie
 *     tags: [Cycles de Paie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cycle de paie
 *     responses:
 *       204:
 *         description: Cycle de paie supprimé
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", PayRunController.delete);

/**
 * @swagger
 * /payruns/{id}/approve:
 *   patch:
 *     summary: Approuver un cycle de paie
 *     tags: [Cycles de Paie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cycle de paie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED]
 *                 example: "APPROVED"
 *     responses:
 *       200:
 *         description: Cycle de paie approuvé
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
router.patch("/:id/approve", PayRunController.approve);

/**
 * @swagger
 * /payruns/{id}/generate-payslips:
 *   post:
 *     summary: Générer les bulletins de salaire pour un cycle de paie
 *     tags: [Cycles de Paie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cycle de paie
 *     responses:
 *       200:
 *         description: Bulletins générés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Bulletins générés"
 *               data:
 *                 id: 1
 *                 title: "Paie Janvier 2024"
 *                 status: "APPROVED"
 *                 totalGross: 15000000
 *                 totalDeductions: 1500000
 *                 totalNet: 13500000
 *                 totalPaid: 0
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id/generate-payslips", PayRunController.generatePayslips);

// Payslips routes under payruns
/**
 * @swagger
 * /payruns/{payRunId}/payslips:
 *   get:
 *     summary: Lister les bulletins d'un cycle de paie
 *     tags: [Bulletins de Salaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payRunId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cycle de paie
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
 *     responses:
 *       200:
 *         description: Liste des bulletins
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/:payRunId/payslips", PayslipController.getAll);

/**
 * @swagger
 * /payruns/{payRunId}/payslips:
 *   post:
 *     summary: Créer un bulletin de salaire
 *     tags: [Bulletins de Salaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payRunId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cycle de paie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *               gross:
 *                 type: number
 *                 format: decimal
 *                 example: 500000
 *               deductions:
 *                 type: number
 *                 format: decimal
 *                 example: 50000
 *               notes:
 *                 type: string
 *                 example: "Bulletin de salaire"
 *     responses:
 *       201:
 *         description: Bulletin créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post("/:payRunId/payslips", PayslipController.create);

export default router;
