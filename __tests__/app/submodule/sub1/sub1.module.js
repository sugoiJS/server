"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
const sub1_controller_1 = require("./sub1.controller");
const sub1_service_1 = require("./sub1.service");
const sub2_module_1 = require("./sub2/sub2.module");
let Sub1Module = class Sub1Module {
    constructor(sub1Service) {
        this.sub1Service = sub1Service;
    }
    onLoad() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.sub1Service.setDate();
                resolve();
            }, 1000);
        });
    }
};
Sub1Module = __decorate([
    index_1.ServerModule({
        controllers: [sub1_controller_1.Sub1Controller],
        services: [sub1_service_1.Sub1Service],
        modules: [sub2_module_1.Sub2Module]
    }),
    __metadata("design:paramtypes", [sub1_service_1.Sub1Service])
], Sub1Module);
exports.Sub1Module = Sub1Module;
