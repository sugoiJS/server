import {TComparableSchema, UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export function RequestSchemaPolicy(paramSchema: TComparableSchema);
export function RequestSchemaPolicy(paramSchema: TComparableSchema, queryParamSchema: TComparableSchema);
export function RequestSchemaPolicy(paramSchema: TComparableSchema, queryParamSchema: TComparableSchema, bodySchema: TComparableSchema);
export function RequestSchemaPolicy(paramSchema: TComparableSchema, queryParamSchema: TComparableSchema, bodySchema: TComparableSchema, headersSchema: TComparableSchema);
export function RequestSchemaPolicy(paramSchema: TComparableSchema = null,
                                    queryParamSchema: TComparableSchema = null,
                                    bodySchema: TComparableSchema = null,
                                    headersSchema: TComparableSchema = null) {
    return UsePolicy('ParametersValidatorUtil.validateRequest', 400, {
        params: paramSchema,
        query: queryParamSchema,
        body: bodySchema,
        headers: headersSchema
    });

};

export const RequestParamsSchemaPolicy = function (schema: TComparableSchema) {
    return RequestSchemaPolicy(schema);
};

export const RequestQueryParamsSchemaPolicy = function (schema: TComparableSchema) {
    return RequestSchemaPolicy(null, schema);
};

export const RequestBodySchemaPolicy = function (schema: TComparableSchema) {
    return RequestSchemaPolicy(null, null, schema);
};

export const RequestHeadersSchemaPolicy = function (schema: TComparableSchema) {
    return RequestSchemaPolicy(null, null, null, schema);
};