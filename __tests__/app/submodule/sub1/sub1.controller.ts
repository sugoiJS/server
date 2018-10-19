import {StringContent,HttpResponseMessage,HttpGet,Response,Controller} from "../../../../index";
import {Sub1Service} from "./sub1.service";
import {Inject} from "@sugoi/core";

@Controller("/sub1")
export class Sub1Controller{

    @Inject("Sub1Service")
    private sub1Service:Sub1Service;
    constructor(){}

    @HttpGet("/")
    public async test(){
        return {message:this.sub1Service.message};
    }
}