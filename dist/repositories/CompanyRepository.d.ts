import type { Company } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class CompanyRepository extends CRUDRepesitorie<Company> {
    constructor();
    findByFilters(filters: {
        isActive?: boolean | undefined;
        name?: string | undefined;
    }, query: PaginationQuery): Promise<PaginationResult<Company>>;
    findActiveCompanies(): Promise<Company[]>;
}
//# sourceMappingURL=CompanyRepository.d.ts.map