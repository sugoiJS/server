import {IExceptionConstant} from "@sugoi/core";

export const EXCEPTIONS: { [prop: string]: IExceptionConstant } = {
    INVALID_MODULE_META: {code: 5000,message: "modules must be annotated with @ServerModule"},
    INVALID_NAMESPACE: {code: 5001,message: "Namespace not found"},
    GENERAL_SERVER_ERROR: {code: 5002,message: "Server error"}
};