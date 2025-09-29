import type { Employee } from "@prisma/client";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class EmployeeService {
    private repo;
    constructor();
    getEmployees(companyId: number, filters: {
        isActive?: boolean | undefined;
        contractType?: string | undefined;
        position?: string | undefined;
        fullName?: string | undefined;
    }, query: PaginationQuery): Promise<PaginationResult<Employee>>;
    findEmployeeById(id: number): Promise<Employee | null>;
    createEmployee(data: Omit<Employee, "id">): Promise<Employee>;
    updateEmployee(id: number, data: Partial<Omit<Employee, "id">>): Promise<Employee>;
    deleteEmployee(id: number): Promise<void>;
    activateEmployee(id: number, isActive: boolean): Promise<Employee>;
    getActiveEmployeesByCompany(companyId: number): Promise<Employee[]>;
}
//# sourceMappingURL=EmployeeService.d.ts.map