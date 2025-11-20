import { Router } from "express";
import { PayslipController } from "../controllers/PayslipController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
router.use(authMiddleware);
// Payslips for a specific pay run - Already documented in PayRunRoute.ts
// Individual payslip operations
/**
 * @swagger
 * /payslips/{id}:
 *   get:
 *     summary: Obtenir un bulletin par ID
 *     tags: [Bulletins de Salaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bulletin
 *     responses:
 *       200:
 *         description: Bulletin trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 payRunId: 1
 *                 employeeId: 1
 *                 gross: 500000
 *                 deductions: 50000
 *                 netPayable: 450000
 *                 paidAmount: 0
 *                 status: "PENDING"
 *                 locked: false
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: Bulletin non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", PayslipController.findById);
/**
 * @swagger
 * /payslips/{id}:
 *   put:
 *     summary: Mettre à jour un bulletin
 *     tags: [Bulletins de Salaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bulletin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gross:
 *                 type: number
 *                 format: decimal
 *               deductions:
 *                 type: number
 *                 format: decimal
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bulletin mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.put("/:id", PayslipController.update);
/**
 * @swagger
 * /payslips/{id}:
 *   delete:
 *     summary: Supprimer un bulletin
 *     tags: [Bulletins de Salaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bulletin
 *     responses:
 *       204:
 *         description: Bulletin supprimé
 */
router.delete("/:id", PayslipController.delete);
/**
 * @swagger
 * /payslips/{id}/export-pdf:
 *   get:
 *     summary: Générer et télécharger le PDF du bulletin
 *     tags: [Bulletins de Salaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bulletin
 *     responses:
 *       200:
 *         description: PDF généré
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Bulletin non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id/export-pdf", PayslipController.generatePDF);
/**
 * @swagger
 * /payslips/employee/{employeeId}:
 *   get:
 *     summary: Lister les bulletins d'un employé
 *     tags: [Bulletins de Salaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
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
router.get("/employee/:employeeId", PayslipController.getByEmployeeId);
/**
 * @swagger
 * /payslips:
 *   get:
 *     summary: Lister tous les bulletins (pour sélection de paiement)
 *     tags: [Bulletins de Salaire]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: payRunId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PARTIAL, PAID, LOCKED]
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
router.get("/", PayslipController.getAllPayslips);
export default router;
//# sourceMappingURL=PayslipRoute.js.map