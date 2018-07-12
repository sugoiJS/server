import { interfaces as inversifyInterfaces } from "inversify";
import { interfaces } from "./interfaces";
export declare function getRouteInfo(container: inversifyInterfaces.Container): {
    controller: any;
    endpoints: {
        route: string;
        args?: string[] | undefined;
    }[];
}[];
export declare function getRawMetadata(container: inversifyInterfaces.Container): {
    controllerMetadata: interfaces.ControllerMetadata;
    methodMetadata: interfaces.ControllerMethodMetadata[];
    parameterMetadata: interfaces.ControllerParameterMetadata;
}[];
