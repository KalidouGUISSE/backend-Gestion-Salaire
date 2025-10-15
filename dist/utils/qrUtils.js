import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
export class QRUtils {
    static qrDir = path.join(process.cwd(), 'uploads', 'qr_codes');
    static async generateQRToken() {
        return randomUUID();
    }
    static async generateQRCode(data) {
        // Ensure directory exists
        if (!fs.existsSync(this.qrDir)) {
            fs.mkdirSync(this.qrDir, { recursive: true });
        }
        // Use UUID for filename to avoid long names
        const fileId = randomUUID();
        const fileName = `qr_${fileId}.png`;
        const filePath = path.join(this.qrDir, fileName);
        // Generate QR code with the data as content
        await QRCode.toFile(filePath, data, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        // Return relative path for database storage
        return path.relative(process.cwd(), filePath);
    }
}
//# sourceMappingURL=qrUtils.js.map