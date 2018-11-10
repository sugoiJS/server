"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
class AuthService extends index_1.AuthProvider {
    isAuthenticated() {
        return Promise.resolve(this.headers['x-sug-auth'] != null);
    }
    isResourceOwner(resourceId) {
        return Promise.resolve(this.headers['x-sug-auth'] == resourceId);
    }
    resolveUser(req) {
        return this.getUser(req, null, null);
    }
    getUser(req, res, next) {
        if (!this.details)
            this.setUserData({ name: "me" });
        return Promise.resolve(this.getUserData());
    }
    isInRole(...roles) {
        return Promise.resolve().then(_ => {
            return roles.every((role) => role % 2 === 0);
        });
    }
    isAllowedTo(...permissions) {
        return Promise.resolve().then(_ => {
            return permissions.every((permission) => permission % 2 === 0);
        });
    }
}
exports.AuthService = AuthService;
