"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../../index");
let Sub1Service = class Sub1Service {
    constructor() {
        this.message = "hello";
        this.status = true;
        this.count = [0, 0];
    }
    setDate(date = new Date("2018-10-18")) {
        date = ++this.count[0] > 1 ? new Date() : date;
        this.date = date;
    }
    setDate2(date = new Date("2018-10-19")) {
        date = ++this.count[1] > 1 ? new Date() : date;
        this.date2 = date;
    }
};
Sub1Service = __decorate([
    index_1.Injectable()
], Sub1Service);
exports.Sub1Service = Sub1Service;
