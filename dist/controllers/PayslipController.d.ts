import type { Request, Response } from "express";
export declare class PayslipController {
    static getAll(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generatePDF(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=PayslipController.d.ts.map