import { EmployeeService } from "../../src/services/EmployeeService.js";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("EmployeeService", () => {
    let service: EmployeeService;

    beforeEach(() => {
        service = new EmployeeService();
    });

    describe("createEmployee", () => {
        it("should create an employee with fullName", async () => {
            // Mock the repository
            const mockEmployee = { id: 1, firstName: "John", lastName: "Doe", fullName: "John Doe" };
            // @ts-ignore
            service['repo'].create = jest.fn().mockResolvedValue(mockEmployee);

            const data = { firstName: "John", lastName: "Doe", contractType: "FIXE", salary: 50000 };
            const result = await service.createEmployee(data as any);

            expect(service['repo'].create).toHaveBeenCalledWith({ ...data, fullName: "John Doe" });
            expect(result).toEqual(mockEmployee);
        });
    });

    describe("updateEmployee", () => {
        it("should update fullName when names change", async () => {
            const existing = { id: 1, firstName: "John", lastName: "Doe", fullName: "John Doe" };
            // @ts-ignore
            service['repo'].findById = jest.fn().mockResolvedValue(existing);
            // @ts-ignore
            service['repo'].update = jest.fn().mockResolvedValue({ ...existing, firstName: "Jane" });

            const result = await service.updateEmployee(1, { firstName: "Jane" });

            expect(service['repo'].update).toHaveBeenCalledWith(1, { firstName: "Jane", fullName: "Jane Doe" });
        });
    });

    describe("activateEmployee", () => {
        it("should activate an employee", async () => {
            // @ts-ignore
            service['repo'].update = jest.fn().mockResolvedValue({ id: 1, isActive: true });

            const result = await service.activateEmployee(1, true);

            expect(service['repo'].update).toHaveBeenCalledWith(1, { isActive: true });
        });
    });
});