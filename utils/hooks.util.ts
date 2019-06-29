import {HTTP_METHOD} from "../constants/methods.constant";
import {HttpServer} from "../classes/http-server.class";
const END_EVENT = 'finish';


export const HOOKS_KEY_PREFIX = "SUG__HOOKS";

export enum HOOK_TYPE {
    BEFORE = 'BEFORE',
    AFTER = 'AFTER'
}

export type TExpressMiddleware = (req, res, next) => any;
export type THookMiddleware = { identifier: string, callback: TExpressMiddleware, priority?: number }

export function getHookKey(type: HOOK_TYPE) {
    return `${HOOKS_KEY_PREFIX}_${type}`;
}

export function appendBeforeHook(path: string, method: HTTP_METHOD, ...callbacks: Array<THookMiddleware>);
export function appendBeforeHook(callback: THookMiddleware, method: HTTP_METHOD, ...callbacks: Array<THookMiddleware>);
export function appendBeforeHook(path: string, callbackMethod: THookMiddleware, ...callbacks: Array<THookMiddleware>);
export function appendBeforeHook(callback: THookMiddleware, callbackMethod: THookMiddleware, ...callbacks: Array<THookMiddleware>);
export function appendBeforeHook(callback: THookMiddleware, ...callbacks: Array<THookMiddleware>);
export function appendBeforeHook(pathOrCallback: string | THookMiddleware, methodOrCallback: HTTP_METHOD | THookMiddleware, ...callbacks: Array<THookMiddleware>) {
    extendCallbacks(pathOrCallback, methodOrCallback, HOOK_TYPE.BEFORE, ...callbacks);
}

export function appendAfterHook(path: string, method: HTTP_METHOD, ...callbacks: Array<THookMiddleware>);
export function appendAfterHook(callback: THookMiddleware, method: HTTP_METHOD, ...callbacks: Array<THookMiddleware>);
export function appendAfterHook(path: string, callbackMethod: THookMiddleware, ...callbacks: Array<THookMiddleware>);
export function appendAfterHook(callback: THookMiddleware, callbackMethod: THookMiddleware, ...callbacks: Array<THookMiddleware>);
export function appendAfterHook(callback: THookMiddleware, ...callbacks: Array<THookMiddleware>);
export function appendAfterHook(pathOrCallback: string | THookMiddleware, methodOrCallback: HTTP_METHOD | THookMiddleware, ...callbacks: Array<THookMiddleware>) {
    extendCallbacks(pathOrCallback, methodOrCallback, HOOK_TYPE.AFTER, ...callbacks);
}

export function applyBeforeHooks(app, callbacksObject) {
    if (!callbacksObject) {
        return;
    }

    Object.keys(callbacksObject).forEach(path => {
        Object.keys(callbacksObject[path]).forEach((method: HTTP_METHOD) => {
            const callbacks = getCallbacksFromObject(callbacksObject, path, method);
            callbacks.sort((a, b) => a.priority - b.priority);
            applyHook(app, path, method, ...callbacks);
        })
    })
}

export function applyAfterHooks(app, callbacksObject) {
    if (!callbacksObject) {
        return;
    }
    Object.keys(callbacksObject).forEach(path => {
        Object.keys(callbacksObject[path]).forEach((method: HTTP_METHOD) => {
            applyHook(app, path, method, (req, res, next) => {
                getCallbacksFromObject(callbacksObject, path, method).sort((a, b) => a.priority - b.priority);
                res.once(END_EVENT, function () {
                    let i = -1;
                    const callbacks = getCallbacksFromObject(callbacksObject, path, method);

                    function nextCB() {
                        if (++i < callbacksObject[path][method].length) {
                            callbacks[i](req, res, nextCB);
                        }
                    }

                    nextCB();
                });
                next()
            });
        });
    });
}

function extendCallbacks(pathOrCallback: string | THookMiddleware, methodOrCallback: HTTP_METHOD | THookMiddleware, type: HOOK_TYPE, ...callbacks) {
    pathOrCallback = pathOrCallback || '*';
    methodOrCallback = methodOrCallback || HTTP_METHOD.ALL;

    let path = pathOrCallback as string;
    let method = methodOrCallback as string;

    if (typeof pathOrCallback !== 'string') {
        callbacks.unshift(pathOrCallback);
        path = '*'
    }
    if (typeof methodOrCallback !== 'string') {
        callbacks.unshift(pathOrCallback);
        method = HTTP_METHOD.ALL
    }
    const hookKey = getHookKey(type);
    const existingCallbacks = Reflect.getMetadata(hookKey, HttpServer) || {};
    if (!existingCallbacks[path]) {
        existingCallbacks[path] = {}
    }
    if (!existingCallbacks[path][method]) {
        existingCallbacks[path][method] = []
    }
    const callbacksArray = existingCallbacks[path][method] as Array<any>;
    callbacksArray.push.apply(callbacksArray, callbacks);
    Reflect.defineMetadata(hookKey, existingCallbacks, HttpServer);
}

function applyHook(app, path, method: HTTP_METHOD, ...callbacks) {
    switch (method) {
        case HTTP_METHOD.ALL:
            app.use(path, ...callbacks);
            break;
        default:
            app[method.toLowerCase()](path, ...callbacks);
            break;

    }

}

function getCallbacksFromObject(callbacksObject: any, path: string, method: HTTP_METHOD): Array<any> {
    const callbackObjects = Object['values'](callbacksObject[path][method]) as Array<any>;
    return callbackObjects.map(obj => obj.callback);
}