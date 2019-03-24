import { IServerModule } from "../../../../index";
import { Injector } from "../../../../classes/injector.class";
export declare class Sub1Module implements IServerModule {
    private injector;
    constructor(injector: Injector);
    onLoad(): void | Promise<void>;
}
