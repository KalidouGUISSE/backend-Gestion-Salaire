import type { Employee } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class EmployeeRepository extends CRUDRepesitorie<Employee> {
    constructor();
    findByCompanyAndFilters(companyId: number, filters: {
        isActive?: boolean | undefined;
        contractType?: string | undefined;
        position?: string | undefined;
    }, query: PaginationQuery): Promise<PaginationResult<Employee>>;
    findActiveByCompany(companyId: number): Promise<Employee[]>;
}
//# sourceMappingURL=EmployeeRepository.d.ts.map