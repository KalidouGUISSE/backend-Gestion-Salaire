import type { Company } from "@prisma/client";
import { CompanyRepository } from "../repositories/CompanyRepository.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
import type { CreateCompanyInput, UpdateCompanySchema } from "../validatorsSchema/CompanyValidator.js";
import type { z } from "zod";

export class CompanyService {
    private repo: CompanyRepository;

    constructor() {
        this.repo = new CompanyRepository();
    }

    getCompanies(
        filters: {
            isActive?: boolean | undefined;
            name?: string | undefined;
        },
        query: PaginationQuery
    ): Promise<PaginationResult<Company>> {
        return this.repo.findByFilters(filters, query);
    }

    findCompanyById(id: number): Promise<Company | null> {
        return this.repo.findById(id);
    }

    async createCompany(data: CreateCompanyInput): Promise<Company> {
        return this.repo.create(data as Omit<Company, "id">);
    }

    async updateCompany(
        id: number,
        data: z.infer<typeof UpdateCompanySchema>
    ): Promise<Company> {
        return this.repo.update(id, data as Partial<Omit<Company, "id">>);
    }

    async deleteCompany(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    activateCompany(id: number, isActive: boolean): Promise<Company> {
        return this.repo.update(id, { isActive });
    }

    getActiveCompanies(): Promise<Company[]> {
        return this.repo.findActiveCompanies();
    }
}