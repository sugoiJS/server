import {BadRequest,Ok,Forbidden,Unauthorized, ServerError, NotFound, Inject, Controller, HttpGet} from "../../../../index";
import {Sub1Service} from "../sub1/sub1.service";


@Controller("/sub3")
export class Sub3Controller {

    @Inject("Sub1Service")
    private sub1Service: Sub1Service;

    @HttpGet("/")
    get() {
        return {success: this.sub1Service.status}
    }

    @HttpGet("/date")
    async getDate() {
        return {date: this.sub1Service.date};
    }

    @HttpGet("/date2")
    async getDate2() {
        return {date: this.sub1Service.date2};
    }

    @HttpGet("/notfound")
    async notFound() {
        return NotFound("not found");
    }

    @HttpGet("/servererror")
    async serverError() {
        return ServerError("error");
    }

    @HttpGet("/unauthorized")
    async unauthorized() {
        return Unauthorized("unauthorized");
    }

    @HttpGet("/forbidden")
    async forbidden() {
        return Forbidden("forbidden");
    }

    @HttpGet("/ok")
    async ok() {
        return Ok("ok");
    }

    @HttpGet("/badrequest")
    async badrequest() {
        return BadRequest("bad request");
    }
}