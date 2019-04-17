import {UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export type TStringOrNumber = string | number;

export const HasRole = function (...requiredRole: TStringOrNumber[]){
    return Authorized(requiredRole);
};

export const HasPermission = function (...permissions: TStringOrNumber[]){
    return Authorized(null, permissions);
};

export const Authorized = function (requiredRole: TStringOrNumber|TStringOrNumber[] = null, permissions: TStringOrNumber|TStringOrNumber[] = null, failedCode: number = 401) {

    return UsePolicy("SugIsAuthorized", failedCode, {requiredRole,permissions});
};