import {ICRUDController} from "../interfaces/crud-controller.interface";
import {
    Authorized,
    HasPermissions,
    HasRole
} from "../index";
import {clone, Decorate, DecorateProperty, Injectable, Policy, TNewable, UsePolicy} from "@sugoi/core";
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
    Controller,
    TStringOrNumber
} from "../decorators";
import {QueryOptions} from "@sugoi/orm";
import {ICRUDOptions} from "../interfaces/crud-options.interface";

const METHODS = ['create', 'read', 'update', 'delete'];

@Injectable()
export class CRUDControllerFactory<ResourceType> {
    static of<ResourceType = any>(model: TNewable<ResourceType>, options?: ICRUDOptions): TCRUDController {
        options = options || {};
        const newCRUDController = this.getCRUDController(model, options);
        newCRUDController.model = model;
        newCRUDController.__crudOptions = options;
        newCRUDController.setAsController(model);
        return newCRUDController;
    }

    protected static getCRUDController<ResourceType>(model: TNewable<ResourceType>, options: ICRUDOptions) {
        class CRUDControllerClass implements ICRUDController<ResourceType>, CRUDControllerBuilder {
            static resourceClass: ResourceType;
            static allowedMethods: Set<HTTP_METHOD> = new Set();
            static __crudOptions: ICRUDOptions;

            static setAsController(model: any) {
                Decorate(CRUDController(model, this.__crudOptions), this);
                this.allowAllMethods()
            }

            protected static authorized(target) {
                applyPolicy({
                    name: 'authorized',
                    args: null
                }, target);
            }

            protected static hasRole(target, ...roles: TStringOrNumber[]) {
                applyPolicy({
                    name: 'hasRole',
                    args: roles
                }, target);
            }

            protected static hasPermissions(target, ...permissions: TStringOrNumber[]) {
                applyPolicy({
                    name: 'hasPermissions',
                    args: permissions
                }, target);
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
            async read(@RequestParam('id') id: string | number, @QueryParam() queryOptions): Promise<ResourceType[] | ResourceType> {
                (<any>this.constructor).verifyMethod(HTTP_METHOD.GET);
                return await (id
                    ? this.getResourceClass().findById(id, queryOptions)
                    : this.getResourceClass().find(queryOptions));
            }

            @HttpPost("/")
            async create(@QueryParam() queryOptions: Partial<QueryOptions>, @RequestBody() body: any): Promise<ResourceType> {
                (<any>this.constructor).verifyMethod(HTTP_METHOD.POST);
                return await clone(this.getResourceClass(), body).save(queryOptions);
            }

            @HttpPut("/:id")
            async update(@RequestParam('id') id: string | number,
                         @RequestBody() body: any,
                         @QueryParam() queryOptions: Partial<QueryOptions>): Promise<ResourceType> {
                (<any>this.constructor).verifyMethod(HTTP_METHOD.PUT);
                return await this.getResourceClass().updateById(id, body, queryOptions);
            }

            @HttpDelete("/:id")
            async delete(@RequestParam('id') id: string | number,
                         @QueryParam() queryOptions: Partial<QueryOptions>): Promise<ResourceType> {
                (<any>this.constructor).verifyMethod(HTTP_METHOD.DELETE);
                return await this.getResourceClass().removeById(id, queryOptions);
            }
        }

        return CRUDControllerClass as any;
    }
}

export abstract class CRUDControllerBuilder {
    static resourceClass: any;
    static allowedMethods: Set<HTTP_METHOD> = new Set();
    static isSugCRUDController: boolean = true;


    static authorized(): TCRUDController {
        Decorate(Authorized(), this);
        return this;
    }

    static hasRole(...roles: TStringOrNumber[]): TCRUDController {
        Decorate(HasRole(...roles), this);
        return this;
    }

    static hasPermissions(...permissions: TStringOrNumber[]): TCRUDController {
        Decorate(HasPermissions(...permissions), this);
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
        this.allowedMethods.add(HTTP_METHOD.HEAD);
        this.allowedMethods.add(HTTP_METHOD.PATCH);
    }

    getResourceClass() {
        return (<any>this.constructor).resourceClass;
    }
}

export function CRUDController(model: any, options: ICRUDOptions = {}) {
    if (!options.endpoint) {
        options.endpoint = Reflect.has(model, 'getModelName')
            ? `/${(<any>model).getModelName()}`
            : `/${(<any>model).name}`;
    }
    return function (target) {
        setCRUDControllerMeta(target, model, options.endpoint);
        if (options.authorized) {
            target.authorized(target)
        }
        if (options.permissions) {
            target.hasPermissions(target, ...options.permissions);
        }
        if (options.roles) {
            target.hasRole(target, ...options.roles);
        }
        Decorate(Controller(options.endpoint), target);
        return this;
    }
}

function applyPolicy(policyToApply: { name: string, args: any[] }, target: any) {
    METHODS.forEach((method) => {
        switch (policyToApply.name.toLowerCase()) {
            case 'authorized':
                DecorateProperty(Authorized(), target.prototype, method);
                break;
            case 'hasrole':
                DecorateProperty(HasRole(...policyToApply.args), target.prototype, method);
                break;
            case 'haspermissions':
                DecorateProperty(HasPermissions(...policyToApply.args), target.prototype, method);
                break;

        }
    });
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

export type TCRUDController = typeof CRUDControllerBuilder;
