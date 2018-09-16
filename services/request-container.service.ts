import {ContainerService} from "@sugoi/core";


export class RequestContainerService extends ContainerService {}

RequestContainerService.initContainer({defaultScope: "Request", autoBindInjectable: true});