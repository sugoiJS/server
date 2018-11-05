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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
const sub1_service_1 = require("../sub1/sub1.service");
let Sub3Controller = class Sub3Controller {
    get() {
        return { success: this.sub1Service.status };
    }
    getDate() {
        return __awaiter(this, void 0, void 0, function* () {
            return { date: this.sub1Service.date };
        });
    }
    getDate2() {
        return __awaiter(this, void 0, void 0, function* () {
            return { date: this.sub1Service.date2 };
        });
    }
};
__decorate([
    index_1.Inject("Sub1Service"),
    __metadata("design:type", sub1_service_1.Sub1Service)
], Sub3Controller.prototype, "sub1Service", void 0);
__decorate([
    index_1.HttpGet("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Sub3Controller.prototype, "get", null);
__decorate([
    index_1.HttpGet("/date"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Sub3Controller.prototype, "getDate", null);
__decorate([
    index_1.HttpGet("/date2"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Sub3Controller.prototype, "getDate2", null);
Sub3Controller = __decorate([
    index_1.Controller("/sub3")
], Sub3Controller);
exports.Sub3Controller = Sub3Controller;
