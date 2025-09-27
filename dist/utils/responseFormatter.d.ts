import { HttpStatus } from "../enums/httpStatus.js";
import { Message, KEY } from "../enums/Message.js";
export declare const formatSuccess: (data: object | null, code?: HttpStatus, message?: string) => {
    data: object | null;
    statut: string;
    code: HttpStatus;
    message: string;
};
export declare const formatError: (code: number, message: string) => {
    data: null;
    statut: string;
    code: number;
    message: string;
};
export declare function buildMessage(key: KEY, message: Message): string;
//# sourceMappingURL=responseFormatter.d.ts.map