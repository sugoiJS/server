import {Container, interfaces, ContainerService} from "@sugoi/core";


export class ServerContainerService extends ContainerService {
    static containersMap: Map<string, Container> = new Map();

    static initContainer(config: interfaces.ContainerOptions = {defaultScope: "Transient"}) {
        return super.initContainer(config);
    }

    static setContainerForId(id: string):Container {
        this.initContainer();
        ServerContainerService.containersMap.set(id, this.container);
        return this.container;
    }

    static getContainerById(id: string): Container {
        return ServerContainerService.containersMap.get(id);
    }
}

ServerContainerService.initContainer();