export class RouteInfo {
    private routes: Array<Route>;

    constructor(routes) {
        this.routes = routes;
    }

    public valueOf() {
        return this.routes;
    }

    toDictionary() {
        const dict = {};
        this.routes.forEach(route => {
            route.endpoints.forEach(endpoint => {
                dict[endpoint.route] = {controller: route.controller, args: endpoint.args};
            })
        });
        return dict;
    }

    toString() {
        JSON.stringify(this.toDictionary())
    }

}

export interface Route {
    controller: string;
    endpoints: any[];
};
