import {AuthProvider} from "../../../index";
import * as e from "express";

export class AuthService extends AuthProvider {
    isAuthenticated(): Promise<boolean> {
        return Promise.resolve(this.headers['x-sug-auth'] != null);
    }

    isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(this.headers['x-sug-auth'] == resourceId);
    }

    resolveUser(req?: e.Request): Promise<any> {
        return this.getUser(req, null, null);
    }

    getUser(req: e.Request, res: e.Response, next: e.NextFunction): Promise<any> {
        if (!this.details)
            this.setUserData({name: "me"});
        return Promise.resolve(this.getUserData())
    }

    isInRole(...roles: (string | number)[]): Promise<boolean> {
        return Promise.resolve().then(_ => {
            return roles.every((role: number) => role % 2 === 0)
        })
    }

    isAllowedTo(...permissions: (string | number)[]): Promise<boolean> {
        return Promise.resolve().then(_ => {
            return permissions.every((permission: number) => permission % 2 === 0)
        })
    }

}