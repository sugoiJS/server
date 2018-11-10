"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResponseMessage = /** @class */ (function () {
    function ResponseMessage(message, data, timestamp) {
        if (data === void 0) { data = null; }
        if (timestamp === void 0) { timestamp = new Date(); }
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }
    return ResponseMessage;
}());
exports.ResponseMessage = ResponseMessage;
