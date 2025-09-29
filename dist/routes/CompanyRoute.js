import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();
// Temporarily remove auth for GET /companies to test integration
router.get("/", CompanyController.getAll);
// Apply authMiddleware to other routes
router.use(authMiddleware);
router.get("/:id", CompanyController.findById);
router.post("/", CompanyController.create);
router.put("/:id", CompanyController.update);
router.delete("/:id", CompanyController.delete);
router.patch("/:id/activate", CompanyController.activate);
export default router;
//# sourceMappingURL=CompanyRoute.js.map