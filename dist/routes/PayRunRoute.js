import { Router } from "express";
import { PayRunController } from "../controllers/PayRunController.js";
import { PayslipController } from "../controllers/PayslipController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
// Appliquer authMiddleware à toutes les routes
router.use(authMiddleware);
router.get("/", PayRunController.getAll);
router.get("/:id", PayRunController.findById);
router.post("/", PayRunController.create);
router.put("/:id", PayRunController.update);
router.delete("/:id", PayRunController.delete);
router.patch("/:id/approve", PayRunController.approve);
router.post("/:id/generate-payslips", PayRunController.generatePayslips);
// Payslips routes under payruns
router.get("/:payRunId/payslips", PayslipController.getAll);
router.post("/:payRunId/payslips", PayslipController.create);
export default router;
//# sourceMappingURL=PayRunRoute.js.map