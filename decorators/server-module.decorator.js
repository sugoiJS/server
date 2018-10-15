"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meta_key_1 = require("../constants/meta-key");
/**
 * Decorator @SugModule, register controllers, services and modules which
 * load by this module
 *
 * @param {IModuleMetadata} metadata
 * @param {string} namespaceKey
 * @returns {(item: any) => any}
 * @constructor
 */
const ServerModule = function (metadata, namespaceKey = meta_key_1.ModuleMetaKey) {
    return function (item) {
        Reflect.defineMetadata(namespaceKey, metadata, item);
    };
};
exports.ServerModule = ServerModule;
