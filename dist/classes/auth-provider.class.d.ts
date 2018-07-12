/// <reference types="express" />
import { interfaces } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
export declare class AuthProvider implements interfaces.AuthProvider, interfaces.Principal {
    details: any;
    constructor();
    isAuthenticated(): Promise<boolean>;
    isResourceOwner(resourceId: any): Promise<boolean>;
    isInRole(role: string): Promise<boolean>;
    getUser(req: Request, res: Response, next: NextFunction): Promise<interfaces.Principal>;
}
