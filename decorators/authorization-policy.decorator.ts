import {UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

const AuthorizationPolicy = function (requiredRole = null) {

    return UsePolicy('ParametersValidatorUtil.validateRequest', 400, {requiredRole});
};