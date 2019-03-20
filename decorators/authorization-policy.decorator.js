"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
exports.Authorized = function (requiredRole = null, permissions = null, failedCode = 401) {
    return core_1.UsePolicy("SugIsAuthorized", failedCode, { requiredRole, permissions });
};
