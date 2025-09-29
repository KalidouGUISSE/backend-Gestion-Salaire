import type { Employee } from "@prisma/client";
import { EmployeeRepository } from "../repositories/EmployeeRepository.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class EmployeeService {
    private repo: EmployeeRepository;

    constructor() {
        this.repo = new EmployeeRepository();
    }

    getEmployees(
        companyId: number,
        filters: {
            isActive?: boolean | undefined;
            contractType?: string | undefined;
            position?: string | undefined;
            fullName?: string | undefined;
        },
        query: PaginationQuery
    ): Promise<PaginationResult<Employee>> {
        return this.repo.findByCompanyAndFilters(companyId, filters, query);
    }

    findEmployeeById(id: number): Promise<Employee | null> {
        return this.repo.findById(id, { include: { company: true } });
    }

    async createEmployee(data: Omit<Employee, "id">): Promise<Employee> {
        const fullName = data.fullName || `${data.firstName} ${data.lastName}`;
        return this.repo.create({ ...data, fullName });
    }

    async updateEmployee(
        id: number,
        data: Partial<Omit<Employee, "id">>
    ): Promise<Employee> {
        if (data.firstName || data.lastName) {
            // If updating names, recalculate fullName
            const employee = await this.repo.findById(id);
            if (employee) {
                const firstName = data.firstName || employee.firstName;
                const lastName = data.lastName || employee.lastName;
                data.fullName = `${firstName} ${lastName}`;
            }
        }
        return this.repo.update(id, data);
    }

    async deleteEmployee(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    activateEmployee(id: number, isActive: boolean): Promise<Employee> {
        return this.repo.update(id, { isActive });
    }

    getActiveEmployeesByCompany(companyId: number): Promise<Employee[]> {
        return this.repo.findActiveByCompany(companyId);
    }
}