import { Container } from '@sugoi/core';
import { InversifyExpressServer } from 'inversify-express-utils';
import { IExpressCallback } from "../interfaces/express-callback.interface";
import { IModuleMetadata } from "../interfaces/module-meta.interface";
import * as express from "express";
import { AuthProvider } from "./auth-provider.class";
import { TNewable } from "../interfaces/newable.type";
export declare class HttpServer {
    readonly container: Container;
    protected _container: Container;
    private _httpsConfiguration;
    private static serverInstances;
    private _asyncModules;
    private metaMiddlewares;
    private middlewares;
    private viewMiddleware;
    private handlers;
    private moduleMetaKey;
    private instanceId;
    readonly serverInstance: InversifyExpressServer;
    private _serverInstance;
    private httpListeners;
    private _rootPath;
    /**
     * rootPath stands for the server uri prefix
     * @returns {string}
     */
    readonly rootPath: string;
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
    protected constructor(rootPath: string, moduleMetaKey: string, module: IModuleMetadata, authProvider: TNewable<AuthProvider>, httpsConfiguration: any);
    static init(bootstrapModule: any): HttpServer;
    static init(bootstrapModule: any, rootPath: string): HttpServer;
    static init(bootstrapModule: any, rootPath: string, namespaceKey?: string): HttpServer;
    static init(bootstrapModule: any, rootPath: string, namespaceKey?: string, authProvider?: TNewable<AuthProvider>): HttpServer;
    static init(bootstrapModule: any, rootPath: string, namespaceKey?: string, authProvider?: TNewable<AuthProvider>, httpsConfiguration?: any): HttpServer;
    /**
     * Get the application instance based on moduleMetaKay and instanceId
     *
     * @param {number} instanceId
     * @param {string} moduleMetaKey
     * @returns {e.Application}
     */
    static getInstance(instanceId: number | string, moduleMetaKey?: string): express.Application;
    /**
     * set all the functions which should be used as middlewares for each request
     *
     * @param {IExpressCallback} middlewares
     * @returns {HttpServer}
     */
    setMiddlewares(...middlewares: Array<IExpressCallback>): this;
    /**
     * set static file handler
     *
     * @param {string} pathToStatic - path to your static files
     * @param {string} route - path to use as route - ex. app.use(path,()=>void)
     */
    setStatic(pathToStatic: string, route?: string): this;
    /**
     * set all the functions which should be used as error handlers for each request
     *
     * @param {IExpressCallback} handlers
     * @returns {HttpServer}
     */
    setErrorHandlers(...handlers: Array<IExpressCallback>): this;
    /**
     * storing a new http server instance with declared middlewares and fallback
     * based on instanceID.
     *
     * @param {number|string} instanceId - the key used to store http server instance for later usage
     * @returns {any}
     */
    build(instanceId?: string | number): HttpServer;
    setHttpsConfiguration(httpsConfiguration: any): void;
    /**
     * setting an http server instance based on port number
     * instance store in a map for later use
     *
     * @param {number} port
     * @param {string} hostname
     * @param {Function} callback
     * @returns {"http".Server}
     */
    listen(port: number): any;
    listen(port: number, callback: Function): any;
    listen(port: number, hostname: string): any;
    listen(port: number, hostname: string, callback: Function): any;
    private initListener;
    protected loadModules(module: any, container: Container): void;
    private handleModules;
    private loadModule;
    protected setNamespace(moduleMetaKey: string): void;
    getNamespace(): string;
    setInstanceId(instanceId: string | number): void;
    getInstanceId(): string | number;
    private registerServices;
}
