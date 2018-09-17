import {InversifyExpressServer} from 'inversify-express-utils';
import {IExpressCallback} from "../interfaces/express-callback.interface";
import {IModuleMetadata} from "../interfaces/module-meta.interface";
import {SugoiServerError} from "../exceptions/server.exception";
import {EXCEPTIONS} from "../constants/exceptions.constant";
import {ModuleMetaKey} from "../constants/meta-key";
import * as express from "express";
import {Application} from "express";
import {AuthProvider} from "./auth-provider.class";
import {Server} from "http";
import {SUGOI_ICON} from "../constants/icons";
import {Container, Injectable} from '@sugoi/core';
import {TNewable} from "../interfaces/newable.type";
import {StringUtils} from "@sugoi/core/dist/policies/utils/string.util";
import {ServerContainerService} from "../services/server-container.service";

export class HttpServer {
    protected _container: Container;
    public get container() {
        return this._container;
    }

    private static serverInstances: Map<string, HttpServer> = new Map();
    private metaMiddlewares: Array<IExpressCallback> = [
        (function (app) {
            app.use((function (req, res, next) {
                req['container'] = this.container;
                if((<Container>req.container).isBound(Symbol.for("AuthProvider"))) {
                    const AuthProvider = (<Container>req.container).get<AuthProvider>(Symbol.for("AuthProvider"));
                    req['AuthProvider'] = (<any>AuthProvider.constructor).builder().setRequestData(req);
                }
                next();
            }).bind(this));
        }).bind(this),

    ];
    private middlewares: Array<IExpressCallback> = [];
    private viewMiddleware: Array<IExpressCallback> = [];
    private handlers: Array<IExpressCallback> = [(app) => app.use(function (err) {
        throw new SugoiServerError(EXCEPTIONS.GENERAL_SERVER_ERROR.message, EXCEPTIONS.GENERAL_SERVER_ERROR.code, err)
    })];
    private moduleMetaKey: string;
    private instanceId: string | number;
    private _serverInstance: InversifyExpressServer;
    public get serverInstance(): InversifyExpressServer {
        return this._serverInstance
    };

    private httpListeners: Map<string | number, Application> = new Map();
    private _rootPath: string;
    /**
     * rootPath stands for the server uri prefix
     * @returns {string}
     */
    public get rootPath(): string {
        return this._rootPath;
    };


    /**
     *
     *
     * @param {string} rootPath
     * @param {Container} container
     * @param {string} moduleMetaKey
     * @param {IModuleMetadata} module
     * @param {AuthProvider} authProvider
     * @constructor
     */
    protected constructor(rootPath: string,
                          moduleMetaKey: string,
                          module: IModuleMetadata,
                          authProvider: TNewable<AuthProvider>) {
        this.instanceId = StringUtils.generateGuid();
        ServerContainerService.setContainerForId(this.instanceId);
        this._container = ServerContainerService.getContainerById(this.instanceId);
        this._rootPath = rootPath;
        this.moduleMetaKey = moduleMetaKey;
        this.loadModules(module, this._container);
        this._serverInstance = new InversifyExpressServer(this._container, null, {rootPath}, null, authProvider);

    }


    public static init(bootstrapModule: any): HttpServer;
    public static init(bootstrapModule: any, rootPath: string): HttpServer;
    public static init(bootstrapModule: any, rootPath: string, moduleMetaKey?: string): HttpServer;
    public static init(bootstrapModule: any, rootPath: string, moduleMetaKey?: string, authProvider?: TNewable<AuthProvider>): HttpServer;

    /**
     * Initialize the application by creating new httpServer.
     *
     * A bootstrap module (bootstrapModule) should be decorated with SugModule and 'modules' property
     * which contains all of the related modules.
     * Depended on moduleMetaKey for separate applications.
     *
     * @param bootstrapModule - the root module which use as entry point
     * @param {string} rootPath - the prefix for all of the routes
     * @param {string} moduleMetaKey - related to ServerModule metaKey - Allow to use the right configuration decorator
     * @param {TNewable<AuthProvider>} authProvider - Authentication & authorization service which will use for @Authorization and the Inversify express `this.httpContext` & @Principal
     *
     * @returns {HttpServer}
     */
    public static init(bootstrapModule: any,
                       rootPath: string = "/",
                       moduleMetaKey: string = ModuleMetaKey,
                       authProvider: TNewable<AuthProvider> = null): HttpServer {
        moduleMetaKey = moduleMetaKey || ModuleMetaKey;
        if (HttpServer.serverInstances.has(moduleMetaKey)) {
            return HttpServer.serverInstances.get(moduleMetaKey)
        } else {
            const server = new HttpServer(rootPath, moduleMetaKey, bootstrapModule, authProvider);
            HttpServer.serverInstances.set(moduleMetaKey, server);
            return server;
        }

    }

