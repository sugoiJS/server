import {Container, Injectable, decorate, ContainerModule, AsyncContainerModule} from '@sugoi/core';
import {IExpressCallback} from "../interfaces/express-callback.interface";
import {IModuleMetadata} from "../interfaces/module-meta.interface";
import {SugoiServerError} from "../exceptions/server.exception";
import {EXCEPTIONS} from "../constants/exceptions.constant";
import {ModuleMetaKey} from "../constants/meta-key";
import * as express from "express";
import {AuthProvider} from "./auth-provider.class";
import {TNewable} from "../interfaces/newable.type";
import {ServerContainerService} from "../services/server-container.service";
import {IServerModule} from "../interfaces/server-module.interface";
import {getRouteInfo, InversifyExpressServer} from 'inversify-express-utils';
import * as http from "http";
import * as https from "https";
import * as serveStatic from "serve-static";
import {SUGOI_INIT_MSG} from "../constants/message.contant";
import {RouteInfo} from "./route-info.class";
import {Injector} from "./injector.class";

export class HttpServer {
    private static readonly ID_PREFIX = "SUG_SERVER";
    private static INCREMENTAL_ID = 1;
    private _asyncModulesList: Array<Promise<any>> = [];

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
    private listenerInstance: TServer;
    private moduleMetaKey: string;
    private instanceId: string | number;

    public get serverInstance(): InversifyExpressServer {
        return this._serverInstance
    };

    private _serverInstance: InversifyExpressServer;

