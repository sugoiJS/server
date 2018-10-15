"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
const inversify_express_utils_1 = require("inversify-express-utils");
const server_exception_1 = require("../exceptions/server.exception");
const exceptions_constant_1 = require("../constants/exceptions.constant");
const meta_key_1 = require("../constants/meta-key");
const express = require("express");
const icons_1 = require("../constants/icons");
const server_container_service_1 = require("../services/server-container.service");
class HttpServer {
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
    constructor(rootPath, moduleMetaKey, module, authProvider) {
        this.metaMiddlewares = [
            (function (app) {
                app.use((function (req, res, next) {
                    req['container'] = this.container;
                    if (req.container.isBound(Symbol.for("AuthProvider"))) {
                        const AuthProvider = req.container.get(Symbol.for("AuthProvider"));
                        req['AuthProvider'] = AuthProvider.constructor.builder().setRequestData(req);
                        req.getAuthProvider = (function () { return this.AuthProvider; }).bind(req);
                    }
                    next();
                }).bind(this));
            }).bind(this),
        ];
        this.middlewares = [];
        this.viewMiddleware = [];
        this.handlers = [(app) => app.use(function (err) {
                throw new server_exception_1.SugoiServerError(exceptions_constant_1.EXCEPTIONS.GENERAL_SERVER_ERROR.message, exceptions_constant_1.EXCEPTIONS.GENERAL_SERVER_ERROR.code, err);
            })];
        this.httpListeners = new Map();
        this.instanceId = core_1.StringUtils.generateGuid();
        server_container_service_1.ServerContainerService.setContainerForId(this.instanceId);
        this._container = server_container_service_1.ServerContainerService.getContainerById(this.instanceId);
        this._rootPath = rootPath;
        this.moduleMetaKey = moduleMetaKey;
        this.loadModules(module, this._container);
        this._serverInstance = new inversify_express_utils_1.InversifyExpressServer(this._container, null, { rootPath }, null, authProvider);
    }
    get container() {
        return this._container;
    }
    get serverInstance() {
        return this._serverInstance;
    }
    ;
    /**
     * rootPath stands for the server uri prefix
     * @returns {string}
     */
    get rootPath() {
        return this._rootPath;
    }
    ;
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
    static init(bootstrapModule, rootPath = "/", namespaceKey = meta_key_1.ModuleMetaKey, authProvider = null) {
        namespaceKey = namespaceKey || meta_key_1.ModuleMetaKey;
        if (HttpServer.serverInstances.has(namespaceKey)) {
            return HttpServer.serverInstances.get(namespaceKey);
        }
        else {
            const server = new HttpServer(rootPath, namespaceKey, bootstrapModule, authProvider);
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
    static getInstance(instanceId, moduleMetaKey = meta_key_1.ModuleMetaKey) {
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
    setMiddlewares(...middlewares) {
        this.middlewares = middlewares;
        return this;
    }
    /**
     * set static file handler
     *
     * @param {string} pathToStatic - path to your static files
     * @param {string} route - path to use as route - ex. app.use(path,()=>void)
     */
    setStatic(pathToStatic, route) {
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
    setErrorHandlers(...handlers) {
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
    build(instanceId = this.instanceId) {
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
    listen(port, hostname, callback = (err) => {
    }) {
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
        return server.listen(port, hostname, err => {
            if (!err) {
                console.log(icons_1.SUGOI_ICON);
            }
            callback(err);
        });
    }
    loadModules(module, container) {
        new module();
        const rootModuleMeta = Reflect.getMetadata(this.moduleMetaKey, module) || {};
        if (Array.isArray(rootModuleMeta.services)) {
            for (const service of rootModuleMeta.services) {
                this.registerService(container, service);
            }
        }
        rootModuleMeta.modules = rootModuleMeta.modules || [];
        for (const mod of rootModuleMeta.modules) {
            const metadata = Reflect.getMetadata(this.moduleMetaKey, mod);
            const { services, modules } = metadata;
            if (Array.isArray(services)) {
                for (const service of services) {
                    this.registerService(container, service);
                }
            }
            if (modules)
                modules.forEach(subModule => this.loadModules(subModule, container));
        }
    }
    setNamespace(moduleMetaKey) {
        this.moduleMetaKey = moduleMetaKey;
    }
    getNamespace() {
        return this.moduleMetaKey;
    }
    setInstanceId(instanceId) {
        this.instanceId = instanceId;
    }
    getInstanceId() {
        return this.instanceId;
    }
    registerService(container, service) {
        const serviceName = service.name;
        container.bind(service).to(service).inSingletonScope();
        service = container.get(service);
        const insRef = {
            factory: (function () {
                return service;
            }).bind(service)
        };
        container.bind(serviceName).toFactory(insRef.factory);
        container.bind(Symbol.for(serviceName)).toFactory(insRef.factory);
    }
}
HttpServer.serverInstances = new Map();
exports.HttpServer = HttpServer;
