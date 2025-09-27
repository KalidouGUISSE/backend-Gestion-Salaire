import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// Étendre Request pour y ajouter user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: "Token manquant" });
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Token malformé" });
        return;
    }

    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
        res.status(500).json({ error: "Clé JWT non définie" });
        return;
    }

    try {
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (e) {
        res.status(401).json({ error: "Token invalide" });
    }
}





