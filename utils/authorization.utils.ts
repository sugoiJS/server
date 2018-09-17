import {Policy} from "@sugoi/core";
import {ParametersValidatorUtil} from "./parameters-validator.util";
import {SugoiPolicyError} from "@sugoi/core/dist/policies/exceptions/policy-error.exception";
import {AuthProvider} from "../classes/auth-provider.class";


export class AuthorizationUtils {

    @Policy()
    static isAuthorized(args: {
        functionArgs: any[],
        policyMeta: [{ requiredRole: string | number, permissions: Array<string | number> }]
    }): Promise<boolean> {


        const payload = {
            permissions: args.policyMeta[0].permissions,
            requiredRole: args.policyMeta[0].requiredRole
        };
        const request = Array.isArray(args.functionArgs) ? ParametersValidatorUtil.getRequestFromArgs(args.functionArgs) : null;
        let provider;
        if(request){
            provider = request["AuthProvider"];
        }
        if(!request || !provider)
            throw new SugoiPolicyError("Unable to get provider", 5005);
        payload["request"] = request;
        return provider.isAuthenticated(request)
            .then((res) => {
                if(!res) return "Not authenticated";
                return payload.requiredRole != null
                    ? provider.isInRole(payload.requiredRole)
                    : res
            })
            .then((res) => {
                if(!res) return "Not in role";
                return payload.permissions && payload.permissions.length > 0
                    ? provider.isAllowedTo(...payload.permissions)
                    :res;
            }).then((res) => {
                if(!res) return "Don't have permissions";
                else return true;
            })
            .catch(err=>{
                console.log(err);
                return false;
            })
    }

}