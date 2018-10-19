import {IModuleMetadata} from "../interfaces/module-meta.interface";
import {ModuleMetaKey} from "../constants/meta-key";
import {decorate,Injectable} from "@sugoi/core"

/**
 * Decorator @SugModule, register controllers, services and modules which
 * load by this module
 *
 * @param {IModuleMetadata} metadata
 * @param {string} namespaceKey
 * @returns {(item: any) => any}
 * @constructor
 */
const ServerModule = function(metadata?: IModuleMetadata,namespaceKey:string = ModuleMetaKey) {
    return function (item:any) {
        Reflect.defineMetadata(namespaceKey, metadata, item);
        decorate(Injectable(),item)
    }
};
export {ServerModule};

