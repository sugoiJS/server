export declare class AuthorizationUtils {
    static isAuthorized(args: {
        functionArgs: any[];
        policyMeta: [{
            requiredRole: string | number;
            permissions: Array<string | number>;
        }];
    }): Promise<boolean>;
}
