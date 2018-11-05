import {Inject,Controller, HttpGet} from "../../../../index";
import {Sub1Service} from "../sub1/sub1.service";

@Controller("/sub3")
export class Sub3Controller{

    @Inject("Sub1Service")
    private sub1Service:Sub1Service;
    @HttpGet("/")
    get(){
        return {success:this.sub1Service.status}
    }

    @HttpGet("/date")
    async getDate(){
        return {date:this.sub1Service.date};
    }

    @HttpGet("/date2")
    async getDate2(){
        return {date:this.sub1Service.date2};
    }
}