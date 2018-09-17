import { Container, interfaces, ContainerService } from "@sugoi/core";
export declare class ServerContainerService extends ContainerService {
    static containersMap: Map<string, Container>;
    static initContainer(config?: interfaces.ContainerOptions): void;
    static setContainerForId(id: string): void;
    static getContainerById(id: string): Container;
}
