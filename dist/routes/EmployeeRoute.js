import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/company/:companyId", EmployeeController.getByCompany);
// Appliquer authMiddleware à toutes les routes
router.use(authMiddleware);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.findById);
router.post("/", EmployeeController.create);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);
router.patch("/:id/activate", EmployeeController.activate);
export default router;
//# sourceMappingURL=EmployeeRoute.js.map