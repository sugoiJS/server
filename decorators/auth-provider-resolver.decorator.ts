import {RESOLVERS_KEYS} from "../constants/meta-key";
import {ParametersValidatorUtil} from "../utils/parameters-validator.util";
import {AuthProvider} from "../classes/auth-provider.class";

export function AuthProviderResolver() {
    return function (target: Object, propertyKey: string, index: number) {
        let list = Reflect.getOwnMetadata(RESOLVERS_KEYS.ALL_RESOLVERS, target, propertyKey);
        let overridden = true;
        if (!list) {
            overridden = false;
            list = {};
        }
        list[RESOLVERS_KEYS.AUTH_PROVIDER] = list[RESOLVERS_KEYS.AUTH_PROVIDER] || [];
        list[RESOLVERS_KEYS.AUTH_PROVIDER].push(index);
        Reflect.defineMetadata(RESOLVERS_KEYS.AUTH_PROVIDER, list, target, propertyKey);
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (!overridden) {
            const next = descriptor.value;
            descriptor.value = function (...args) {
                const request = ParametersValidatorUtil.getRequestFromArgs(args);
                const meta = Reflect.getOwnMetadata(RESOLVERS_KEYS.ALL_RESOLVERS, target, propertyKey);
                for (let key of meta){
                    meta[key].forEach(index=>{
                        args[index] = resolveProperty(key,request);
                    })
                }
                next.apply(this, args);
            }
        }
    }
}

function resolveProperty(property, request){
    let resolved = null;
    switch (property){
        case RESOLVERS_KEYS.AUTH_PROVIDER:
            resolved = request['AuthProvider'] as AuthProvider;
            break;
        default:
            break;
    }
    return resolved;
}