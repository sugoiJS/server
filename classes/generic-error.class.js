"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
class GenericError extends core_1.SugoiError {
    printError() {
        return;
    }
}
exports.GenericError = GenericError;
