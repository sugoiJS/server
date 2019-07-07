import { BaseMiddleware } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import { cast } from "@sugoi/core";

class castToMiddleware<T = any> extends BaseMiddleware{

    constructor(
        private property: 'body' | 'header',
        private classToCast: T,
        private options: ICastOptions = {},
        ){
        super();
    }

    handler(req: Request, res: Response, next: NextFunction): void {
        req[this.property] = cast(this.classToCast, req[this.property], this.options.applyConstructor);
        next();
    }

    
}

export interface ICastOptions {
    applyConstructor?: boolean;
}

export function castBodyTo<T = any>(classToCast: T, options?: ICastOptions){
    const middleware = new castToMiddleware('body', classToCast, options);
    return middleware.handler.bind(middleware);
}

export function castHeaderTo<T = any>(classToCast: T, options?: ICastOptions){
    const middleware = new castToMiddleware('header', classToCast, options);
    return middleware.handler.bind(middleware);
}