
import {Controller, HttpGet} from "../../../../index";
import {Inject} from "@sugoi/core";
import {Bootstrap2Service} from "./bootstrap-2.service";

@Controller('bootstrap2')
export class Bootstrap2Controller{
    @Inject('Bootstrap2Service')
    service: Bootstrap2Service;


    @HttpGet('/')
    public index(){
        return this.service.index();
    }
}