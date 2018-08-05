import {Guard,TGuadian} from "../classes/guard.class";

const Guardian = function(bodySchema:{[property:string]:any},
                          paramsSchema:{[parameter:string]:any},
                          queryParamsSchema:{[parameter:string]:any},
                          guardName?:string) {
    return function (guardianFunction: TGuadian,
                     propertyKey: string,
                     descriptor: PropertyDescriptor){
        Guard.addGuardian(new Guard(guardianFunction,guardName));
    }
};

const Guarded = function(guardian: Function|string){
    return async function (target: Object) {
        const name = typeof guardian === "function"
            ? guardian.constructor.name
            : guardian;
        const guard = Guard.getGuardian(name);
        return await guard(target);
    }
};

export {Guardian,Guarded}