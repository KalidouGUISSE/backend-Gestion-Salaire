import { EmployeeRepository } from "../repositories/EmployeeRepository.js";
import { QRUtils } from "../utils/qrUtils.js";
import { EmailUtils } from "../utils/emailUtils.js";
import { prisma } from "../prisma/client.js";
export class EmployeeService {
    repo;
    constructor() {
        this.repo = new EmployeeRepository();
    }
    getEmployees(companyId, filters, query) {
        return this.repo.findByCompanyAndFilters(companyId, filters, query);
    }
    findEmployeeById(id) {
        return this.repo.findById(id, { include: { company: true, profile: true } });
    }
    async createEmployee(data) {
        const fullName = data.fullName || `${data.firstName} ${data.lastName}`;
        const employee = await this.repo.create({ ...data, fullName });
        // Get company information
        const company = await prisma.company.findUnique({
            where: { id: employee.companyId },
            select: { name: true }
        });
        // Generate QR data with employee information
        const qrData = {
            employeeId: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fullName: employee.fullName,
            email: employee.email,
            phone: employee.phone,
            position: employee.position,
            contractType: employee.contractType,
            companyId: employee.companyId,
            companyName: company?.name || 'Unknown Company',
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        const qrToken = JSON.stringify(qrData);
        const qrCodePath = await QRUtils.generateQRCode(qrToken);
        // Create employee profile
        await prisma.employeeProfile.create({
            data: {
                employeeId: employee.id,
                qrToken,
                qrCodePath,
            },
        });
        // Send email if email is provided
        if (employee.email) {
            try {
                console.log('Sending QR email to:', employee.email, 'with QR path:', qrCodePath);
                await EmailUtils.sendQREmail(employee.email, qrCodePath, fullName);
                console.log('QR email sent successfully to:', employee.email);
            }
            catch (error) {
                console.error('Failed to send QR email:', error);
                // Don't fail the employee creation if email fails
            }
        }
        else {
            console.log('No email provided for employee, skipping QR email');
        }
        return employee;
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