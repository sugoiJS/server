import { SugoiError } from "@sugoi/core";
/**
 * Exceptions for Sugoi server
 */
export declare class SugoiServerError extends SugoiError {
    constructor(message: string, code: number, data?: any);
}
