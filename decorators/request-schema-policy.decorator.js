"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
function RequestSchemaPolicy(paramSchema = null, queryParamSchema = null, bodySchema = null, headersSchema = null) {
    return core_1.UsePolicy('ParametersValidatorUtil.validateRequest', 400, {
        params: paramSchema,
        query: queryParamSchema,
        body: bodySchema,
        headers: headersSchema
    });
}
exports.RequestSchemaPolicy = RequestSchemaPolicy;
;
exports.RequestParamsSchemaPolicy = function (schema) {
    return RequestSchemaPolicy(schema);
};
exports.RequestQueryParamsSchemaPolicy = function (schema) {
    return RequestSchemaPolicy(null, schema);
};
exports.RequestBodySchemaPolicy = function (schema) {
    return RequestSchemaPolicy(null, null, schema);
};
exports.RequestHeadersSchemaPolicy = function (schema) {
    return RequestSchemaPolicy(null, null, null, schema);
};
