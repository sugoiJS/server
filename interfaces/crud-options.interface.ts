import { TStringOrNumber } from "../decorators/authorization-policy.decorator";

export interface ICRUDOptions{
    endpoint?: string;
    authorized?: boolean;
    permissions?: TStringOrNumber[]; 
    roles?: TStringOrNumber[];
}