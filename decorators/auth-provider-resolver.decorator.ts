// import {decorate,injectable} from "@sugoi/core";
//
// export function AuthProviderResolver() {
//     return function (target: Object, propertyKey: string, index: number) {
//         decorate(resolve,target[propertyKey],index);
//     }
// }
// function resolve(target: Object, propertyKey: string | symbol, parameterIndex: number):void{
//
//         const next = descriptor.value;
//         descriptor.value = function (...args) {
//             const request = ParametersValidatorUtil.getRequestFromArgs(args);
//             for (let key of meta){
//                 meta[key].forEach(index=>{
//                     args[index] = resolveProperty(key,request);
//                 })
//             }
//             next.apply(this, args);
//         }
//         Object.defineProperty(target, propertyKey,);
// }
