import {interfaces} from "inversify-express-utils";
import {Request,Response,NextFunction} from "express";

export class AuthProvider implements interfaces.AuthProvider, interfaces.Principal{
    details: any;

    constructor(){
        return this;
    }

    isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }

    isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(true);
    }

    isInRole(role: string): Promise<boolean> {
        return Promise.resolve(true);
    }
    getUser(req: Request, res: Response, next: NextFunction): Promise<interfaces.Principal> {
        return Promise.resolve(new AuthProvider());
    }
}