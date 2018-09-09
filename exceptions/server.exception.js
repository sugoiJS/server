"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sugoi/core");
/**
 * Exceptions for Sugoi server
 */
var SugoiServerError = /** @class */ (function (_super) {
    __extends(SugoiServerError, _super);
    function SugoiServerError(message, code, data) {
        return _super.call(this, message, code, data) || this;
    }
    return SugoiServerError;
}(core_1.SugoiError));
exports.SugoiServerError = SugoiServerError;
