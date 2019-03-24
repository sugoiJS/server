import {ModuleItem} from "./module-item.interface";
import {IModuleMetadata} from "./module-meta.interface";
import {IServerModule} from "./server-module.interface";
import {TNewable} from "./newable.type";

export interface IProvider {
    provide: any,
    useName: string,
    type?: 'singleton'
        |  'factory'
        |  'constant'
}

export interface IModuleMetadata {
    controllers?: ModuleItem<any>[];
    services?: Array<ModuleItem<any> | IProvider>;
    modules?: Array<TNewable<IServerModule> | any>;
}