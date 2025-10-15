import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
import * as path from "path";
import * as fs from "fs";
const multerLib = multer?.default || multer;
const router = Router();
// Multer configuration for photos uploads
const storage = multerLib.diskStorage({
    destination: (req, file, cb) => {
        const dest = "uploads/photos";
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, `employee_${req.params.id}_${Date.now()}${ext}`);
    },
});
const upload = multerLib({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype))
            return cb(null, true);
        return cb(new Error("Type de fichier non supporté"));
    },
});
// Route publique pour vérifier le QR code (pas besoin d'authentification)
// router.get("/verify-qr/:token", EmployeeController.verifyQR); // Deprecated - now using attendance scan
// Appliquer authMiddleware à toutes les routes
router.use(authMiddleware);
router.get("/company/:companyId", EmployeeController.getByCompany);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.findById);
router.post("/", EmployeeController.create);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);
router.patch("/:id/activate", EmployeeController.activate);
// Upload employee photos
router.post("/:id/photos", upload.single("image"), EmployeeController.uploadPhotos);
export default router;
//# sourceMappingURL=EmployeeRoute.js.map