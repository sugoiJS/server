import {StringContent,HttpResponseMessage,HttpGet,Response,Controller} from "../../../../index";
import {Sub1Service} from "./sub1.service";

@Controller("/sub1")
export class Sub1Controller{
    constructor(private sub1Service:Sub1Service){}

    @HttpGet("/")
    public async test(){
        return {message:this.sub1Service.message};
    }
}