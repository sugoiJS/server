import {
    StringContent,
    HttpResponseMessage,
    HttpResponse,
    HttpGet,
    Response,
    Controller,
    HttpPost,
    RequestBody,
    castBodyTo
} from "../../../../index";
import {Sub1Service} from "./sub1.service";
import {Inject} from "@sugoi/core";
import { User } from "../../classes/user.class";

@Controller("/sub1")
export class Sub1Controller {

    @Inject("Sub1Service")
    private sub1Service: Sub1Service;

    constructor() {
    }

    @HttpGet("/")
    public async test() {
        return HttpResponse.builder({message: this.sub1Service.message})
            .setStatusCode(202)
            .setHeaders({"sug-x-test":2})
            .addHeaders({"testing": false})
            .removeHeader("testing")
            .addSingleHeader("sug-x-test", 1);
    }
    
}