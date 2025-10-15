import { PayslipRepository } from "../repositories/PayslipRepository.js";
import { prisma } from "../prisma/client.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
export class PayslipService {
    repo;
    constructor() {
        this.repo = new PayslipRepository();
    }
    findPayslipById(id) {
        return this.repo.findById(id, { include: { employee: true, payRun: true, payments: true } });
    }
    getAllByPayRun(payRunId, filters, query) {
        return this.repo.findByPayRun(payRunId, filters, query);
    }
    async createPayslip(data) {
        return this.repo.create(data);
    }
    async deletePayslip(id) {
        await this.repo.delete(id);
    }
    updatePayslip(id, data) {
        return this.repo.update(id, data);
    }
    async getPayRunStatus(payRunId) {
        const payRun = await this.repo.getPayRunStatus(payRunId);
        return payRun;
    }
    async getPayslipsByEmployeeId(employeeId) {
        return this.repo.findByEmployeeId(employeeId);
    }
    async getAllPayslipsForPayment(query, companyId) {
        return this.repo.findAllForPayment(query, companyId);
    }
    async generatePDF(payslipId) {
        const payslip = await this.repo.findById(payslipId, { include: { employee: true, payRun: true } });
        if (!payslip) {
            throw new Error("Payslip not found");
        }
        const company = await prisma.company.findUnique({ where: { id: payslip.payRun.companyId } });
        if (!company) {
            throw new Error("Company not found");
        }
        // Create uploads directory if not exists
        const uploadsDir = path.join(process.cwd(), 'uploads', 'payslips');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const pdfPath = path.join(uploadsDir, `payslip_${payslipId}.pdf`);
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: `Bulletin de Paie - ${payslip.employee.fullName}`,
                Author: company.name,
                Subject: 'Bulletin de salaire'
            }
        });
        doc.pipe(fs.createWriteStream(pdfPath));
        // Colors
        const primaryColor = '#2563eb'; // Blue
        const secondaryColor = '#64748b'; // Gray
        const accentColor = '#dc2626'; // Red
        // Header with company info
        doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold').text(company.name, { align: 'center' });
        doc.moveDown(0.5);
        doc.fillColor(secondaryColor).fontSize(12).font('Helvetica').text('BULLETIN DE PAIE', { align: 'center' });
        doc.moveDown(1);
        // Period and date
        const currentDate = new Date().toLocaleDateString('fr-FR');
        doc.fillColor(secondaryColor).fontSize(10).text(`Date d'émission: ${currentDate}`, { align: 'right' });
        doc.moveDown(0.5);
        // Period box
        doc.fillColor(primaryColor).rect(50, doc.y, 500, 25).fill();
        doc.fillColor('white').fontSize(12).font('Helvetica-Bold').text(`Période: ${payslip.payRun.periodStart.toLocaleDateString('fr-FR')} - ${payslip.payRun.periodEnd.toLocaleDateString('fr-FR')}`, 60, doc.y - 20, { align: 'center' });
        doc.moveDown(2);
        // Employee information section
        doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('INFORMATIONS EMPLOYÉ');
        doc.moveDown(0.5);
        // Employee details in a structured format
        const employeeY = doc.y;
        doc.fillColor(secondaryColor).fontSize(10).text('Nom complet:', 70, employeeY);
        doc.fillColor('black').fontSize(10).text(payslip.employee.fullName, 150, employeeY);
        doc.fillColor(secondaryColor).fontSize(10).text('Poste:', 70, employeeY + 15);
        doc.fillColor('black').fontSize(10).text(payslip.employee.position || 'N/A', 150, employeeY + 15);
        doc.fillColor(secondaryColor).fontSize(10).text('Type de contrat:', 70, employeeY + 30);
        doc.fillColor('black').fontSize(10).text(payslip.employee.contractType || 'N/A', 150, employeeY + 30);
        doc.fillColor(secondaryColor).fontSize(10).text('Email:', 70, employeeY + 45);
        doc.fillColor('black').fontSize(10).text(payslip.employee.email || 'N/A', 150, employeeY + 45);
        if (payslip.employee.phone) {
            doc.fillColor(secondaryColor).fontSize(10).text('Téléphone:', 70, employeeY + 60);
            doc.fillColor('black').fontSize(10).text(payslip.employee.phone, 150, employeeY + 60);
        }
        doc.y = employeeY + 80;
        // Salary details section
        doc.moveDown(1);
        doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('DÉTAILS DE RÉMUNÉRATION');
        doc.moveDown(0.5);
        // Create a table-like structure for salary details
        const tableY = doc.y;
        const rowHeight = 25;
        const colWidth = 200;
        // Table header
        doc.fillColor(primaryColor).rect(50, tableY, colWidth, rowHeight).fill();
        doc.fillColor(primaryColor).rect(250, tableY, colWidth, rowHeight).fill();
        doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text('DESCRIPTION', 60, tableY + 7);
        doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text('MONTANT (FCFA)', 260, tableY + 7);
        // Salary rows
        let currentY = tableY + rowHeight;
        // Alternating row colors
        const drawRow = (label, amount, isEven) => {
            const bgColor = isEven ? '#f8fafc' : 'white';
            doc.fillColor(bgColor).rect(50, currentY, colWidth, rowHeight).fill();
            doc.fillColor(bgColor).rect(250, currentY, colWidth, rowHeight).fill();
            doc.fillColor('black').fontSize(10).font('Helvetica').text(label, 60, currentY + 7);
            doc.fillColor('black').fontSize(10).font('Helvetica').text(amount.toLocaleString('fr-FR'), 260, currentY + 7);
            currentY += rowHeight;
        };
        drawRow('Salaire Brut', payslip.gross, false);
        // drawRow('Déductions', payslip.deductions || 0, true);
        drawRow('Net à Payer', payslip.netPayable, false);
        drawRow('Montant Payé', payslip.paidAmount || 0, true);
        // Total row
        doc.fillColor(primaryColor).rect(50, currentY, colWidth, rowHeight).fill();
        doc.fillColor(primaryColor).rect(250, currentY, colWidth, rowHeight).fill();
        doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text('SOLDE RESTANT', 60, currentY + 7);
        doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text((payslip.netPayable - payslip.paidAmount).toLocaleString('fr-FR'), 260, currentY + 7);
        doc.y = currentY + rowHeight + 20;
        // Status section
        doc.moveDown(1);
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('STATUT DU BULLETIN');
        doc.moveDown(0.5);
        const statusColor = payslip.status === 'PAID' ? '#16a34a' : payslip.status === 'PENDING' ? '#ca8a04' : '#dc2626';
        doc.fillColor(statusColor).fontSize(11).font('Helvetica-Bold').text(payslip.status === 'PAID' ? 'PAYÉ' : payslip.status === 'PENDING' ? 'EN ATTENTE' : 'NON PAYÉ');
        // Footer
        doc.moveDown(2);
        const footerY = doc.page.height - 100;
        doc.y = Math.max(doc.y, footerY);
        doc.strokeColor(secondaryColor).lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fillColor(secondaryColor).fontSize(8).font('Helvetica').text('Ce document est généré automatiquement par le système de gestion des salaires.', { align: 'center' });
        doc.text(`Bulletin #${payslipId} - Généré le ${currentDate}`, { align: 'center' });
        doc.end();
        // Update payslip with pdfPath
        await this.updatePayslip(payslipId, { pdfPath });
        return pdfPath;
    }
}
//# sourceMappingURL=PayslipService.js.map