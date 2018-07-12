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
var SugoiError = /** @class */ (function (_super) {
    __extends(SugoiError, _super);
    function SugoiError(message, code, data) {
        if (data === void 0) { data = []; }
        var _this = _super.call(this, message) || this;
        _this.data = [];
        _this.code = code;
        if (!Array.isArray(data)) {
            data = [data];
        }
        _this.data.push.apply(_this.data, data);
        console.error("Error: " + _this.code + " - " + _this.message + " - " + _this.data);
        _this.stack = new Error().stack;
        return _this;
    }
    return SugoiError;
}(Error));
exports.SugoiError = SugoiError;
