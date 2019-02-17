import { IServerModule } from "../../../../index";
import { Sub1Service } from "./sub1.service";
export declare class Sub1Module implements IServerModule {
    private sub1Service;
    constructor(sub1Service: Sub1Service);
    onLoad(): void | Promise<void>;
}
