"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sugoi/core");
exports.RequestSchemaPolicy = function (paramSchema, queryParamSchema, bodySchema, headerSchema) {
    if (paramSchema === void 0) { paramSchema = null; }
    if (queryParamSchema === void 0) { queryParamSchema = null; }
    if (bodySchema === void 0) { bodySchema = null; }
    if (headerSchema === void 0) { headerSchema = null; }
    return core_1.UsePolicy('ParametersValidatorUtil.validateRequest', 400, paramSchema, queryParamSchema, bodySchema, headerSchema);
};
