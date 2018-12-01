import {IServerModule, ServerModule} from "../../../../index";
import {Sub1Controller} from "./sub1.controller";
import {Sub1Service} from "./sub1.service";
import {Sub2Module} from "./sub2/sub2.module";

@ServerModule({
    controllers: [Sub1Controller],
    services: [Sub1Service],
    modules: [Sub2Module]
})
export class Sub1Module implements IServerModule {
    constructor(private sub1Service: Sub1Service) {}

    public onLoad(): void | Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                this.sub1Service.setDate();
                resolve()
            }, 1000)
        })
    }
}