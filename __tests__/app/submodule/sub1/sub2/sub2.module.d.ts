import { IServerModule } from "../../../../../index";
import { Sub1Service } from "../sub1.service";
export declare class Sub2Module implements IServerModule {
    sub1Service: Sub1Service;
    constructor();
    onLoad(): void | Promise<void>;
    getDate(): Date;
}
