export declare class RouteInfo {
    private routes;
    constructor(routes: any);
    valueOf(): Route[];
    toDictionary(): {};
    toString(): void;
}
export interface Route {
    controller: string;
    endpoints: any[];
}
