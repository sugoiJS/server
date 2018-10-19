"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
class RequestContainerService extends core_1.ContainerService {
}
exports.RequestContainerService = RequestContainerService;
RequestContainerService.initContainer({ defaultScope: "Request", autoBindInjectable: true });
