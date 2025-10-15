import { Router } from "express";
import type { Request } from "express";
import { EmployeeController } from "../controllers/EmployeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
import type { FileFilterCallback } from "multer";
import * as path from "path";
import * as fs from "fs";

const multerLib: any = (multer as any)?.default || (multer as any);
const router = Router();

// Multer configuration for photos uploads
const storage = multerLib.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const dest = "uploads/photos";
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `employee_${req.params.id}_${Date.now()}${ext}`);
  },
});

const upload = multerLib({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
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