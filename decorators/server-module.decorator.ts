import {IModuleMetadata} from "../interfaces/module-meta.interface";
import {ModuleMetaKey} from "../constants/meta-key";

/**
 * Decorator @SugModule, register controllers, services and modules which
 * load by this module
 *
 * @param {IModuleMetadata} metadata
 * @param {string} metaKey
 * @returns {(item: any) => any}
 * @constructor
 */
const ServerModule = function(metadata?: IModuleMetadata,metaKey:string = ModuleMetaKey) {
    return function (item:any) {
        Reflect.defineMetadata(metaKey, metadata, item);
    }
};
export {ServerModule};

