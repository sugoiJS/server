import {Container, Injectable, interfaces} from "@sugoi/core";

@Injectable()
export class Injector{
    private static container: Container;
    private _container: Container;

    constructor(
    ){
        this._container = Injector.container;
        const proxy = new Proxy(this._container,{});
        Object.assign(this, proxy);
    }


    static setContainer(container: Container) {
        this.container = container;
    }

    get<T = any>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
        return this._container.get<T>(serviceIdentifier);
    }

    resolve<T = any>(constructorFunction: interfaces.Newable<T>): T{
        return this._container.resolve<T>(constructorFunction);
    }

    getContainer(): Container{
        return this._container;
    }
}