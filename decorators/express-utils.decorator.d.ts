import * as expressUtils from "inversify-express-utils";
import { controller, httpMethod, httpGet, httpPut, httpPost, httpPatch, httpHead, all, httpDelete, request, response, requestParam, queryParam, requestBody, requestHeaders, cookies, next, injectHttpContext, getRouteInfo, BaseMiddleware, BaseHttpController, TYPE } from "inversify-express-utils";
declare const Controller: typeof expressUtils.controller, HttpPost: typeof expressUtils.httpPost, HttpPut: typeof expressUtils.httpPut, HttpGet: typeof expressUtils.httpGet, HttpDelete: typeof expressUtils.httpDelete, HttpHead: typeof expressUtils.httpHead, HttpPatch: typeof expressUtils.httpPatch, HttpMethod: typeof expressUtils.httpMethod, All: typeof expressUtils.all, Request: () => ParameterDecorator, Response: () => ParameterDecorator, RequestParam: (paramName: string) => ParameterDecorator, QueryParam: (queryParamName: string) => ParameterDecorator, RequestBody: () => ParameterDecorator, RequestHeaders: (headderName: string) => ParameterDecorator, Cookies: (cookieName: string) => ParameterDecorator, Next: () => ParameterDecorator;
export { expressUtils, controller, httpMethod, httpGet, httpPut, httpPost, httpPatch, httpHead, all, httpDelete, request, response, requestParam, queryParam, requestBody, requestHeaders, cookies, next, Controller, HttpPost, HttpPut, HttpGet, HttpDelete, HttpHead, HttpPatch, HttpMethod, All, Request, Response, RequestParam, QueryParam, RequestBody, RequestHeaders, Cookies, Next, injectHttpContext, getRouteInfo, BaseMiddleware, BaseHttpController, TYPE };
