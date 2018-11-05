"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sugoi/core");
const inversify_express_utils_1 = require("inversify-express-utils");
const server_exception_1 = require("../exceptions/server.exception");
const exceptions_constant_1 = require("../constants/exceptions.constant");
const meta_key_1 = require("../constants/meta-key");
const express = require("express");
const icons_1 = require("../constants/icons");
const server_container_service_1 = require("../services/server-container.service");
const http = require("http");
const https = require("https");
class HttpServer {
    /**
     *
     *
     * @param {string} rootPath
     * @param {string} moduleMetaKey
     * @param {IModuleMetadata} module
     * @param {AuthProvider} authProvider
     * @param {any} httpsConfiguration
     * @constructor
     */
    constructor(rootPath, moduleMetaKey, module, authProvider, httpsConfiguration) {
        this._asyncModules = new Map();
        this.metaMiddlewares = [
            (function (app) {
                app.use((function (req, res, next) {
                    req['container'] = this.container;
                    if (req.container.isBound(Symbol.for("AuthProvider"))) {
                        const AuthProvider = req.container.get(Symbol.for("AuthProvider"));
                        req['AuthProvider'] = AuthProvider.constructor.builder().setRequestData(req);
                        req.getAuthProvider = (function () {
                            return this.AuthProvider;
                        }).bind(req);
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
        this._httpsConfiguration = httpsConfiguration;
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
    static init(bootstrapModule, rootPath = "/", namespaceKey = meta_key_1.ModuleMetaKey, authProvider = null, httpsConfiguration) {
        namespaceKey = namespaceKey || meta_key_1.ModuleMetaKey;
        if (HttpServer.serverInstances.has(namespaceKey)) {
            return HttpServer.serverInstances.get(namespaceKey);
        }
        else {
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
    setHttpsConfiguration(httpsConfiguration) {
        this._httpsConfiguration = httpsConfiguration;
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
        const listener = this._httpsConfiguration
            ? https.createServer(this._httpsConfiguration, server)
            : http.createServer(server);
        this.initListener(listener, port, hostname, callback);
        return listener;
    }
    initListener(listener, port, hostname, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._asyncModules.size > 0)
                console.log("Resolving async modules...");
            try {
                yield Promise.all(this._asyncModules.values());
            }
            catch (err) {
                return callback(err);
            }
            this._asyncModules.clear();
            listener.listen(port, hostname, err => {
                if (!err) {
                    console.log(icons_1.SUGOI_ICON);
                }
                callback(err);
            });
        });
    }
    loadModules(module, container) {
        this.handleModules(module, container);
        // .then(moduleContainers => {
        // container.load(...moduleContainers.containers);
        // container.loadAsync(...moduleContainers.asyncContainers);
        // });
    }
    handleModules(module, container, containerModulesObjects = {
        asyncContainers: [],
        containers: []
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleMeta = Reflect.getMetadata(this.moduleMetaKey, module) || {};
            let { services, modules, controllers, dependencies } = moduleMeta;
            modules = modules || [];
            dependencies = dependencies || [];
            services = Array.isArray(services) ? services : [];
            this.registerServices(container.bind, container, ...services);
            if (!container.isBound(module.name)) {
                yield this.loadModule(module, container, modules, containerModulesObjects);
            }
            else {
                return yield this._asyncModules.get(module.name);
            }
        });
    }
    loadModule(module, container, modules, containerModulesObjects) {
        return __awaiter(this, void 0, void 0, function* () {
            this.registerServices(container.bind, container, module);
            const moduleInstance = container.resolve(module);
            let res = "onLoad" in moduleInstance
                ? moduleInstance.onLoad()
                : null;
            //register the module for being singleton
            if (res instanceof Promise) {
                res = res.then((res) => __awaiter(this, void 0, void 0, function* () {
                    yield modules.map((subModule) => __awaiter(this, void 0, void 0, function* () { return this.handleModules(subModule, container, containerModulesObjects); }));
                }));
                this._asyncModules.set(moduleInstance.constructor.name, res);
            }
            else {
                yield modules.map((subModule) => __awaiter(this, void 0, void 0, function* () { return this.handleModules(subModule, container, containerModulesObjects); }));
            }
        });
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
    registerServices(bind, container, ...services) {
        for (let service of services) {
            const serviceName = service.name;
            if (container.isBound(serviceName))
                continue;
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
}
HttpServer.serverInstances = new Map();
exports.HttpServer = HttpServer;
