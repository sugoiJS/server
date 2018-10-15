"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
exports.RequestSchemaPolicy = function (paramSchema = null, queryParamSchema = null, bodySchema = null, headersSchema = null) {
    return core_1.UsePolicy('ParametersValidatorUtil.validateRequest', 400, { params: paramSchema, query: queryParamSchema, body: bodySchema, headers: headersSchema });
};
