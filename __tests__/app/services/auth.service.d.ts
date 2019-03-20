import { AuthProvider } from "../../../index";
import * as e from "express";
export declare class AuthService extends AuthProvider {
    isAuthenticated(): Promise<boolean>;
    isResourceOwner(resourceId: any): Promise<boolean>;
    resolveUser(req?: e.Request): Promise<any>;
    getUser(req: e.Request, res: e.Response, next: e.NextFunction): Promise<any>;
    isInRole(...roles: (string | number)[]): Promise<boolean>;
    isAllowedTo(...permissions: (string | number)[]): Promise<boolean>;
}
