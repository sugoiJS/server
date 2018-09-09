"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthProvider = /** @class */ (function () {
    function AuthProvider() {
        return this;
    }
    AuthProvider.prototype.getUserData = function () {
        return Promise.resolve(this.details);
    };
    return AuthProvider;
}());
exports.AuthProvider = AuthProvider;
