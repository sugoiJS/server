"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const index_controller_1 = require("./controllers/index.controller");
const sub1_module_1 = require("./submodule/sub1/sub1.module");
const auth_service_1 = require("./services/auth.service");
const sub3_module_1 = require("./submodule/sub3/sub3.module");
let Bootstrap = class Bootstrap {
};
Bootstrap = __decorate([
    index_1.ServerModule({
        controllers: [index_controller_1.IndexController],
        services: [auth_service_1.AuthService],
        modules: [sub1_module_1.Sub1Module, sub3_module_1.Sub3Module]
    })
], Bootstrap);
exports.Bootstrap = Bootstrap;
