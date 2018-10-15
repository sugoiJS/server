import {Inject,Controller, HttpGet} from "../../../../../index";
import {Sub1Service} from "../sub1.service";

@Controller("/sub2")
export class Sub2Controller{

    @Inject("Sub1Service")
    private sub1Service:Sub1Service;
    @HttpGet("/")
    get(){
        return {success:this.sub1Service.status}
    }
}