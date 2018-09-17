"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_express_utils_1 = require("inversify-express-utils");
var server_exception_1 = require("../exceptions/server.exception");
var exceptions_constant_1 = require("../constants/exceptions.constant");
var meta_key_1 = require("../constants/meta-key");
var express = require("express");
var icons_1 = require("../constants/icons");
var string_util_1 = require("@sugoi/core/dist/policies/utils/string.util");
var server_container_service_1 = require("../services/server-container.service");
var HttpServer = /** @class */ (function () {
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
    function HttpServer(rootPath, moduleMetaKey, module, authProvider) {
        this.metaMiddlewares = [
            (function (app) {
                app.use((function (req, res, next) {
                    req['container'] = this.container;
                    if (req.container.isBound(Symbol.for("AuthProvider"))) {
                        var AuthProvider_1 = req.container.get(Symbol.for("AuthProvider"));
                        req['AuthProvider'] = AuthProvider_1.constructor.builder().setRequestData(req);
                    }
                    next();
                }).bind(this));
            }).bind(this),
        ];
        this.middlewares = [];
        this.viewMiddleware = [];
        this.handlers = [function (app) { return app.use(function (err) {
                throw new server_exception_1.SugoiServerError(exceptions_constant_1.EXCEPTIONS.GENERAL_SERVER_ERROR.message, exceptions_constant_1.EXCEPTIONS.GENERAL_SERVER_ERROR.code, err);
            }); }];
        this.httpListeners = new Map();
        this.instanceId = string_util_1.StringUtils.generateGuid();
        server_container_service_1.ServerContainerService.setContainerForId(this.instanceId);
        this._container = server_container_service_1.ServerContainerService.getContainerById(this.instanceId);
        this._rootPath = rootPath;
        this.moduleMetaKey = moduleMetaKey;
        this.loadModules(module, this._container);
        this._serverInstance = new inversify_express_utils_1.InversifyExpressServer(this._container, null, { rootPath: rootPath }, null, authProvider);
    }
    Object.defineProperty(HttpServer.prototype, "container", {
        get: function () {
            return this._container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpServer.prototype, "serverInstance", {
        get: function () {
            return this._serverInstance;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HttpServer.prototype, "rootPath", {
        /**
         * rootPath stands for the server uri prefix
         * @returns {string}
         */
        get: function () {
            return this._rootPath;
        },
        enumerable: true,
        configurable: true
    });
    ;
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
    HttpServer.init = function (bootstrapModule, rootPath, moduleMetaKey, authProvider) {
        if (rootPath === void 0) { rootPath = "/"; }
        if (moduleMetaKey === void 0) { moduleMetaKey = meta_key_1.ModuleMetaKey; }
        if (authProvider === void 0) { authProvider = null; }
        moduleMetaKey = moduleMetaKey || meta_key_1.ModuleMetaKey;
        if (HttpServer.serverInstances.has(moduleMetaKey)) {
            return HttpServer.serverInstances.get(moduleMetaKey);
        }
        else {
            var server = new HttpServer(rootPath, moduleMetaKey, bootstrapModule, authProvider);
            HttpServer.serverInstances.set(moduleMetaKey, server);
            return server;
        }
    };
    /**
     * Get the application instance based on moduleMetaKay and instanceId
     *
     * @param {number} instanceId
     * @param {string} moduleMetaKey
     * @returns {e.Application}
     */
    HttpServer.getInstance = function (instanceId, moduleMetaKey) {
        if (moduleMetaKey === void 0) { moduleMetaKey = meta_key_1.ModuleMetaKey; }
        var instance = HttpServer.serverInstances.get(moduleMetaKey);
        return instance && instance.httpListeners.has(instanceId)
            ? instance.httpListeners.get(instanceId)
            : null;
    };
    /**
     * set all the functions which should be used as middlewares for each request
     *
     * @param {IExpressCallback} middlewares
     * @returns {HttpServer}
     */
    HttpServer.prototype.setMiddlewares = function () {
        var middlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
        }
        this.middlewares = middlewares;
        return this;
    };
    /**
     * set static file handler
     *
     * @param {string} pathToStatic - path to your static files
     * @param {string} route - path to use as route - ex. app.use(path,()=>void)
     */
    HttpServer.prototype.setStatic = function (pathToStatic, route) {
        var cb = function (app) { return route
            ? app.use(route, express.static(pathToStatic))
            : app.use(express.static(pathToStatic)); };
        this.viewMiddleware.splice(0, 0, cb);
        return this;
    };
    /**
     * set all the functions which should be used as error handlers for each request
     *
     * @param {IExpressCallback} handlers
     * @returns {HttpServer}
     */
    HttpServer.prototype.setErrorHandlers = function () {
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        this.handlers = handlers;
        return this;
    };
    /**
     * storing a new http server instance with declared middlewares and fallback
     * based on instanceID.
     *
     * @param {number|string} instanceId - the key used to store http server instance for later usage
     * @returns {any}
     */
    HttpServer.prototype.build = function (instanceId) {
        if (instanceId === void 0) { instanceId = this.instanceId; }
        this.setInstanceId(instanceId);
        var that = this;
        var httpInstance = this.serverInstance
            .setConfig(function (app) {
            that.metaMiddlewares.forEach(function (middleware) { return middleware(app); });
            that.middlewares.forEach(function (middleware) { return middleware(app); });
            that.viewMiddleware.forEach(function (middleware) { return middleware(app); });
        })
            .setErrorConfig(function (app) {
            that.handlers.forEach(function (middleware) { return middleware(app); });
        })
            .build();
        this.httpListeners.set(this.instanceId, httpInstance);
        return this;
    };
    /**
     * setting an http server instance based on port number
     * instance store in a map for later use
     *
     * @param {number} port
     * @param {Function} callback
     * @returns {"http".Server}
     */
    HttpServer.prototype.listen = function (port, callback) {
        if (callback === void 0) { callback = function (err) {
        }; }
        var server = this.httpListeners.has(this.instanceId)
            ? this.httpListeners.get(this.instanceId)
            : null;
        if (!server) {
            return callback("No server instance found for port " + port);
        }
        return server.listen(port, null, function (err) {
            if (!err) {
                console.log(icons_1.SUGOI_ICON);
            }
            callback(err);
        });
    };
    HttpServer.prototype.loadModules = function (module, container) {
        var _this = this;
        new module();
        var rootModuleMeta = Reflect.getMetadata(this.moduleMetaKey, module);
        for (var _i = 0, _a = rootModuleMeta.services; _i < _a.length; _i++) {
            var service = _a[_i];
            this.registerService(container, service);
        }
        rootModuleMeta.modules = rootModuleMeta.modules || [];
        for (var _b = 0, _c = rootModuleMeta.modules; _b < _c.length; _b++) {
            var mod = _c[_b];
            var metadata = Reflect.getMetadata(this.moduleMetaKey, mod);
            var services = metadata.services, modules = metadata.modules;
            for (var _d = 0, services_1 = services; _d < services_1.length; _d++) {
                var service = services_1[_d];
                this.registerService(container, service);
            }
            if (modules)
                modules.forEach(function (subModule) { return _this.loadModules(subModule, container); });
        }
    };
    HttpServer.prototype.setNamespace = function (moduleMetaKey) {
        this.moduleMetaKey = moduleMetaKey;
    };
    HttpServer.prototype.getNamespace = function () {
        return this.moduleMetaKey;
    };
    HttpServer.prototype.setInstanceId = function (instanceId) {
        this.instanceId = instanceId;
    };
    HttpServer.prototype.getInstanceId = function () {
        return this.instanceId;
    };
    HttpServer.prototype.registerService = function (container, service) {
        var serviceName = service.name;
        container.bind(service).to(service).inSingletonScope();
        service = container.get(service);
        var insRef = {
            factory: (function () { return service; }).bind(service)
        };
        container.bind(serviceName).toFactory(insRef.factory);
        container.bind(Symbol.for(serviceName)).toFactory(insRef.factory);
    };
    HttpServer.serverInstances = new Map();
    return HttpServer;
}());
exports.HttpServer = HttpServer;
