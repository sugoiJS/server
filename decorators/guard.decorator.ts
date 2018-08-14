import {Guard} from "../classes/guard.class";
import {SugoiServerError} from "../exceptions/server.exception";
import {EXCEPTIONS} from "../constants/exceptions.constant";

const POLICY_META_KEY = "POLICY";

const Policy = function (policyName?: string) {
    return function (policyClass: any,
                     propertyKey: string,
                     descriptor: PropertyDescriptor) {
        if(typeof descriptor.value !== "function"){
            throw new SugoiServerError(EXCEPTIONS.INVALID_POLICY.message,EXCEPTIONS.INVALID_POLICY.code,propertyKey);
        }
        policyName = policyName || `${policyClass.constructor.name}.${propertyKey}`;
        Guard.addGuardian(new Guard(descriptor.value, policyName));
    }
};

const UsePolicy = function (guardian: string,
                          bodySchema?: { [property: string]: any },
                          paramsSchema?: { [parameter: string]: any },
                          queryParamsSchema?: { [parameter: string]: any }) {
    return function (guardedClass: any,
                     propertyKey: string,
                     descriptor: PropertyDescriptor) {
        const guardians =[];
        propertyKey = !!propertyKey ? propertyKey : null;
        const contextGuardians = Reflect.getMetadata(POLICY_META_KEY,guardedClass,propertyKey) || [];
        contextGuardians.push(guardian);
        const contextGuardiansSet = new Set(contextGuardians);
        guardians.push.apply(guardians,Array.from(contextGuardiansSet));
        Reflect.defineMetadata(POLICY_META_KEY,guardians,guardedClass,propertyKey);
        const next = descriptor.value;
        descriptor.value = async function (...args) {
            const that = this;
            const req = args[0];
            const res = args[1];
            const guards = Reflect.getMetadata(POLICY_META_KEY, guardedClass,propertyKey)||[];
            const promises = guards.map(guardName=>{
                const guard = Guard.getGuardian(guardName);
                if(!guard){
                    return Promise.resolve();
                }
                const args = [{values:req.body,schema:bodySchema},{values:req.params,schema:paramsSchema},{values:req.query,schema:queryParamsSchema}];
                return guard.call(that,...args)
                    .then((res)=>{
                        if(res != true){
                            throw new SugoiServerError(EXCEPTIONS.GUARDIAN_BLOCK.message,EXCEPTIONS.GUARDIAN_BLOCK.code,[guardName,res])
                        }
                    });
            });
            return await Promise.all(promises)
                .then(()=>{
                    next();
                })
                .catch((err)=>{
                    return err;
                })
        };

    }
};

export {Policy, UsePolicy}