export declare class RouteInfo {
    private routes;
    constructor(routes: any);
    toArray(): Array<Route>;
    toDictionary(): {
        [endpoint: string]: {
            controller: string;
            args: string[];
        };
    };
    toString(): string;
}
export interface Route {
    controller: string;
    endpoints: any[];
}
