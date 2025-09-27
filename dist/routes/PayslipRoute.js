import { Router } from "express";
import { PayslipController } from "../controllers/PayslipController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
router.use(authMiddleware);
router.get("/:id", PayslipController.findById);
router.put("/:id", PayslipController.update);
export default router;
//# sourceMappingURL=PayslipRoute.js.map