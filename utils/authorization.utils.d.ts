import { TStringOrNumber } from "../decorators/authorization-policy.decorator";
export declare class AuthorizationUtils {
    static isAuthorized(args: {
        functionArgs: any[];
        policyMeta: [{
            requiredRole: TStringOrNumber | TStringOrNumber[];
            permissions: TStringOrNumber | TStringOrNumber[];
        }];
    }): Promise<boolean>;
}