    /**
     * Get the application instance based on moduleMetaKay and instanceId
     *
     * @param {number} instanceId
     * @param {string} moduleMetaKey
     * @returns {e.Application}
     */
    public static getInstance(instanceId: number, moduleMetaKey: string = ModuleMetaKey) {
        const instance = HttpServer.serverInstances.get(moduleMetaKey);

        return instance && instance.httpListeners.has(instanceId)
            ? instance.httpListeners.get(instanceId)
            : null;
    }

    /**
     * set all the functions which should be used as middlewares for each request
     *
     * @param {IExpressCallback} middlewares
     * @returns {HttpServer}
     */
    public setMiddlewares(...middlewares: Array<IExpressCallback>) {
        this.middlewares = middlewares;
        return this;
    }

    /**
     * set static file handler
     *
     * @param {string} pathToStatic - path to your static files
     * @param {string} route - path to use as route - ex. app.use(path,()=>void)
     */
    public setStatic(pathToStatic: string, route?: string) {
        const cb = (app) => route
            ? app.use(route, express.static(pathToStatic))
            : app.use(express.static(pathToStatic));
        this.viewMiddleware.splice(0, 0, cb);
        return this;
    }

    /**
     * set all the functions which should be used as error handlers for each request
     *
     * @param {IExpressCallback} handlers
     * @returns {HttpServer}
     */
    public setErrorHandlers(...handlers: Array<IExpressCallback>) {
        this.handlers = handlers;
        return this;
    }

    /**
     * storing a new http server instance with declared middlewares and fallback
     * based on instanceID.
     *
     * @param {number|string} instanceId - the key used to store http server instance for later usage
     * @returns {any}
     */
    public build(instanceId: string | number = this.instanceId) {
        this.setInstanceId(instanceId);
        const that = this;
        const httpInstance = this.serverInstance
            .setConfig(app => {
                that.metaMiddlewares.forEach(middleware => middleware(app));
                that.middlewares.forEach(middleware => middleware(app));
                that.viewMiddleware.forEach(middleware => middleware(app));
            })
            .setErrorConfig(app => {
                that.handlers.forEach(middleware => middleware(app));
            })
            .build();
        this.httpListeners.set(this.instanceId, httpInstance);
        return this;
    }

    /**
     * setting an http server instance based on port number
     * instance store in a map for later use
     *
     * @param {number} port
     * @param {Function} callback
     * @returns {"http".Server}
     */
    public listen(port: number, callback: Function = (err?) => {
    }): Server {
        const server = this.httpListeners.has(this.instanceId)
            ? this.httpListeners.get(this.instanceId)
            : null;
        if (!server) {
            return callback(`No server instance found for port ${port}`);
        }

        return server.listen(port, null, err => {
            if (!err) {
                console.log(SUGOI_ICON);
            }
            callback(err);
        })

    }

    protected loadModules(module: any, container: Container) {
        new module();
        const rootModuleMeta = Reflect.getMetadata(this.moduleMetaKey, module);
        for (const service of rootModuleMeta.services) {
            this.registerService(container, service);
        }
        rootModuleMeta.modules = rootModuleMeta.modules || [];
        for (const mod of rootModuleMeta.modules) {
            const metadata = Reflect.getMetadata(this.moduleMetaKey, mod);
            const {services, modules} = metadata;
            for (const service of services) {
                this.registerService(container, service);
            }
            if (modules)
                modules.forEach(subModule => this.loadModules(subModule, container));
        }
    }

    protected setNamespace(moduleMetaKey: string) {
        this.moduleMetaKey = moduleMetaKey;
    }

    public getNamespace() {
        return this.moduleMetaKey
    }

    public setInstanceId(instanceId: string | number) {
        this.instanceId = instanceId;
    }

    public getInstanceId() {
        return this.instanceId;
    }

    private registerService(container: Container, service) {
        const serviceName = service.name;
        container.bind(service).to(service).inSingletonScope();
        service = container.get(service);
        const insRef = {
            factory:(function(){return service}).bind(service)
        };
        container.bind(serviceName).toFactory(insRef.factory);
        container.bind(Symbol.for(serviceName)).toFactory(insRef.factory);
    }
}


