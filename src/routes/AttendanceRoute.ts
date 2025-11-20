import { Router } from "express";
import { AttendanceController } from "../controllers/AttendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
const controller = new AttendanceController();

/**
 * @swagger
 * /attendance/scan:
 *   post:
 *     summary: Scanner un QR code pour pointer
 *     tags: [Présences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrToken
 *             properties:
 *               qrToken:
 *                 type: string
 *                 description: Token QR de l'employé
 *                 example: "abc123def456"
 *     responses:
 *       200:
 *         description: Pointage enregistré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Pointage entrée enregistré"
 *               data:
 *                 id: 1
 *                 employeeId: 1
 *                 companyId: 1
 *                 timestamp: "2024-01-15T08:30:00.000Z"
 *                 type: "ENTRY"
 *                 createdAt: "2024-01-15T08:30:00.000Z"
 *       400:
 *         description: Token QR invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/scan", authMiddleware, controller.scanQRCode.bind(controller));

/**
 * @swagger
 * /attendance/today/{employeeId}:
 *   get:
 *     summary: Obtenir les pointages du jour pour un employé
 *     tags: [Présences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     responses:
 *       200:
 *         description: Pointages du jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   employeeId: 1
 *                   companyId: 1
 *                   timestamp: "2024-01-15T08:30:00.000Z"
 *                   type: "ENTRY"
 *                   createdAt: "2024-01-15T08:30:00.000Z"
 *                 - id: 2
 *                   employeeId: 1
 *                   companyId: 1
 *                   timestamp: "2024-01-15T17:30:00.000Z"
 *                   type: "EXIT"
 *                   createdAt: "2024-01-15T17:30:00.000Z"
 */
router.get("/today/:employeeId", authMiddleware, controller.getTodayAttendance.bind(controller));

/**
 * @swagger
 * /attendance/report:
 *   get:
 *     summary: Rapport des présences avec filtres
 *     tags: [Présences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
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
 *         description: Rapport des présences
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   employeeId: 1
 *                   companyId: 1
 *                   timestamp: "2024-01-15T08:30:00.000Z"
 *                   type: "ENTRY"
 *                   createdAt: "2024-01-15T08:30:00.000Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 50
 *                 totalPages: 5
 */
router.get("/report", authMiddleware, controller.getAttendanceReport.bind(controller));

/**
 * @swagger
 * /attendance/export:
 *   get:
 *     summary: Exporter le rapport des présences en CSV
 *     tags: [Présences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Fichier CSV généré
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/export", authMiddleware, controller.exportAttendanceReport.bind(controller));

/**
 * @swagger
 * /attendance/hours:
 *   get:
 *     summary: Obtenir les heures travaillées pour un employé dans une période
 *     tags: [Présences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Heures travaillées
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               data:
 *                 employeeId: 1
 *                 totalHours: 160
 *                 workedDays: 20
 *                 period: "2024-01-01 to 2024-01-31"
 */
router.get("/hours", authMiddleware, controller.getWorkingHours.bind(controller));

export { router as AttendanceRoute };