"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RouteInfo {
    constructor(routes) {
        this.routes = routes;
    }
    toArray() {
        return this.routes;
    }
    toDictionary() {
        const dict = {};
        this.toArray().forEach(route => {
            route.endpoints.forEach(endpoint => {
                dict[endpoint.route] = { controller: route.controller, args: endpoint.args };
            });
        });
        return dict;
    }
    toString() {
        return JSON.stringify(this.toDictionary());
    }
}
exports.RouteInfo = RouteInfo;
;
