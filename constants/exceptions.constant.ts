import {IExceptionConstant} from "@sugoi/core";

export const EXCEPTIONS: { [prop: string]: IExceptionConstant } = {
    INVALID_MODULE_META: {code: 5000,message: "modules must be annotated with @SugModule"},
    INVALID_NAMESPACE: {code: 5001,message: "Namespace not found"},
    GENERAL_SERVER_ERROR: {code: 5002,message: "Server error"},
    POLICY_BLOCKED: {code: 400,message: "Request blocked by resource policy"},
    INVALID_POLICY: {code: 500,message: "Decorate Policy use on property which is not a function"}
};