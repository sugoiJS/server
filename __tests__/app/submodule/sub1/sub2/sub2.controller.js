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
const index_1 = require("../../../../../index");
const sub1_service_1 = require("../sub1.service");
let Sub2Controller = class Sub2Controller {
    get() {
        return { success: this.sub1Service.status };
    }
    getDate() {
        return { date: this.sub1Service.date };
    }
};
__decorate([
    index_1.Inject("Sub1Service"),
    __metadata("design:type", sub1_service_1.Sub1Service)
], Sub2Controller.prototype, "sub1Service", void 0);
__decorate([
    index_1.HttpGet("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Sub2Controller.prototype, "get", null);
__decorate([
    index_1.HttpGet("/date"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Sub2Controller.prototype, "getDate", null);
Sub2Controller = __decorate([
    index_1.Controller("/sub2")
], Sub2Controller);
exports.Sub2Controller = Sub2Controller;
