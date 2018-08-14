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
import {Container} from '@sugoi/core';

export class HttpServer {
    private static serverInstances: Map<string, HttpServer> = new Map();
    private middlewares: Array<IExpressCallback> = [];
    private viewMiddleware: Array<IExpressCallback> = [];
    private handlers: Array<IExpressCallback> = [(app) => app.use(function (err) {
        throw new SugoiServerError(EXCEPTIONS.GENERAL_SERVER_ERROR.message, EXCEPTIONS.GENERAL_SERVER_ERROR.code, err)
    })];
    private moduleMetaKey: string;
    private serverInstance: InversifyExpressServer;
    private httpListeners: Map<number, Application> = new Map();
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
                          container: Container,
                          moduleMetaKey: string,
                          module: IModuleMetadata,
                          authProvider: AuthProvider) {
        this._rootPath = rootPath;
        this.moduleMetaKey = moduleMetaKey;
        this.loadModules(module, container);
        this.serverInstance = new InversifyExpressServer(container, null, {rootPath}, null);
    }

    /**
     * Initialize the application by creating new httpServer.
     *
     * A bootstrap module (boostrapModule) should be decorated with SugModule and 'modules' property
     * which contains all of the related modules.
     * Depended on moduleMetaKey for separate applications.
     *
     * @param bootstrapModule - the root module which use as entry point
     * @param {string} rootPath - the prefix for all of the routes
     * @param {string} moduleMetaKey - related to SugModule metaKey
     * @param {AuthProvider} authProvider -
     * @param {Container} container - the inversify Container which will be use to for binding the services
     * @returns {HttpServer}
     */
    public static init(bootstrapModule: any,
                       rootPath: string = "/",
                       moduleMetaKey: string = ModuleMetaKey,
                       authProvider: AuthProvider = null,
                       container: Container = new Container()): HttpServer {
        if (HttpServer.serverInstances.has(moduleMetaKey)) {
            return HttpServer.serverInstances.get(moduleMetaKey)
        } else {
            const server = new HttpServer(rootPath, container, moduleMetaKey, bootstrapModule, authProvider);
            HttpServer.serverInstances.set(moduleMetaKey, server);
            return server;
        }

    }

    /**
     * Get the application instance based on moduleMetaKay and port
     *
     * @param {string} moduleMetaKey
     * @param {number} port
     * @returns {e.Application}
     */
    public static getInstance(moduleMetaKey: string, port: number) {
        const instance = HttpServer.serverInstances.get(moduleMetaKey);

        return instance && instance.httpListeners.has(port)
            ? instance.httpListeners.get(port)
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
    public setStatic(pathToStatic: string,route?:string) {
        const cb = (app) => route
            ? app.use(route, express.static(pathToStatic))
            : app.use(express.static(pathToStatic));
        this.viewMiddleware.splice(0,0,cb);
        return this
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
     * based on port.
     *
     * @param {number} port
     * @returns {any}
     */
    public build(port: number) {

        if (this.httpListeners.has(port)) {
            return this.httpListeners.get(port);
        }
        const that = this;
        const httpInstance = this.serverInstance
            .setConfig(app => {
                that.middlewares.forEach(middleware => middleware(app));
                that.viewMiddleware.forEach(middleware => middleware(app));
            })
            .setErrorConfig(app => {
                that.handlers.forEach(middleware => middleware(app));
            })
            .build();
        this.httpListeners.set(port, httpInstance);
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

        const server = this.httpListeners.has(port)
            ? this.httpListeners.get(port)
            : null;
        if(!server) {
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
            container.bind(service).to(service);
        }
        rootModuleMeta.modules = rootModuleMeta.modules || [];
        for (const mod of rootModuleMeta.modules) {
            const metadata = Reflect.getMetadata(this.moduleMetaKey, mod);
            const {services, modules} = metadata;
            for (const service of services) {
                container.bind(service).to(service);
            }
            if (modules)
                modules.forEach(subModule => this.loadModules(subModule, container));
        }
    }

    protected setNamespace(moduleMetaKey: string) {
        this.moduleMetaKey = moduleMetaKey;
    }
}


