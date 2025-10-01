import type { Request, Response } from "express";
export declare class PaymentController {
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAll(req: Request, res: Response): Promise<void>;
    static getForPayRun(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generateReceipt(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static exportPayRunReceipts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getByEmployeeId(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=PaymentController.d.ts.map