import {Policy} from "@sugoi/core";
import {ParametersValidatorUtil} from "./parameters-validator.util";
import {SugoiPolicyError} from "@sugoi/core/dist/policies/exceptions/policy-error.exception";
import {AuthProvider} from "../classes/auth-provider.class";
import {EXCEPTIONS} from "../constants/exceptions.constant";
import {TStringOrNumber} from "../decorators/authorization-policy.decorator";


export class AuthorizationUtils {

    @Policy("SugIsAuthorized")
    static async isAuthorized(args: {
        functionArgs: any[],
        policyMeta: [{ requiredRole: TStringOrNumber| TStringOrNumber[], permissions: TStringOrNumber| TStringOrNumber[] }]
    }): Promise<boolean> {


        const payload = {
            permissions: args.policyMeta[0].permissions,
            requiredRole: args.policyMeta[0].requiredRole
        };
        const request = Array.isArray(args.functionArgs) ? ParametersValidatorUtil.getRequestFromArgs(args.functionArgs) : null;
        let provider;
        if (request) {
            provider = request["AuthProvider"];
        }
        if (!request || !provider)
            throw new SugoiPolicyError("Unable to get provider", 5005);
        payload["request"] = request;
        return await provider.isAuthenticated(request)
            .then((res) => {
                if (res != true) throw new SugoiPolicyError("Not authenticated", EXCEPTIONS.POLICY_HANDLED_EXCEPTION.code);
                if(payload.requiredRole && !Array.isArray(payload.requiredRole))
                    payload.requiredRole = [payload.requiredRole];
                payload.requiredRole = payload.requiredRole as TStringOrNumber[];
                return payload.requiredRole && payload.requiredRole.length > 0
                    ? provider.isInRole(...payload.requiredRole)
                    : res
            })
            .then((res) => {
                if (res != true) throw new SugoiPolicyError("Not in role", EXCEPTIONS.POLICY_HANDLED_EXCEPTION.code,payload.requiredRole);
                if(payload.permissions && !Array.isArray(payload.permissions))
                    payload.permissions = [payload.permissions] ;
                payload.permissions = payload.permissions as TStringOrNumber[];
                return payload.permissions && payload.permissions.length > 0
                    ? provider.isAllowedTo(...payload.permissions)
                    : res;
            }).then((res) => {
                if (res != true) throw new SugoiPolicyError("Doesn't have permissions", EXCEPTIONS.POLICY_HANDLED_EXCEPTION.code,...payload.permissions as TStringOrNumber[]);
                else return true;
            })
            .catch(err => {
                if (err instanceof SugoiPolicyError && err.code === EXCEPTIONS.POLICY_HANDLED_EXCEPTION.code) {
                    delete err.code;
                    delete err.stack;
                    return err
                }
                else {
                    console.error(err);
                    throw err;
                }

            })
    }

}