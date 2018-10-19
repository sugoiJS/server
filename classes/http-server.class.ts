import {ContainerModule, AsyncContainerModule, StringUtils, Container} from '@sugoi/core';
import {InversifyExpressServer} from 'inversify-express-utils';
import {IExpressCallback} from "../interfaces/express-callback.interface";
import {IModuleMetadata} from "../interfaces/module-meta.interface";
import {SugoiServerError} from "../exceptions/server.exception";
import {EXCEPTIONS} from "../constants/exceptions.constant";
import {ModuleMetaKey} from "../constants/meta-key";
import * as express from "express";
import {Application} from "express";
import {AuthProvider} from "./auth-provider.class";
import {SUGOI_ICON} from "../constants/icons";
import {TNewable} from "../interfaces/newable.type";
import {ServerContainerService} from "../services/server-container.service";
import {IServerModule} from "../interfaces/server-module.interface";
import * as http from "http";
import * as https from "https";

export class HttpServer {
    public get container() {
        return this._container;
    }

    protected _container: Container;

    private _httpsConfiguration: any;
    private static serverInstances: Map<string, HttpServer> = new Map();
    private _asyncModules: Map<string, Promise<void>> = new Map();

    private metaMiddlewares: Array<IExpressCallback> = [
        (function (app) {
            app.use((function (req, res, next) {
                req['container'] = this.container;
                if ((<Container>req.container).isBound(Symbol.for("AuthProvider"))) {
                    const AuthProvider = (<Container>req.container).get<AuthProvider>(Symbol.for("AuthProvider"));
                    req['AuthProvider'] = (<any>AuthProvider.constructor).builder().setRequestData(req);
                    req.getAuthProvider = (function () {
                        return this.AuthProvider
                    }).bind(req);
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

    public get serverInstance(): InversifyExpressServer {
        return this._serverInstance
    };

    private _serverInstance: InversifyExpressServer;

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
                          authProvider: TNewable<AuthProvider>,
                          httpsConfiguration: any) {
        this.instanceId = StringUtils.generateGuid();
        ServerContainerService.setContainerForId(<string>this.instanceId);
        this._container = ServerContainerService.getContainerById(<string>this.instanceId);
        this._rootPath = rootPath;
        this._httpsConfiguration = httpsConfiguration;
        this.moduleMetaKey = moduleMetaKey;
        this.loadModules(module, this._container);
        this._serverInstance = new InversifyExpressServer(this._container, null, {rootPath}, null, authProvider);

    }


    public static init(bootstrapModule: any): HttpServer;
    public static init(bootstrapModule: any, rootPath: string): HttpServer;
    public static init(bootstrapModule: any, rootPath: string, namespaceKey?: string): HttpServer;
    public static init(bootstrapModule: any, rootPath: string, namespaceKey?: string, authProvider?: TNewable<AuthProvider>): HttpServer;
    public static init(bootstrapModule: any, rootPath: string, namespaceKey?: string, authProvider?: TNewable<AuthProvider>, httpsConfiguration?: any): HttpServer;

    /**
     * Initialize the application by creating new httpServer.
     *
     * A bootstrap module (bootstrapModule) should be decorated with SugModule and 'modules' property
     * which contains all of the related modules.
     * Depended on namespaceKey for separate applications.
     *
     * @param bootstrapModule - the root module which use as entry point
     * @param {string} rootPath - the prefix for all of the routes
     * @param {string} namespaceKey - related to ServerModule metaKey - Allow to use the right configuration decorator
     * @param {TNewable<AuthProvider>} authProvider - Authentication & authorization service which will use for @Authorization and the Inversify express `this.httpContext` & @Principal
     *
     * @returns {HttpServer}
     */
    public static init(bootstrapModule: any,
                       rootPath: string = "/",
                       namespaceKey: string = ModuleMetaKey,
                       authProvider: TNewable<AuthProvider> = null,
                       httpsConfiguration?: any): HttpServer {
        namespaceKey = namespaceKey || ModuleMetaKey;
        if (HttpServer.serverInstances.has(namespaceKey)) {
            return HttpServer.serverInstances.get(namespaceKey)
        } else {
            const server = new HttpServer(rootPath, namespaceKey, bootstrapModule, authProvider, httpsConfiguration);
            HttpServer.serverInstances.set(namespaceKey, server);
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
    public static getInstance(instanceId: number | string, moduleMetaKey: string = ModuleMetaKey) {
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
    public build(instanceId: string | number = this.instanceId): HttpServer {
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

    public setHttpsConfiguration(httpsConfiguration:any){
        this._httpsConfiguration = httpsConfiguration;
    }

    /**
     * setting an http server instance based on port number
     * instance store in a map for later use
     *
     * @param {number} port
     * @param {string} hostname
     * @param {Function} callback
     * @returns {"http".Server}
     */
    public listen(port: number);
    public listen(port: number, callback: Function);
    public listen(port: number, hostname: string);
    public listen(port: number, hostname: string, callback: Function);
    public listen(port: number, hostname?: Function | string, callback: Function = (err?) => {
    }): http.Server | https.Server {
        if (typeof hostname === "function") {
            callback = hostname;
            hostname = null;
        }
        const server = this.httpListeners.has(this.instanceId)
            ? this.httpListeners.get(this.instanceId)
            : null;
        if (!server) {
            return callback(`No server instance found for port ${port}`);
        }

        const listener = this._httpsConfiguration
            ? https.createServer(this._httpsConfiguration, server)
            : http.createServer(server);
        this.initListener(listener, port, hostname as string, callback);
        return listener;

    }

    private async initListener(listener: http.Server | https.Server, port, hostname: string, callback) {
        if (this._asyncModules.size > 0)
            console.log("Resolving async modules...");
        try {
            await Promise.all(this._asyncModules.values());
        } catch (err) {
            return callback(err);
        }
        this._asyncModules.clear();
        listener.listen(port, hostname, err => {
            if (!err) {
                console.log(SUGOI_ICON);
            }

            callback(err);
        });
    }

    protected loadModules(module: any, container: Container) {
        this.handleModules(module, container)
            .then(moduleContainers => {
                // container.load(...moduleContainers.containers);
                // container.loadAsync(...moduleContainers.asyncContainers);
            });
    }

    private async handleModules(module, container: Container, containerModulesObjects = {
        asyncContainers: [],
        containers: []
    }): Promise<{ containers: Array<ContainerModule>, asyncContainers: Array<AsyncContainerModule> }> {
        const moduleMeta: IModuleMetadata = Reflect.getMetadata(this.moduleMetaKey, module) || {};
        let {services, modules, controllers, dependencies} = moduleMeta;
        modules = modules || [];
        if (dependencies) {
            modules.push.apply(modules, dependencies);
        }
        services = Array.isArray(services) ? services : [];
        //register the module for being singleton
        this.registerServices(container.bind, container, ...services);
        if (!container.isBound(module.name)) {
            await this.loadModule(module, container, modules, containerModulesObjects);
        } else {
            await this._asyncModules.get(module.name);
        }
        return containerModulesObjects;
    }

    private async loadModule(module: TNewable<IServerModule>, container: Container, modules: Array<TNewable<IServerModule>>, containerModulesObjects) {
        const moduleInstance = container.resolve<IServerModule>(module);

        let res = "onLoad" in moduleInstance
            ? moduleInstance.onLoad()
            : null;
        this.registerServices(container.bind, container, module);
        if (res instanceof Promise) {
            res = res.then(async (res) => {
                await modules.map(async subModule => this.handleModules(subModule, container, containerModulesObjects));
            });
            this._asyncModules.set(moduleInstance.constructor.name, res)
        }
        else {
            await modules.map(async subModule => this.handleModules(subModule, container, containerModulesObjects));
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

    private registerServices(bind, container, ...services) {
        for (let service of services) {
            const serviceName = service.name;
            if (container.isBound(serviceName))
                continue;
            container.bind(service).to(service).inSingletonScope();
            service = container.get(service);
            const insRef = {
                factory: (function () {
                    return service
                }).bind(service)
            };
            container.bind(serviceName).toFactory(insRef.factory);
            container.bind(Symbol.for(serviceName)).toFactory(insRef.factory);
        }
    }
}


