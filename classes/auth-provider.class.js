"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthProvider = /** @class */ (function () {
    function AuthProvider() {
        return this;
    }
    AuthProvider.prototype.isAuthenticated = function () {
        return Promise.resolve(true);
    };
    AuthProvider.prototype.isResourceOwner = function (resourceId) {
        return Promise.resolve(true);
    };
    AuthProvider.prototype.isInRole = function (role) {
        return Promise.resolve(true);
    };
    AuthProvider.prototype.getUser = function (req, res, next) {
        return Promise.resolve(new AuthProvider());
    };
    return AuthProvider;
}());
exports.AuthProvider = AuthProvider;
