import {SugoiError} from "@sugoi/core";

/**
 * Exceptions for Sugoi server
 */
export class SugoiServerError extends SugoiError {
    constructor(message: string, code: number,data?:any) {
        super(message,code,data);

    }
}