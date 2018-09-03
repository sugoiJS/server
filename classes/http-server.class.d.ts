/// <reference types="node" />
import { IExpressCallback } from "../interfaces/express-callback.interface";
import { IModuleMetadata } from "../interfaces/module-meta.interface";
import * as express from "express";
import { AuthProvider } from "./auth-provider.class";
import { Server } from "http";
import { Container } from '@sugoi/core';
import { TNewable } from "../interfaces/newable.type";
export declare class HttpServer {
    private static serverInstances;
    private middlewares;
    private viewMiddleware;
    private handlers;
    private moduleMetaKey;
    private serverInstance;
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
    protected constructor(rootPath: string, container: Container, moduleMetaKey: string, module: IModuleMetadata, authProvider: TNewable<AuthProvider>);
    /**
     * Initialize the application by creating new httpServer.
     *
     * A bootstrap module (bootstrapModule) should be decorated with SugModule and 'modules' property
     * which contains all of the related modules.
     * Depended on moduleMetaKey for separate applications.
     *
     * @param bootstrapModule - the root module which use as entry point
     * @param {string} rootPath - the prefix for all of the routes
     * @param {string} moduleMetaKey - related to SugModule metaKey
     * @param {AuthProvider} authProvider - Authentication & authorization service which will use for @AuthPolicy and the Inversify express `this.httpContext` & @Principal
     * @param {Container} container - the inversify Container which will be use to for binding the services
     * @returns {HttpServer}
     */
    static init(bootstrapModule: any, rootPath?: string, moduleMetaKey?: string, authProvider?: TNewable<AuthProvider>, container?: Container): HttpServer;
    /**
     * Get the application instance based on moduleMetaKay and port
     *
     * @param {string} moduleMetaKey
     * @param {number} port
     * @returns {e.Application}
     */
    static getInstance(moduleMetaKey: string, port: number): express.Application;
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
     * based on port.
     *
     * @param {number} port
     * @returns {any}
     */
    build(port: number): express.Application | this;
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
}
