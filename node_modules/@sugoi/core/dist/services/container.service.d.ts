import { Container, interfaces } from "inversify";
import { ContainerRepo } from "../index";
export declare class ContainerService {
    private static container;
    static registerContainer(...repos: Array<ContainerRepo>): Container;
    static getRepo(Class: interfaces.ServiceIdentifier<any>): any;
}
