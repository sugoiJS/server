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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var IndexController_1;
const index_1 = require("../../../index");
const server_exception_1 = require("../../../exceptions/server.exception");
let IndexController = IndexController_1 = class IndexController {
    getData(id) {
        return { id };
    }
    isOwner(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield req.getAuthProvider().isResourceOwner(id)
                .then((valid) => {
                if (valid)
                    return IndexController_1.validResponse;
                else
                    throw new server_exception_1.SugoiServerError("not an owner", 403);
            });
        });
    }
    shouldHavePermissions() { }
    shouldHavePermissionsApproved() {
        return IndexController_1.validResponse;
    }
    shouldBeInRole() { }
    shouldBeInRoleApproved() {
        return IndexController_1.validResponse;
    }
};
IndexController.validResponse = { valid: true };
__decorate([
    index_1.HttpGet("/:id"),
    index_1.RequestSchemaPolicy({ id: index_1.ComparableSchema.ofType(index_1.SchemaTypes.STRING).setMandatory(true) }),
    __param(0, index_1.RequestParam("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndexController.prototype, "getData", null);
__decorate([
    index_1.HttpGet("/auth/resource/:id"),
    __param(0, index_1.Request()),
    __param(1, index_1.RequestParam("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IndexController.prototype, "isOwner", null);
__decorate([
    index_1.HttpGet("/auth/permissions"),
    index_1.Authorized(null, 3, 403),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IndexController.prototype, "shouldHavePermissions", null);
__decorate([
    index_1.HttpGet("/auth/permissions/approved"),
    index_1.Authorized(null, [2, 4], 403),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IndexController.prototype, "shouldHavePermissionsApproved", null);
__decorate([
    index_1.HttpGet("/auth/roles"),
    index_1.Authorized(3, null, 403),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IndexController.prototype, "shouldBeInRole", null);
__decorate([
    index_1.HttpGet("/auth/roles/approved"),
    index_1.Authorized([2, 4], null, 403),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IndexController.prototype, "shouldBeInRoleApproved", null);
IndexController = IndexController_1 = __decorate([
    index_1.Authorized(),
    index_1.Controller("/index")
], IndexController);
exports.IndexController = IndexController;
