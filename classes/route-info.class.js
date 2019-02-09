"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RouteInfo {
    constructor(routes) {
        this.routes = routes;
    }
    valueOf() {
        return this.routes;
    }
    toDictionary() {
        const dict = {};
        this.routes.forEach(route => {
            route.endpoints.forEach(endpoint => {
                dict[endpoint.route] = { controller: route.controller, args: endpoint.args };
            });
        });
        return dict;
    }
    toString() {
        JSON.stringify(this.toDictionary());
    }
}
exports.RouteInfo = RouteInfo;
;
