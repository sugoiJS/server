"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
/**
 * Exceptions for Sugoi server
 */
class SugoiServerError extends core_1.SugoiError {
    constructor(message, code, data) {
        super(message, code, data);
    }
}
exports.SugoiServerError = SugoiServerError;
