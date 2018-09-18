"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sugoi/core");
exports.RequestSchemaPolicy = function (paramSchema, queryParamSchema, bodySchema, headersSchema) {
    if (paramSchema === void 0) { paramSchema = null; }
    if (queryParamSchema === void 0) { queryParamSchema = null; }
    if (bodySchema === void 0) { bodySchema = null; }
    if (headersSchema === void 0) { headersSchema = null; }
    return core_1.UsePolicy('ParametersValidatorUtil.validateRequest', 400, { params: paramSchema, query: queryParamSchema, body: bodySchema, headers: headersSchema });
};
