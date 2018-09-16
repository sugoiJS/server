import {UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export const Authorized = function (requiredRole = null, failedCode: number = 401) {

    return UsePolicy("AuthorizationUtils.isAuthorized", failedCode, {requiredRole});
};