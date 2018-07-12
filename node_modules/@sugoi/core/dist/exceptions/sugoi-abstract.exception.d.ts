export declare abstract class SugoiError extends Error {
    code: number;
    private data;
    constructor(message: string, code: number, data?: any);
}
