import { TComparableSchema } from "@sugoi/core";
export declare const RequestSchemaPolicy: (paramSchema?: TComparableSchema, queryParamSchema?: TComparableSchema, bodySchema?: TComparableSchema, headersSchema?: TComparableSchema) => (contextClass: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
