import { Router } from "express";
import { AttendanceController } from "../controllers/AttendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
const controller = new AttendanceController();
// POST /attendance/scan - Scan QR code for attendance
router.post("/scan", authMiddleware, controller.scanQRCode.bind(controller));
// GET /attendance/today/:employeeId - Get today's attendance for employee
router.get("/today/:employeeId", authMiddleware, controller.getTodayAttendance.bind(controller));
// GET /attendance/report - Get attendance report with filters
router.get("/report", authMiddleware, controller.getAttendanceReport.bind(controller));
// GET /attendance/export - Export attendance report as CSV
router.get("/export", authMiddleware, controller.exportAttendanceReport.bind(controller));
// GET /attendance/hours - Get working hours for employee in period
router.get("/hours", authMiddleware, controller.getWorkingHours.bind(controller));
export { router as AttendanceRoute };
//# sourceMappingURL=AttendanceRoute.js.map