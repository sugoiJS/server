import {interfaces} from "inversify-express-utils";
import {Injectable} from "@sugoi/core";
import e = require("express");
import {TStringOrNumber} from "../decorators/authorization-policy.decorator";

@Injectable()
export abstract class AuthProvider<T=any> implements interfaces.AuthProvider {
    static Counter:number = 1;
    cookies: any;
    headers: any;
    details: any;
    test: any;

    public setRequestData(request: e.Request) {
        this.headers = request.headers;
        this.cookies = request.cookies;
        return this;
    }

    abstract isAuthenticated(): Promise<boolean>;

    abstract isResourceOwner(resourceId: any, resourceType?: any, ...args: any[]): Promise<boolean>;

    abstract getUser(req: e.Request, res: e.Response, next: e.NextFunction): Promise<any>;

    abstract isInRole(...roles: TStringOrNumber[]): Promise<boolean>;

    abstract isAllowedTo(...permissions: Array<string | number>): Promise<boolean>;

    getUserData(): Promise<T> {
        return Promise.resolve(this.details);
    }
    setUserData(userData: T): void {
        this.details = userData;
    }

    static builder(test?:any) {
        return new (<any>this)(test);
    }
}