    private httpListeners: Map<string | number, express.Application> = new Map();
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
     * @param {string|express.Application} existingApplication
     * @param {string} moduleMetaKey
     * @param {IModuleMetadata} module
     * @param {AuthProvider} authProvider
     * @param {any} httpsConfiguration
     * @constructor
     */
    protected constructor(existingApplication: TServer, moduleMetaKey: string, module: IModuleMetadata, authProvider: TNewable<AuthProvider>, httpsConfiguration: any)
    protected constructor(rootPath: string, moduleMetaKey: string, module: IModuleMetadata, authProvider: TNewable<AuthProvider>, httpsConfiguration: any)
    protected constructor(rootPath: string | TServer,
                          moduleMetaKey: string,
                          module: IModuleMetadata,
                          authProvider: TNewable<AuthProvider>,
                          httpsConfiguration: any) {
        this.instanceId = `${HttpServer.ID_PREFIX}_${HttpServer.INCREMENTAL_ID++}`;
        this._container = ServerContainerService.setContainerForId(this.instanceId);
        if (typeof rootPath === "string") {
            this._rootPath = rootPath;
        } else {
            this.listenerInstance = rootPath;
        }
        this._httpsConfiguration = httpsConfiguration;
        this.moduleMetaKey = moduleMetaKey;
        this.loadModules(module, this._container);
        if (!this.listenerInstance) {
            this._serverInstance = new InversifyExpressServer(this._container as any, null, {rootPath: rootPath as string}, null, authProvider, false);
        } else {
            this._serverInstance = new InversifyExpressServer(this._container as any, null, null, rootPath as express.Application, authProvider, false);
        }

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
     * @param {any} httpsConfiguration - configuration for setting an https server
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
     * Allow to set the SugoiJS Server to be attached to existing server application
     *like express.Application/http.server/etc..
     *
     * @param {TServer} sourceApp
     * @param bootstrapModule
     * @param {TNewable<AuthProvider>} authProvider
     * @returns {HttpServer}
     */
    public static initializeFrom(sourceApp: TServer,
                                 bootstrapModule: any,
                                 authProvider: TNewable<AuthProvider> = null): HttpServer {
        const namespaceKey = ModuleMetaKey;
        if (HttpServer.serverInstances.has(namespaceKey)) {
            return HttpServer.serverInstances.get(namespaceKey)
        } else {
            const server = new HttpServer(sourceApp, namespaceKey, bootstrapModule, authProvider, null);
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
     * @param {serveStatic.ServeStaticOptions} options - options of the static middleware
     */
    public setStatic(pathToStatic: string, route?: string, options?: serveStatic.ServeStaticOptions) {
        const cb = (app) => route
            ? app.use(route, express.static(pathToStatic, options))
            : app.use(express.static(pathToStatic, options));
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

    public setHttpsConfiguration(httpsConfiguration: any) {
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
    public listen(port: number, hostnameOrCallback?: Function | string, callback: Function = (err?) => {
    }): TServer {
        let hostname = hostnameOrCallback;
        if (typeof hostname === "function") {
            callback = hostnameOrCallback as Function;
            hostname = null;
        }
        const server = this.getServer();
        if (!server) {
            return callback(`No server instance found for instance  ${this.instanceId}`);
        }

        this.listenerInstance = this._httpsConfiguration
            ? https.createServer(this._httpsConfiguration, server)
            : http.createServer(server);
        this.initListener(this.listenerInstance, port, hostname as string, callback);
        return this.listenerInstance;

    }

    public getServer() {
        return this.httpListeners.has(this.instanceId)
            ? this.httpListeners.get(this.instanceId)
            : null;
    }

    private initListener(listener, port, hostname: string, callback) {
        let promise;
        if (this._asyncModules.size > 0) {
            console.log("Resolving async modules...");
            promise = Promise.all(this._asyncModulesList)
                .then(_ => {
                    this._asyncModules.clear();
                    this._asyncModulesList.length = 0;
                })
                .catch(err => {
                    callback(err);
                    throw err;
                });
        } else {
            promise = Promise.resolve(true);
        }
        return promise.then(res => {
            listener.listen(port, hostname, err => {
                if (!err) {
                    console.log(SUGOI_INIT_MSG, port, process.env.NODE_ENV);
                }

                callback(err);
            });
        });
    }

    protected loadModules(module: any, container: Container) {
        this.handleModules(module, container);
        // .then(moduleContainers => {
        // container.load(...moduleContainers.containers);
        // container.loadAsync(...moduleContainers.asyncContainers);
        // });
    }

    private async handleModules(module, container: Container, graph = [],containerModulesObjects = {
        asyncContainers: [],
        containers: []
    }): Promise<any> {
                const moduleMeta: IModuleMetadata = Reflect.getMetadata(this.moduleMetaKey, module) || {};
        let {services, modules, controllers} = moduleMeta;
        modules = modules || [];
        services = Array.isArray(services) ? services : [];
        if(graph.length === 0) {
            Injector.setContainer(this.container);
            services.unshift(Injector);
        }
        this.registerServices(container.bind, container, ...services);
        HttpServer.updateGraph(graph, module.name);
        if (!container.isBound(module.name)) {
            return await this.loadModule(module, container, modules, graph, containerModulesObjects);
        }
        else {
            return await this._asyncModules.get(module.name);
        }
    }

    private loadModule(module: TNewable<IServerModule>, container: Container, modules: Array<TNewable<IServerModule>>,graph: string[],  containerModulesObjects) {
        // Register the module for being singleton
        this.registerServices(container.bind, container, {provide: module, type: "constant", useName: module.name});

        // Resolve module for get all injected values
        const moduleInstance = container.resolve<IServerModule>(module);

        let res = "onLoad" in moduleInstance
            ? moduleInstance.onLoad()
            : null;

        if (res instanceof Promise) {
            res = res.then((res) => {
                return Promise.all(modules.map( subModule => this.handleModules(subModule, container, graph, containerModulesObjects)));
            }) as any;
        }
        else {
            res = Promise.all(modules.map(async subModule => this.handleModules(subModule, container, graph, containerModulesObjects))) as any;
        }
        if(res) {
            this._asyncModules.set(moduleInstance.constructor.name, res as any);
            this._asyncModulesList.push(res as any);
        }
        return res;


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

    public getRouteInfo(): RouteInfo {
        return new RouteInfo(getRouteInfo(this.container));
    }

    private registerServices(bind, container: Container, ...services) {

        for (let service of services) {
            try {
                this.registerService(bind, container, service)
            } catch (err) {
                console.error(err);
            }
        }
    }

    private registerService(bind, container, provider) {
        let providerName, type = 'singleton';
        if (provider.hasOwnProperty('provide')) {
            if (!provider.hasOwnProperty('useName')) {
                throw new SugoiServerError(`No 'useName' property defined for provider`, EXCEPTIONS.MISSING_PROPERTY.code, provider)
            }
            providerName = provider.useName;
            type = provider.type;
            provider = provider.provide;
            if (!type) {
                if (typeof provider === "function") {
                    type = provider.name === 'provide' ? 'factory' : 'singleton';
                } else {
                    type = "constant";
                }
            }
        }
        else {
            providerName = provider.name || provider.constructor.name;
        }
        if (container.isBound(providerName))
            return;
        let shouldRefBind = true;
        switch (type.toLowerCase()) {
            case 'factory':
                container.bind(providerName).toFactory(provider);
                shouldRefBind = false;
                break;
            case 'singleton':
                container.bind(provider).to(provider).inSingletonScope();
                break;
            case 'constant':
            default:
                container.bind(provider).toConstantValue(provider);
                break;

        }
        if (shouldRefBind) {
            provider = container.get(provider);

            const insRef = {
                factory: (function () {
                    return provider
                }).bind(provider)
            };
            container.bind(providerName).toFactory(insRef.factory);
            container.bind(Symbol.for(providerName)).toFactory(insRef.factory);
        }
    }

    private static updateGraph(graph: string[], moduleName: string){
        const found = graph.indexOf(moduleName) > -1;
        graph.push(moduleName);
        if (found) {
            console.error("Circular dependencies while loading modules \n",graph.join(' --> '));
            throw new Error("CIRCULAR DEPENDENCIES");
        }
    }

}


export type TServer = http.Server | https.Server | { listen: (...args) => any }