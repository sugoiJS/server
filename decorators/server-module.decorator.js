"use strict";
exports.__esModule = true;
var meta_key_1 = require("../constants/meta-key");
/**
 * Decorator @SugModule, register controllers, services and modules which
 * load by this module
 *
 * @param {IModuleMetadata} metadata
 * @param {string} metaKey
 * @returns {(item: any) => any}
 * @constructor
 */
var SugModule = function (metadata, metaKey) {
    if (metaKey === void 0) { metaKey = meta_key_1.ModuleMetaKey; }
    return function (item) {
        Reflect.defineMetadata(metaKey, metadata, item);
    };
};
exports.SugModule = SugModule;
