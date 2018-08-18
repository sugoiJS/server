import {Policy} from "@sugoi/core";

export class ParametersValidatorUtil {
    private static ValidateSchemaUtil: any;

    @Policy()
    static validateRequest(args: { functionArgs: any[], policyMeta: any[] }) {
        const request = args.functionArgs.find(arg => arg.constructor.name === 'IncomingMessage');
        args.policyMeta.forEach(schema => {
            if (!schema) return;
            this.ValidateSchemaUtil.ValidateSchema(request, schema)

        })

    }
}