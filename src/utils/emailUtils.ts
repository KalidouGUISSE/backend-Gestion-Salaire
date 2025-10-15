import * as nodemailer from 'nodemailer';

export class EmailUtils {
    private static transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    static async sendQREmail(to: string, qrCodePath: string, employeeName: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject: 'Votre QR Code pour les paiements',
            html: `
                <h2>Bonjour ${employeeName},</h2>
                <p>Votre compte employé a été créé avec succès.</p>
                <p>Voici votre QR code personnel pour valider les paiements :</p>
                <img src="cid:qrCode" alt="QR Code" />
                <p>Instructions :</p>
                <ul>
                    <li>Présentez ce QR code lors de vos paiements.</li>
                    <li>Le scanner validera automatiquement votre identité.</li>
                </ul>
                <p>Cordialement,<br>L'équipe de gestion des salaires</p>
            `,
            attachments: [
                {
                    filename: 'qr_code.png',
                    path: qrCodePath,
                    cid: 'qrCode' // same cid value as in the html img src
                }
            ]
        };

        await this.transporter.sendMail(mailOptions);
    }
}