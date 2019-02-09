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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
class ParametersValidatorUtil {
    static validateRequest(args) {
        const schemaMap = args.policyMeta[0];
        const request = ParametersValidatorUtil.getRequestFromArgs(args.functionArgs);
        let validationValue = null;
        const valid = Object.keys(schemaMap).every(key => {
            if (!schemaMap[key])
                return true;
            validationValue = core_1.ValidateSchemaUtil.ValidateSchema(request[key], schemaMap[key]);
            return validationValue.valid;
        });
        return valid ? valid : validationValue;
    }
    static getRequestFromArgs(args) {
        return args.find(arg => arg && arg.constructor && arg.constructor.name === 'IncomingMessage');
    }
}
__decorate([
    core_1.Policy(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ParametersValidatorUtil, "validateRequest", null);
exports.ParametersValidatorUtil = ParametersValidatorUtil;
