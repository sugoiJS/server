import {Controller, HttpPost, HttpGet, Timeout, castBodyTo} from "../../../../index";
import {Inject} from "@sugoi/core";
import {Bootstrap2Service} from "./bootstrap-2.service";
import { RequestBody } from "../../../../decorators";
import { User } from "../../classes/user.class";

@Controller('/bootstrap2')
export class Bootstrap2Controller {
    @Inject('Bootstrap2Service')
    service: Bootstrap2Service;


    @HttpGet('/')
    public index() {
        return this.service.index();
    }

    @HttpPost("/cast", castBodyTo(User, {applyConstructor: true}))
    public async castToCheck(
        @RequestBody() body: User
    ) {
        return {valid: body instanceof User, user: body}
    }

    @HttpGet('/HookChecker')
    @HttpPost('/HookChecker')
    public hookChecker(@RequestBody() body){
        return body;
    }

    @HttpGet('/timeout')
    @Timeout(1000, (request, response) => {
        console.error("timeout called")
    })
    public async timeout() {
        return await new Promise(resolve => {
            setTimeout(() => {
                resolve({data: "timeout"})
            }, 2000)
        })
    }

    @Timeout(3000, (request, response) => {
        console.error("timeoutSuccess called")
    })
    @HttpGet('/timeoutSuccess')
    public async timeoutSuccess() {
        return await new Promise(resolve => {
            setTimeout(() => {
                resolve({data: "Success"})
            }, 2000)
        })
    }

    @HttpGet('/NoTimeout')
    public async noTimeout() {
        return await new Promise(resolve => {
            setTimeout(() => {
                resolve({data: "Success"})
            }, 2000)
        })

    }
}