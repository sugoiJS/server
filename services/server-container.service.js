"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sugoi/core");
var ServerContainerService = /** @class */ (function (_super) {
    __extends(ServerContainerService, _super);
    function ServerContainerService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerContainerService.initContainer = function (config) {
        if (config === void 0) { config = { defaultScope: "Transient" }; }
        _super.initContainer.call(this, config);
    };
    ServerContainerService.setContainerForId = function (id) {
        this.initContainer();
        ServerContainerService.containersMap.set(id, this.container);
    };
    ServerContainerService.getContainerById = function (id) {
        return ServerContainerService.containersMap.get(id);
    };
    ServerContainerService.containersMap = new Map();
    return ServerContainerService;
}(core_1.ContainerService));
exports.ServerContainerService = ServerContainerService;
ServerContainerService.initContainer();
