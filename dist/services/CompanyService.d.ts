import type { Company } from "@prisma/client";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
import type { CreateCompanyInput, UpdateCompanySchema } from "../validatorsSchema/CompanyValidator.js";
import type { z } from "zod";
export declare class CompanyService {
    private repo;
    constructor();
    getCompanies(filters: {
        isActive?: boolean | undefined;
        name?: string | undefined;
    }, query: PaginationQuery): Promise<PaginationResult<Company>>;
    findCompanyById(id: number): Promise<Company | null>;
    createCompany(data: CreateCompanyInput): Promise<Company>;
    updateCompany(id: number, data: z.infer<typeof UpdateCompanySchema>): Promise<Company>;
    deleteCompany(id: number): Promise<void>;
    activateCompany(id: number, isActive: boolean): Promise<Company>;
    getActiveCompanies(): Promise<Company[]>;
}
//# sourceMappingURL=CompanyService.d.ts.map