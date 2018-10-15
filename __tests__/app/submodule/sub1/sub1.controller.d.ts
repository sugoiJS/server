import { Sub1Service } from "./sub1.service";
export declare class Sub1Controller {
    private sub1Service;
    constructor(sub1Service: Sub1Service);
    test(): Promise<{
        message: string;
    }>;
}
