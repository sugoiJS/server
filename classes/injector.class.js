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
var Injector_1;
const core_1 = require("@sugoi/core");
let Injector = Injector_1 = class Injector {
    constructor() {
        this._container = Injector_1.Container;
        const proxy = new Proxy(this._container, {});
        Object.assign(this, proxy);
    }
    static setContainer(container) {
        this.Container = container;
    }
    get(serviceIdentifier) {
        return this._container.get(serviceIdentifier);
    }
    resolve(constructorFunction) {
        return this._container.resolve(constructorFunction);
    }
};
Injector = Injector_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], Injector);
exports.Injector = Injector;
