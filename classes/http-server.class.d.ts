/// <reference types="node" />
import { InversifyExpressServer } from 'inversify-express-utils';
import { IExpressCallback } from "../interfaces/express-callback.interface";
import { IModuleMetadata } from "../interfaces/module-meta.interface";
import * as express from "express";
import { AuthProvider } from "./auth-provider.class";
import { Server } from "http";
import { Container } from '@sugoi/core';
import { TNewable } from "../interfaces/newable.type";
export declare class HttpServer {
    protected _container: Container;
    readonly container: Container;
    private static serverInstances;
    private metaMiddlewares;
    private middlewares;
    private viewMiddleware;
    private handlers;
    private moduleMetaKey;
    private instanceId;
    private _serverInstance;
    readonly serverInstance: InversifyExpressServer;
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
    protected constructor(rootPath: string, moduleMetaKey: string, module: IModuleMetadata, authProvider: TNewable<AuthProvider>);
    static init(bootstrapModule: any): HttpServer;
    static init(bootstrapModule: any, rootPath: string): HttpServer;
    static init(bootstrapModule: any, rootPath: string, moduleMetaKey?: string): HttpServer;
    static init(bootstrapModule: any, rootPath: string, moduleMetaKey?: string, authProvider?: TNewable<AuthProvider>): HttpServer;
    /**
     * Get the application instance based on moduleMetaKay and instanceId
     *
     * @param {number} instanceId
     * @param {string} moduleMetaKey
     * @returns {e.Application}
     */
    static getInstance(instanceId: number, moduleMetaKey?: string): express.Application;
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
    build(instanceId?: string | number): this;
    /**
     * setting an http server instance based on port number
     * instance store in a map for later use
     *
     * @param {number} port
     * @param {Function} callback
     * @returns {"http".Server}
     */
    listen(port: number, callback?: Function): Server;
    protected loadModules(module: any, container: Container): void;
    protected setNamespace(moduleMetaKey: string): void;
    getNamespace(): string;
    setInstanceId(instanceId: string | number): void;
    getInstanceId(): string | number;
    private registerService;
}
