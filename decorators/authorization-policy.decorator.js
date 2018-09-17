"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sugoi/core");
exports.Authorized = function (requiredRole, permissions, failedCode) {
    if (requiredRole === void 0) { requiredRole = null; }
    if (permissions === void 0) { permissions = null; }
    if (failedCode === void 0) { failedCode = 401; }
    return core_1.UsePolicy("SugIsAuthorized", failedCode, { requiredRole: requiredRole });
};
