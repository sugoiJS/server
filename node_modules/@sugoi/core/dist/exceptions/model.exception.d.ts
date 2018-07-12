import { SugoiError } from "./sugoi-abstract.exception";
export declare class ModelException extends SugoiError {
    code: number;
    constructor(message: string, code: number, data?: any);
}
