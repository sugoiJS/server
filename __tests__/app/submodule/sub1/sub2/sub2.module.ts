import {IServerModule,Inject,ServerModule} from "../../../../../index";
import {Sub2Controller} from "./sub2.controller";
import {Sub1Service} from "../sub1.service";

@ServerModule({
    controllers:[Sub2Controller]
})
export class Sub2Module implements IServerModule{
    @Inject("Sub1Service")
    public sub1Service:Sub1Service;

    constructor(){
    }


    public onLoad(): void | Promise<void> {
        return new Promise(resolve=>{
            setTimeout(()=>{
                this.sub1Service.setDate2();
                resolve();
            },4000)
        })
    }

    getDate(){
        return this.sub1Service.date;
    }
}