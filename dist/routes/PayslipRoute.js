import { Router } from "express";
import { PayslipController } from "../controllers/PayslipController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
router.use(authMiddleware);
// Payslips for a specific pay run
router.get("/payruns/:payRunId/payslips", PayslipController.getAll);
router.post("/payruns/:payRunId/payslips", PayslipController.create);
// Individual payslip operations
router.get("/:id", PayslipController.findById);
router.put("/:id", PayslipController.update);
router.delete("/:id", PayslipController.delete);
router.get("/:id/export-pdf", PayslipController.generatePDF);
// Payslips by employee
router.get("/employee/:employeeId", PayslipController.getByEmployeeId);
export default router;
//# sourceMappingURL=PayslipRoute.js.map