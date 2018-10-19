"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
const parameters_validator_util_1 = require("./parameters-validator.util");
const policy_error_exception_1 = require("@sugoi/core/dist/policies/exceptions/policy-error.exception");
const exceptions_constant_1 = require("../constants/exceptions.constant");
class AuthorizationUtils {
    static isAuthorized(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                permissions: args.policyMeta[0].permissions,
                requiredRole: args.policyMeta[0].requiredRole
            };
            const request = Array.isArray(args.functionArgs) ? parameters_validator_util_1.ParametersValidatorUtil.getRequestFromArgs(args.functionArgs) : null;
            let provider;
            if (request) {
                provider = request["AuthProvider"];
            }
            if (!request || !provider)
                throw new policy_error_exception_1.SugoiPolicyError("Unable to get provider", 5005);
            payload["request"] = request;
            return yield provider.isAuthenticated(request)
                .then((res) => {
                if (res != true)
                    throw new policy_error_exception_1.SugoiPolicyError("Not authenticated", exceptions_constant_1.EXCEPTIONS.POLICY_HANDLED_EXCEPTION.code);
                if (payload.requiredRole && !Array.isArray(payload.requiredRole))
                    payload.requiredRole = [payload.requiredRole];
                payload.requiredRole = payload.requiredRole;
                return payload.requiredRole && payload.requiredRole.length > 0
                    ? provider.isInRole(...payload.requiredRole)
                    : res;
            })
                .then((res) => {
                if (res != true)
                    throw new policy_error_exception_1.SugoiPolicyError("Not in role", exceptions_constant_1.EXCEPTIONS.POLICY_HANDLED_EXCEPTION.code, payload.requiredRole);
                if (payload.permissions && !Array.isArray(payload.permissions))
                    payload.permissions = [payload.permissions];
                payload.permissions = payload.permissions;
                return payload.permissions && payload.permissions.length > 0
                    ? provider.isAllowedTo(...payload.permissions)
                    : res;
            }).then((res) => {
                if (res != true)
                    throw new policy_error_exception_1.SugoiPolicyError("Doesn't have permissions", exceptions_constant_1.EXCEPTIONS.POLICY_HANDLED_EXCEPTION.code, ...payload.permissions);
                else
                    return true;
            })
                .catch(err => {
                if (err instanceof policy_error_exception_1.SugoiPolicyError && err.code === exceptions_constant_1.EXCEPTIONS.POLICY_HANDLED_EXCEPTION.code) {
                    delete err.code;
                    delete err.stack;
                    return err;
                }
                else {
                    console.error(err);
                    throw err;
                }
            });
        });
    }
}
__decorate([
    core_1.Policy("SugIsAuthorized"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthorizationUtils, "isAuthorized", null);
exports.AuthorizationUtils = AuthorizationUtils;
