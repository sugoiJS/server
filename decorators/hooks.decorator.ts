import {HTTP_METHOD} from "../constants/methods.constant";
import {appendAfterHook, appendBeforeHook, THookMiddleware} from "../utils/hooks.util";

export interface IHookOptions {
    priority?:number,
}


export function BeforeHook(path: string = "*", method: HTTP_METHOD = HTTP_METHOD.ALL, options: IHookOptions = {}) {
    return function (target: any, property: string, descriptor: any) {
        options.priority = options.priority || 0;
        Object.assign(options,{callback: descriptor.value.bind(target), identifier: `${target.name}.${property}`});
        appendBeforeHook(path, method, options as THookMiddleware);
    }
}

export function AfterHook(path: string = "*", method: HTTP_METHOD = HTTP_METHOD.ALL, options: IHookOptions = {}) {
    return function (target: any, property: string, descriptor: any) {
        options.priority = options.priority || 0;
        Object.assign(options,{callback: descriptor.value.bind(target), identifier: `${target.name}.${property}`});
        appendAfterHook(path, method, options as THookMiddleware);
    }
}

