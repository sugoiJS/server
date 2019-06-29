import {Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import {GenericError} from "../classes/generic-error.class";


export const defaultErrorHandler = (returnErrorStack: boolean = true): ErrorRequestHandler => {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (!returnErrorStack) {
            console.error(err.stack);
            delete err.stack;
        }

        if (err instanceof GenericError) {
            res.status(400).json(err);
        }
        else {
            sendRes(res, cloneError(err, false))
        }
        return next();
    }
};

function cloneError(error: any, verbose: boolean = true): GenericError {
    let code = error.status || error.code || 500;
    const data = "data" in error && error.data ? error.data : [];
    const err = new GenericError(error.message, code, data, verbose);
    err.stack = error.stack;
    return err;
}

function sendRes(res: Response, err: GenericError) {
    res.status(err.code).send(err);
}


