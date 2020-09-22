import {Sub3Controller} from "./sub3.controller";
import {Inject,ServerModule} from "../../../../index";
import {Sub1Service} from "../sub1/sub1.service";
import {Sub2Module} from "../sub1/sub2/sub2.module";
import {Sub1Module} from "../sub1/sub1.module";
import {IServerModule} from "../../../../interfaces/server-module.interface";

@ServerModule({
    controllers:[Sub3Controller],
})
export class Sub3Module implements IServerModule{
    onLoad(): void | Promise<void> {
        console.log(this.sub1Service.date2);
    }

    @Inject("Sub1Service")
    public sub1Service:Sub1Service;


    constructor(){
    }
}