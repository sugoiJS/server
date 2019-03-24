import { Container, interfaces } from "@sugoi/core";
export declare class Injector {
    private static Container;
    private _container;
    constructor();
    static setContainer(container: Container): void;
    get<T = any>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T;
    resolve<T = any>(constructorFunction: interfaces.Newable<T>): T;
}
