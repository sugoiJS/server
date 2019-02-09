import { Sub1Service } from "../sub1/sub1.service";
import { IServerModule } from "../../../../interfaces/server-module.interface";
export declare class Sub3Module implements IServerModule {
    onLoad(): void | Promise<void>;
    sub1Service: Sub1Service;
    constructor();
}
