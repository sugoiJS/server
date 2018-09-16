import {interfaces} from "inversify-express-utils";
import * as e from "express";
import {TNewable} from "../interfaces/newable.type";
import {Injectable} from "@sugoi/core";

@Injectable()
export abstract class AuthProvider<T=any> implements interfaces.AuthProvider, interfaces.Principal {
    details: any;

    abstract isAuthenticated(req?: e.Request): Promise<boolean>;

    abstract isResourceOwner(resourceId: any): Promise<boolean>;

    abstract getUser(req: e.Request, res: e.Response, next: e.NextFunction): Promise<any>;

    abstract isInRole(role: string | number): Promise<boolean>;

    abstract isAllowedTo(...permissions: Array<string | number>): Promise<boolean>;

    getUserData(): Promise<T> {
        return Promise.resolve(this.details);
    }

    setUserData(userData:T): void {
        this.details = userData;
    }
}