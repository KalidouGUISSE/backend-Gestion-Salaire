import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
// Appliquer authMiddleware à toutes les routes
router.use(authMiddleware);
/**
 * @swagger
 * /dashboard/kpis:
 *   get:
 *     summary: Obtenir les KPIs du tableau de bord
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: KPIs retournés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPayroll:
 *                   type: number
 *                 totalPaid:
 *                   type: number
 *                 totalOutstanding:
 *                   type: number
 *                 activeEmployees:
 *                   type: number
 *                 evolution:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       gross:
 *                         type: number
 *                       paid:
 *                         type: number
 *                       outstanding:
 *                         type: number
 */
router.get("/kpis", DashboardController.getKPIs);
export default router;
//# sourceMappingURL=DashboardRoute.js.map