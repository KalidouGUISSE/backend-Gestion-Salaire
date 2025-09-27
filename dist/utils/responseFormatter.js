import { HttpStatus } from "../enums/httpStatus.js";
import { Message, KEY } from "../enums/Message.js";
export const formatSuccess = (data, code = HttpStatus.OK, message = "ok") => ({
    data, statut: "success", code, message
});
export const formatError = (code, message) => ({
    data: null, statut: "error", code, message
});
export function buildMessage(key, message) {
    return `${key} ${message}`;
}
//# sourceMappingURL=responseFormatter.js.map