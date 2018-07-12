"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContainerRepo = /** @class */ (function () {
    function ContainerRepo(dep, bindName) {
        if (bindName === void 0) { bindName = dep.constructor.name; }
        this.symbol = Symbol(bindName);
        this.dep = dep;
    }
    ContainerRepo.builder = function (dep, bindName) {
        return new ContainerRepo(dep, bindName);
    };
    return ContainerRepo;
}());
exports.ContainerRepo = ContainerRepo;
