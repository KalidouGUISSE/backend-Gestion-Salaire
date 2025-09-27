import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
// Appliquer authMiddleware à toutes les routes
router.use(authMiddleware);
/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Liste des paiements
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: payRunId
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
 *     responses:
 *       200:
 *         description: Liste des paiements
 */
router.get("/", PaymentController.getAll);
/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Créer un paiement
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payslipId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *                 enum: [CASH, BANK_TRANSFER, ORANGE_MONEY, WAVE, OTHER]
 *               reference:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paiement créé
 */
router.post("/", PaymentController.create);
/**
 * @swagger
 * /payments/generate-receipt:
 *   post:
 *     summary: Générer un reçu PDF
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: PDF généré
 */
router.post("/generate-receipt", PaymentController.generateReceipt);
/**
 * @swagger
 * /payments/export-payrun/{payRunId}:
 *   get:
 *     summary: Exporter les reçus PDF pour une période de payrun
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: payRunId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF généré
 */
router.get("/export-payrun/:payRunId", PaymentController.exportPayRunReceipts);
export default router;
//# sourceMappingURL=PaymentRoute.js.map