import {interfaces} from "inversify-express-utils";
import * as e from "express";

export abstract class AuthProvider<T=any> implements interfaces.AuthProvider, interfaces.Principal {
    details: any;

    constructor() {
        return this;
    }


    abstract isAuthenticated(req?:e.Request): Promise<boolean>;

    abstract isResourceOwner(resourceId: any): Promise<boolean>;

    abstract getUser(req: e.Request, res: e.Response, next: e.NextFunction): Promise<interfaces.Principal>;

    abstract isInRole(role: string): Promise<boolean>;

    getUserData(): Promise<T> {
        return Promise.resolve(this.details);
    }

}