import { TComparableSchema } from "@sugoi/core";
export declare function RequestSchemaPolicy(paramSchema: TComparableSchema): any;
export declare function RequestSchemaPolicy(paramSchema: TComparableSchema, queryParamSchema: TComparableSchema): any;
export declare function RequestSchemaPolicy(paramSchema: TComparableSchema, queryParamSchema: TComparableSchema, bodySchema: TComparableSchema): any;
export declare function RequestSchemaPolicy(paramSchema: TComparableSchema, queryParamSchema: TComparableSchema, bodySchema: TComparableSchema, headersSchema: TComparableSchema): any;
export declare const RequestParamsSchemaPolicy: (schema: TComparableSchema) => any;
export declare const RequestQueryParamsSchemaPolicy: (schema: TComparableSchema) => any;
export declare const RequestBodySchemaPolicy: (schema: TComparableSchema) => any;
export declare const RequestHeadersSchemaPolicy: (schema: TComparableSchema) => any;
