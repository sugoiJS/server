import {Container, interfaces, ContainerService} from "@sugoi/core";


export class ServerContainerService extends ContainerService {
    static containersMap: Map<string, Container> = new Map();

    static initContainer(config: interfaces.ContainerOptions = {defaultScope: "Transient"}) {
        super.initContainer(config);
    }

    static setContainerForId(id: string) {
        this.initContainer();
        ServerContainerService.containersMap.set(id, this.container);
    }

    static getContainerById(id: string): Container {
        return ServerContainerService.containersMap.get(id);
    }
}

ServerContainerService.initContainer();