import {ICRUDController} from "../interfaces/crud-controller.interface";
import {
    Authorized,
    HasPermission,
    HasRole
} from "../index";
import {clone, Decorate, TNewable, UsePolicySync} from "@sugoi/core";
import {TStringOrNumber} from "../decorators/authorization-policy.decorator";
import {HTTP_METHOD} from "../constants/methods.constant";
import {SugoiServerError} from "../exceptions/server.exception";
import {EXCEPTIONS} from "../constants/exceptions.constant";
import {
    HttpGet,
    HttpPost,
    HttpPut,
    HttpDelete,
    RequestBody,
    RequestParam,
    Request,
    Controller} from "../decorators/express-utils.decorator";

export class CRUDControllerFactory<ResourceType> implements ICRUDController<ResourceType> {

    protected static resourceClass: any;

    private static allowedMethods: Set<HTTP_METHOD> = new Set();

    static of<ResourceType = any>(model: TNewable<ResourceType>, endpoint?: string){
        const newCRUDController = clone(CRUDControllerFactory, {},  false).constructor as any;
        newCRUDController.setAsController(model, endpoint);
        return newCRUDController;
    }

    private static setAsController(model: any, endpoint: string){
        Decorate(CRUDController(model, endpoint) ,this);
        this.allowAllMethods()
    }

    constructor(){
    }

    getResourceClass(){
        return (<any>this.constructor).resourceClass;
    }

    static authorized(){
        Decorate(Authorized(), this);
        return this;
    }

    static setRole(...roles: TStringOrNumber[]){
        Decorate(HasRole(...roles), this);
        return this;
    }

    static setAllowedMethods(...methods: Array<HTTP_METHOD>){
        this.allowedMethods.clear();
        for (let method of methods){
            if(method === HTTP_METHOD.ALL) {
                this.allowAllMethods();
                break;
            }
            this.allowedMethods.add(method);
        }
        return this;
    }

    static setPermission(...permissions: TStringOrNumber[]){
        Decorate(HasPermission(...permissions), this);
        return this;
    }

    @HttpGet("/:id?")
    @UsePolicySync(()=>this.verifyMethod(HTTP_METHOD.GET))
    async read(@RequestParam('id') id: string | number, @Request() req): Promise<ResourceType[] | ResourceType> {
        return await (id
            ? this.getResourceClass().findById(id)
            : this.getResourceClass().find(req.query));
    }

    @HttpPost("/")
    @UsePolicySync(()=>this.verifyMethod(HTTP_METHOD.POST))
    async create(@RequestBody() body: any): Promise<ResourceType> {
        return await clone(this.getResourceClass(),body).save();
    }

    @HttpPut("/:id")
    @UsePolicySync(()=>this.verifyMethod(HTTP_METHOD.PUT))
    async update(@RequestParam('id') id: string | number, @RequestBody() body: any): Promise<ResourceType> {
        return await this.getResourceClass().updateById(id, body);
    }

    @HttpDelete("/:id")
    @UsePolicySync(()=>this.verifyMethod(HTTP_METHOD.DELETE))
    async delete(@RequestParam('id') id: string | number): Promise<ResourceType> {
        return await this.getResourceClass().removeById(id);
    }


    private static verifyMethod(method: HTTP_METHOD) {
        console.log('verify method ', method);
        if(!this.allowedMethods.has(method)){
            throw new SugoiServerError(EXCEPTIONS.METHOD_NOT_ALLOWED.message, EXCEPTIONS.METHOD_NOT_ALLOWED.code, [method, this.constructor.name]);
        }
    }

    private static allowAllMethods() {
        this.allowedMethods.add(HTTP_METHOD.DELETE);
        this.allowedMethods.add(HTTP_METHOD.GET);
        this.allowedMethods.add(HTTP_METHOD.POST);
        this.allowedMethods.add(HTTP_METHOD.PUT);
    }
}

export function CRUDController(model: any, endpoint?: string){
    if(!endpoint){
        endpoint = Reflect.has(model, 'getModelName')
            ? `/${(<any>model).getModelName()}`
            : `/${(<any>model).name}`;
    }
    return function (target) {
        Decorate(Controller(endpoint), target);
        setCRUDControllerMeta(target, model, endpoint)
    }
}

function setCRUDControllerMeta(target: any, model: any, endpoint?: string){
    target.resourceClass = model;
    const name = `${endpoint.split('/').join('_').toUpperCase()}`;
    const descriptor = Object.getOwnPropertyDescriptor(target.constructor, 'name');
    descriptor.writable = true;
    descriptor.value = name;
    Object.defineProperty(target.constructor, 'name', descriptor);
}
