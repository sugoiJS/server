"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_error_class_1 = require("../classes/generic-error.class");
exports.defaultErrorHandler = (returnErrorStack = true) => {
    return (err, req, res, next) => {
        if (!returnErrorStack) {
            console.error(err.stack);
            delete err.stack;
        }
        if (err instanceof generic_error_class_1.GenericError) {
            res.status(400).json(err);
        }
        else {
            sendRes(res, cloneError(err));
        }
        return next();
    };
};
function cloneError(error) {
    let code = error.status || error.code || 500;
    const data = "data" in error && error.data ? error.data : [];
    const err = new generic_error_class_1.GenericError(error.message, code, data);
    err.stack = error.stack;
    return err;
}
function sendRes(res, err) {
    res.status(err.code).send(err);
}
