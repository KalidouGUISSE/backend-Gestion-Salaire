import { CompanyRepository } from "../repositories/CompanyRepository.js";
export class CompanyService {
    repo;
    constructor() {
        this.repo = new CompanyRepository();
    }
    getCompanies(filters, query) {
        return this.repo.findByFilters(filters, query);
    }
    findCompanyById(id) {
        return this.repo.findById(id);
    }
    async createCompany(data) {
        return this.repo.create(data);
    }
    async updateCompany(id, data) {
        return this.repo.update(id, data);
    }
    async deleteCompany(id) {
        await this.repo.delete(id);
    }
    activateCompany(id, isActive) {
        return this.repo.update(id, { isActive });
    }
    getActiveCompanies() {
        return this.repo.findActiveCompanies();
    }
}
//# sourceMappingURL=CompanyService.js.map