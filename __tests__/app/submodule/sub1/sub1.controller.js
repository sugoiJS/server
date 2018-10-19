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
const sub1_service_1 = require("./sub1.service");
const core_1 = require("@sugoi/core");
let Sub1Controller = class Sub1Controller {
    constructor() { }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            return { message: this.sub1Service.message };
        });
    }
};
__decorate([
    core_1.Inject("Sub1Service"),
    __metadata("design:type", sub1_service_1.Sub1Service)
], Sub1Controller.prototype, "sub1Service", void 0);
__decorate([
    index_1.HttpGet("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Sub1Controller.prototype, "test", null);
Sub1Controller = __decorate([
    index_1.Controller("/sub1"),
    __metadata("design:paramtypes", [])
], Sub1Controller);
exports.Sub1Controller = Sub1Controller;
