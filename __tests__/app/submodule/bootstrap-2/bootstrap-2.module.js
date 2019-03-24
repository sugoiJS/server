"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_module_decorator_1 = require("../../../../decorators/server-module.decorator");
const bootstrap_2_service_1 = require("./bootstrap-2.service");
const bootstrap_2_controller_1 = require("./bootstrap-2.controller");
let Bootstrap2Module = class Bootstrap2Module {
};
Bootstrap2Module = __decorate([
    server_module_decorator_1.ServerModule({
        controllers: [bootstrap_2_controller_1.Bootstrap2Controller],
        services: [bootstrap_2_service_1.Bootstrap2Service]
    })
], Bootstrap2Module);
exports.Bootstrap2Module = Bootstrap2Module;
