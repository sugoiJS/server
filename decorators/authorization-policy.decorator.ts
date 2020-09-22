import {UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export type TStringOrNumber = string | number;

export const HasRole = function (...requiredRoles: TStringOrNumber[]){
    return Authorized(requiredRoles);
};

export const HasPermissions = function (...permissions: TStringOrNumber[]){
    return Authorized(null, permissions);
};

export const Authorized = function (requiredRole: TStringOrNumber|TStringOrNumber[] = null, permissions: TStringOrNumber|TStringOrNumber[] = null, failedCode: number = 401) {

    return UsePolicy("SugIsAuthorized", failedCode, {requiredRole,permissions});
};