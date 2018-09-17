import { interfaces } from "inversify-express-utils";
import e = require("express");
export declare abstract class AuthProvider<T = any> implements interfaces.AuthProvider, interfaces.Principal {
    cookies: any;
    headers: any;
    details: any;
    setRequestData(request: e.Request): this;
    abstract isAuthenticated(): Promise<boolean>;
    abstract isResourceOwner(resourceId: any): Promise<boolean>;
    abstract getUser(req: e.Request, res: e.Response, next: e.NextFunction): Promise<any>;
    abstract isInRole(role: string | number): Promise<boolean>;
    abstract isAllowedTo(...permissions: Array<string | number>): Promise<boolean>;
    getUserData(): Promise<T>;
    setUserData(userData: T): void;
    static builder(): any;
}
