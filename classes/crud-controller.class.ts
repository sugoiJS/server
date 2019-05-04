import {ICRUDController} from "../interfaces/crud-controller.interface";
import {
    Authorized,
    HasPermission,
    HasRole
} from "../index";
import {clone, Decorate, Injectable, Policy, TNewable, UsePolicy} from "@sugoi/core";
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
    QueryParam,
    Controller
} from "../decorators/express-utils.decorator";

@Injectable()
export class CRUDControllerFactory<ResourceType> {
    static of<ResourceType = any>(model: TNewable<ResourceType>, endpoint?: string): TCRUDController {
        const newCRUDController = this.getCRUDController();
        newCRUDController.setAsController(model, endpoint);
        return newCRUDController;
    }
    
    protected static getCRUDController<ResourceType>() {
        class CRUDControllerClass implements ICRUDController<ResourceType>,CRUDControllerBuilder {
            static resourceClass: ResourceType;
            static allowedMethods: Set<HTTP_METHOD> = new Set();
            
            static setAsController(model: any, endpoint: string) {
                Decorate(CRUDController(model, endpoint), this);
                this.allowAllMethods()
            }           
            
            
            static authorized() {
                Decorate(Authorized(), this);
                return this;
            }
            
            static hasRole(...roles: TStringOrNumber[]) {
                Decorate(HasRole(...roles), this);
                return this;
            }
            
            static setAllowedMethods(...methods: Array<HTTP_METHOD>) {
                this.allowedMethods.clear();
                for (let method of methods) {
                    if (method === HTTP_METHOD.ALL) {
                        this.allowAllMethods();
                        break;
                    }
                    this.allowedMethods.add(method);
                }
                return this;
            }
            
            static hasPermission(...permissions: TStringOrNumber[]) {
                Decorate(HasPermission(...permissions), this);
                return this;
            }
            
            static verifyMethod(method: HTTP_METHOD) {
                if (!this.allowedMethods.has(method)) {
                    throw new SugoiServerError(EXCEPTIONS.METHOD_NOT_ALLOWED.message, 403, [method, this.constructor.name]);
                }
                return true
            }
            
            static allowAllMethods() {
                this.allowedMethods.add(HTTP_METHOD.DELETE);
                this.allowedMethods.add(HTTP_METHOD.GET);
                this.allowedMethods.add(HTTP_METHOD.POST);
                this.allowedMethods.add(HTTP_METHOD.PUT);
            }
            
            getResourceClass() {
                return (<any>this.constructor).resourceClass;
            }
            
            @HttpGet("/:id?")
            async read(@RequestParam('id') id: string | number, @QueryParam() query): Promise<ResourceType[] | ResourceType> {
                (<any>this.constructor).verifyMethod(HTTP_METHOD.GET);
                return await (id
                    ? this.getResourceClass().findById(id)
                    : this.getResourceClass().find(query));
                }
                
                @HttpPost("/")
                async create(@RequestBody() body: any): Promise<ResourceType> {
                    (<any>this.constructor).verifyMethod(HTTP_METHOD.POST);
                    return await clone(this.getResourceClass(), body).save();
                }
                
                @HttpPut("/:id")
                async update(@RequestParam('id') id: string | number, @RequestBody() body: any): Promise<ResourceType> {
                    (<any>this.constructor).verifyMethod(HTTP_METHOD.PUT);
                    return await this.getResourceClass().updateById(id, body);
                }
                
                @HttpDelete("/:id")
                async delete(@RequestParam('id') id: string | number): Promise<ResourceType> {
                    (<any>this.constructor).verifyMethod(HTTP_METHOD.DELETE);
                    return await this.getResourceClass().removeById(id);
                }
            }
            
            return CRUDControllerClass as any;
        }
        
    }
    
    export function CRUDController(model: any, endpoint?: string) {
        if (!endpoint) {
            endpoint = Reflect.has(model, 'getModelName')
            ? `/${(<any>model).getModelName()}`
            : `/${(<any>model).name}`;
        }
        return function (target) {
            // if (target.name !== CRUDControllerFactory['getCRUDController']().name) {
            //     return Object.assign(target, CRUDControllerFactory.of(model, endpoint));
            // } else {
            setCRUDControllerMeta(target, model, endpoint);
            Decorate(Controller(endpoint), target);
            // }
        }
    }
    
    function setCRUDControllerMeta(target: any, model: any, endpoint?: string) {
        target.resourceClass = model;
        let name = `${endpoint.split('/').join('_').toUpperCase()}`;
        if (!name.includes('Controller')) {
            name += 'Controller';
        }
        const descriptor = Object.getOwnPropertyDescriptor(target.constructor, 'name');
        descriptor.writable = true;
        descriptor.value = name;
        Object.defineProperty(target.constructor, 'name', descriptor);
        Object.defineProperty(target, 'name', descriptor);
        
    }
    
    export abstract class CRUDControllerBuilder {
        static resourceClass: any;
        static allowedMethods: Set<HTTP_METHOD> = new Set();
        
        
        static authorized(): TCRUDController {
            Decorate(Authorized(), this);
            return this;
        }
        
        static hasRole(...roles: TStringOrNumber[]): TCRUDController {
            Decorate(HasRole(...roles), this);
            return this;
        }
        
        static setAllowedMethods(...methods: Array<HTTP_METHOD>): TCRUDController {
            this.allowedMethods.clear();
            for (let method of methods) {
                if (method === HTTP_METHOD.ALL) {
                    this.allowAllMethods();
                    break;
                }
                this.allowedMethods.add(method);
            }
            return this;
        }
        
        static hasPermission(...permissions: TStringOrNumber[]): TCRUDController {
            Decorate(HasPermission(...permissions), this);
            return this;
        }
        
        static verifyMethod(method: HTTP_METHOD) {
            if (!this.allowedMethods.has(method)) {
                throw new SugoiServerError(EXCEPTIONS.METHOD_NOT_ALLOWED.message, 403, [method, this.constructor.name]);
            }
            return true
        }
        
        static allowAllMethods() {
            this.allowedMethods.add(HTTP_METHOD.DELETE);
            this.allowedMethods.add(HTTP_METHOD.GET);
            this.allowedMethods.add(HTTP_METHOD.POST);
            this.allowedMethods.add(HTTP_METHOD.PUT);
        }
        
        getResourceClass() {
            return (<any>this.constructor).resourceClass;
        }
    }

    export type TCRUDController = (typeof CRUDControllerBuilder);
