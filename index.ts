import "@sugoi/core";

export * from "./core-utils";
export * from "./responses/index";

/**
 * Init utilities
 */
import {ParametersValidatorUtil} from "./utils/parameters-validator.util";
import {AuthorizationUtils} from "./utils/authorization.utils";
import {getConfiguration, setConfiguration, ConfigurationTypes} from "@sugoi/core";

export {getConfiguration, setConfiguration, ConfigurationTypes};

/**
 * MODULE EXPORTS
 */
export {HTTP_METHOD} from "./constants/methods.constant";

export {Injector} from "./classes/injector.class";

export {defaultErrorHandler} from "./utils/default-error-handler.util";

export {HttpResponse} from "./classes/http-response.class";

export {IServerModule} from "./interfaces/server-module.interface";

export {TStringOrNumber} from "./decorators/authorization-policy.decorator";

export {AuthProvider} from "./classes/auth-provider.class";

export {ParametersValidatorUtil};

export {AuthorizationUtils};

export {SchemaTypes, TPolicy, TComparableSchema, Policy, UsePolicy, ComparableSchema} from "@sugoi/core";

export {RequestSchemaPolicy} from "./decorators/request-schema-policy.decorator";

export {ModuleMetaKey} from "./constants/meta-key";

export {IModuleMetadata} from "./interfaces/module-meta.interface";

export {IExpressCallback} from "./interfaces/express-callback.interface";

export {HttpServer, SUG_CONFIGURATION} from "./classes/http-server.class";

export {ModuleItem} from "./interfaces/module-item.interface";

export * from "./decorators";

export {CRUDController,CRUDControllerFactory} from "./classes/crud-controller.class";

export {ISecurityConfiguration} from "./interfaces/security.interface";

export {IConfiguration} from "./interfaces/configuration.interface";

import * as express from 'express';

export {express}
