"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sugoi/core");
var AuthorizationPolicy = function (requiredRole) {
    if (requiredRole === void 0) { requiredRole = null; }
    return core_1.UsePolicy('ParametersValidatorUtil.validateRequest', 400, { requiredRole: requiredRole });
};
