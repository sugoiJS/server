import {UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export type TStringOrNumber = string | number;
export const Authorized = function (requiredRole: TStringOrNumber|TStringOrNumber[] = null, permissions: TStringOrNumber|TStringOrNumber[] = null, failedCode: number = 401) {

    return UsePolicy("SugIsAuthorized", failedCode, {requiredRole,permissions});
};