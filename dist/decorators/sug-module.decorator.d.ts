import { IModuleMetadata } from "../interfaces/module-meta.interface";
/**
 * Decorator @SugModule, register controllers, services and modules which
 * load by this module
 *
 * @param {IModuleMetadata} metadata
 * @param {string} metaKey
 * @returns {(item: any) => any}
 * @constructor
 */
declare const SugModule: (metadata: IModuleMetadata, metaKey?: string) => (item: any) => void;
export { SugModule };
