import {TComparableSchema,UsePolicy} from "@sugoi/core";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export const RequestSchemaPolicy = function (paramSchema: TComparableSchema,
                                             queryParamSchema: TComparableSchema,
                                             bodySchema: TComparableSchema,
                                             headerSchema:TComparableSchema
                                             ){
    return UsePolicy('ParametersValidatorUtil.validateRequest',400,paramSchema,queryParamSchema,bodySchema,headerSchema);

}