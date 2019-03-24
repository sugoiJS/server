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
const core_1 = require("@sugoi/core");
const bootstrap_2_service_1 = require("./bootstrap-2.service");
let Bootstrap2Controller = class Bootstrap2Controller {
    index() {
        return this.service.index();
    }
};
__decorate([
    core_1.Inject('Bootstrap2Service'),
    __metadata("design:type", bootstrap_2_service_1.Bootstrap2Service)
], Bootstrap2Controller.prototype, "service", void 0);
__decorate([
    index_1.HttpGet('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Bootstrap2Controller.prototype, "index", null);
Bootstrap2Controller = __decorate([
    index_1.Controller('bootstrap2')
], Bootstrap2Controller);
exports.Bootstrap2Controller = Bootstrap2Controller;
