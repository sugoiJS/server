import { IModuleMetadata } from "../interfaces/module-meta.interface";
/**
 * Decorator @SugModule, register controllers, services and modules which
 * load by this module
 *
 * @param {IModuleMetadata} metadata
 * @param {string} namespaceKey
 * @returns {(item: any) => any}
 * @constructor
 */
declare const ServerModule: (metadata?: IModuleMetadata, namespaceKey?: string) => (item: any) => void;
export { ServerModule };
