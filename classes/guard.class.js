"use strict";
exports.__esModule = true;
var Guard = /** @class */ (function () {
    function Guard(validator, name) {
        if (name === void 0) { name = validator.constructor.name; }
        this.validator = validator;
        this.name = name;
    }
    Guard.addGuardian = function (guard) {
        Guard.guardians.set(guard.name, guard.validator);
    };
    Guard.getGuardian = function (guardName) {
        return Guard.guardians.get(guardName);
    };
    Guard.removeGuardian = function (guardName) {
        Guard.guardians["delete"](guardName);
    };
    Guard.guardians = new Map();
    return Guard;
}());
exports.Guard = Guard;
