import {TComparableSchema, UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export const RequestSchemaPolicy = function (paramSchema: TComparableSchema = null,
                                             queryParamSchema: TComparableSchema = null,
                                             bodySchema: TComparableSchema = null,
                                             headerSchema: TComparableSchema = null) {
    return UsePolicy('ParametersValidatorUtil.validateRequest', 400, paramSchema, queryParamSchema, bodySchema, headerSchema);

}