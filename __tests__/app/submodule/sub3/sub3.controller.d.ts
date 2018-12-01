export declare class Sub3Controller {
    private sub1Service;
    get(): {
        success: boolean;
    };
    getDate(): Promise<{
        date: Date;
    }>;
    notFound(): Promise<any>;
    serverError(): Promise<any>;
    unauthorized(): Promise<any>;
    forbidden(): Promise<any>;
    ok(): Promise<any>;
    badrequest(): Promise<any>;
}
