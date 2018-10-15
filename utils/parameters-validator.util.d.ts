import { TComparableSchema } from "@sugoi/core";
export declare class ParametersValidatorUtil {
    static validateRequest(args: {
        functionArgs: any[];
        policyMeta: [{
            params: TComparableSchema;
            query: TComparableSchema;
            body: TComparableSchema;
            headers: TComparableSchema;
        }];
    }): true | any;
    static getRequestFromArgs(args: any): any;
}
