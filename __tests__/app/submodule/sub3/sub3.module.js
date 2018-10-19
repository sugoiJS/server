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
const sub3_controller_1 = require("./sub3.controller");
const index_1 = require("../../../../index");
const sub1_service_1 = require("../sub1/sub1.service");
const sub2_module_1 = require("../sub1/sub2/sub2.module");
const sub1_module_1 = require("../sub1/sub1.module");
let Sub3Module = class Sub3Module {
    constructor() {
    }
    onLoad() {
        console.log(this.sub1Service.date2);
    }
};
__decorate([
    index_1.Inject("Sub1Service"),
    __metadata("design:type", sub1_service_1.Sub1Service)
], Sub3Module.prototype, "sub1Service", void 0);
Sub3Module = __decorate([
    index_1.ServerModule({
        controllers: [sub3_controller_1.Sub3Controller],
        dependencies: [sub1_module_1.Sub1Module, sub2_module_1.Sub2Module]
    }),
    __metadata("design:paramtypes", [])
], Sub3Module);
exports.Sub3Module = Sub3Module;
