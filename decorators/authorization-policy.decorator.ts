import {UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export const Authorized = function (requiredRole: string | number = null, permissions: string | number[] = null, failedCode: number = 401) {

    return UsePolicy("SugIsAuthorized", failedCode, {requiredRole});
};