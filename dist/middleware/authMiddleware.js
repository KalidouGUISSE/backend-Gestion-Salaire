import jwt from "jsonwebtoken";
export function authMiddleware(req, res, next) {
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
    }
    catch (e) {
        res.status(401).json({ error: "Token invalide" });
    }
}
//# sourceMappingURL=authMiddleware.js.map