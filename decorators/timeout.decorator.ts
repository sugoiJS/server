/**
 * set a timeout for a request
 *
 * @param {int} ms - number of ms to wait before timeout
 * @constructor
 */
import {applyClassLevelDecorator} from "@sugoi/core/dist/utils/function.utils";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";

export function Timeout(ms: number, onTimeout?: (req, res) => void) {
    return function (target: any, property?: string, descriptor?: any) {
        if(!property){
            applyClassLevelDecorator(target,() => Timeout(ms, onTimeout))
        }else{
            const originalMethod = descriptor.value;
            descriptor.value = function(...args){
                timeoutSetter(ms, onTimeout,...args);
                return originalMethod.apply(target, args);
            };
            Object.defineProperty(target,property,descriptor)
        }
    }
}

function timeoutSetter(ms: number,callback: (request, response) => void, ...args) {
    const request = ParametersValidatorUtil.getRequestFromArgs(args);
    const response = ParametersValidatorUtil.getResponseFromArgs(args);
    if(!request){
        return;
    }
    request.setTimeout(ms);
    response.once('timeout', function(socket){ // errors caught in here
        callback(request,response);
        console.error("Request timed out");
        response.status(504).end()
    });
}
