import { HttpStatus } from "../enums/httpStatus.js";
import { Message,KEY } from "../enums/Message.js";

export const formatSuccess = (data: object | null, code = HttpStatus.OK, message = "ok") => ({
  data, statut: "success", code, message
});

export const formatError = (code: number, message: string) => ({
  data: null, statut: "error", code, message
});

export function buildMessage(key: KEY, message: Message): string {
  return `${key} ${message}`;
}