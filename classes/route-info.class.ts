export class RouteInfo {
    private routes: Array<Route>;

    constructor(routes) {
        this.routes = routes;
    }

    public toArray(): Array<Route> {
        return this.routes;
    }

    toDictionary(): { [endpoint: string]: { controller: string, args: string[] } } {
        const dict = {};
        this.toArray().forEach(route => {
            route.endpoints.forEach(endpoint => {
                dict[endpoint.route] = {controller: route.controller, args: endpoint.args};
            })
        });
        return dict;
    }

    toString() {
        return JSON.stringify(this.toDictionary())
    }

}

export interface Route {
    controller: string;
    endpoints: any[];
};
