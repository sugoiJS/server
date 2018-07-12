/// <reference types="node" />
import { IExpressCallback } from "../interfaces/express-callback.interface";
import { IModuleMetadata } from "../interfaces/module-meta.interface";
import { Application } from "express";
import { AuthProvider } from "./auth-provider.class";
import { Server } from "http";
import { Container } from '@sugoi/core';
export declare class HttpServer {
    private static serverInstances;
    private middlewares;
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
    protected constructor(rootPath: string, container: Container, moduleMetaKey: string, module: IModuleMetadata, authProvider: AuthProvider);
    /**
     * Initialize the application by creating new httpServer
     * bootstrap module should annotate with SugModule, use modules property
     * for load all of the related modules for this  moduleMetaKey
     * Depended on moduleMetaKey for uniqueness.
     *
     * @param boostrapModule
     * @param {string} rootPath - the prefix for all of the routes
     * @param {string} moduleMetaKey - related to SugModule metaKey
     * @param {AuthProvider} authProvider -
     * @param {Container} container - the inversify Container which will be use to for binding the services
     * @returns {HttpServer}
     */
    static init(boostrapModule: any, rootPath?: string, moduleMetaKey?: string, authProvider?: AuthProvider, container?: Container): HttpServer;
    /**
     * Get the instance application object based on moduleMetaKay and port
     *
     * @param {string} moduleMetaKey
     * @param {number} port
     * @returns {e.Application}
     */
    static getInstance(moduleMetaKey: string, port: number): Application;
    /**
     * set all the functions which should be used as middlewares for each request
     *
     * @param {IExpressCallback} middlewares
     * @returns {HttpServer}
     */
    setMiddlewares(...middlewares: Array<IExpressCallback>): this;
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
    build(port: number): Application | this;
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
}
