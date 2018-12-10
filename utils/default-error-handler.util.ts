import {Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import {GenericError} from "../classes/generic-error.class";


export const defaultErrorHandler = (development: boolean = true): ErrorRequestHandler => {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (!development) {
            console.error(err.stack);
            delete err.stack;
        }

        if (err instanceof GenericError) {
            res.status(400).json(err);
        }
        else {
            sendRes(res, cloneError(err))
        }
        return next();
    }
};

function cloneError(error: any): GenericError {
    let code = error.status || error.code || 500;
    const data = "data" in error && error.data ? error.data : [];
    const err = new GenericError(error.message, code, data);
    err.stack = error.stack;
    return err;
}

function sendRes(res: Response, err: GenericError) {
    res.status(err.code).send(err);
}


