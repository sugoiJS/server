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
const sub2_controller_1 = require("./sub2.controller");
const sub1_service_1 = require("../sub1.service");
let Sub2Module = class Sub2Module {
    constructor() {
    }
    onLoad() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.sub1Service.setDate2();
                resolve();
            }, 4000);
        });
    }
    getDate() {
        return this.sub1Service.date;
    }
};
__decorate([
    index_1.Inject("Sub1Service"),
    __metadata("design:type", sub1_service_1.Sub1Service)
], Sub2Module.prototype, "sub1Service", void 0);
Sub2Module = __decorate([
    index_1.ServerModule({
        controllers: [sub2_controller_1.Sub2Controller]
    }),
    __metadata("design:paramtypes", [])
], Sub2Module);
exports.Sub2Module = Sub2Module;
