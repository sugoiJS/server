import {TComparableSchema, UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export const RequestSchemaPolicy = function (paramSchema: TComparableSchema = null,
                                             queryParamSchema: TComparableSchema = null,
                                             bodySchema: TComparableSchema = null,
                                             headersSchema: TComparableSchema = null) {
    return UsePolicy('ParametersValidatorUtil.validateRequest', 400, {params:paramSchema, query:queryParamSchema, body:bodySchema, headers:headersSchema});

}