"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
class ServerContainerService extends core_1.ContainerService {
    static initContainer(config = { defaultScope: "Transient" }) {
        return super.initContainer(config);
    }
    static setContainerForId(id) {
        this.initContainer();
        ServerContainerService.containersMap.set(id, this.container);
    }
    static getContainerById(id) {
        return ServerContainerService.containersMap.get(id);
    }
}
ServerContainerService.containersMap = new Map();
exports.ServerContainerService = ServerContainerService;
ServerContainerService.initContainer();
