import { EmployeeRepository } from "../repositories/EmployeeRepository.js";
export class EmployeeService {
    repo;
    constructor() {
        this.repo = new EmployeeRepository();
    }
    getEmployees(companyId, filters, query) {
        return this.repo.findByCompanyAndFilters(companyId, filters, query);
    }
    findEmployeeById(id) {
        return this.repo.findById(id, { include: { company: true } });
    }
    async createEmployee(data) {
        const fullName = data.fullName || `${data.firstName} ${data.lastName}`;
        return this.repo.create({ ...data, fullName });
    }
    async updateEmployee(id, data) {
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
    async deleteEmployee(id) {
        await this.repo.delete(id);
    }
    activateEmployee(id, isActive) {
        return this.repo.update(id, { isActive });
    }
    getActiveEmployeesByCompany(companyId) {
        return this.repo.findActiveByCompany(companyId);
    }
}
//# sourceMappingURL=EmployeeService.js.map