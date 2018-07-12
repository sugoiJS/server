"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var ContainerService = /** @class */ (function () {
    function ContainerService() {
    }
    ContainerService.registerContainer = function () {
        var repos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            repos[_i] = arguments[_i];
        }
        repos.forEach(function (repo) {
            ContainerService.container.bind(repo.symbol).to(repo.dep);
        });
        return ContainerService.container;
    };
    ContainerService.getRepo = function (Class) {
        return ContainerService.container.get(Class);
    };
    ContainerService.container = new inversify_1.Container({ defaultScope: "Singleton", autoBindInjectable: true });
    return ContainerService;
}());
exports.ContainerService = ContainerService;
