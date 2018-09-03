import {Policy, TComparableSchema, ValidateSchemaUtil} from "@sugoi/core";

export class ParametersValidatorUtil {
    @Policy()
    static validateRequest(args: {
        functionArgs: any[], policyMeta: [{
            params: TComparableSchema,
            query: TComparableSchema,
            body: TComparableSchema,
            headers: TComparableSchema
        }]
    }): true | any {
        const schemaMap = args.policyMeta[0];
        const request = ParametersValidatorUtil.getRequestFromArgs(args);
        let validationValue = null;
        const valid = Object.keys(schemaMap).every(key => {
            if (!schemaMap[key]) return true;
            validationValue = ValidateSchemaUtil.ValidateSchema(request[key], schemaMap[key]);
            return validationValue.valid;
        });

        return valid ? valid : validationValue;

    }

    static getRequestFromArgs(args){
        return args.functionArgs.find(arg => arg && arg.constructor && arg.constructor.name === 'IncomingMessage')
    }
}