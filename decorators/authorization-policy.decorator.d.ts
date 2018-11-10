export declare type TStringOrNumber = string | number;
export declare const Authorized: (requiredRole?: string | number | (string | number)[], permissions?: string | number | (string | number)[], failedCode?: number) => (contextClass: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
