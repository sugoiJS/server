import {ModuleItem} from "./module-item.interface";
import {IModuleMetadata} from "./module-meta.interface";
import {IServerModule} from "./server-module.interface";
import {TNewable} from "./newable.type";
import {CRUDController} from "../index";
import {ICRUDController} from "./crud-controller.interface";

export interface IProvider {
    provide: any,
    useName: string,
    type?: 'singleton'
        |  'factory'
        |  'constant'
}

export interface IModuleMetadata {
    controllers?: Array<ModuleItem<any> | ICRUDController<any>>;
    services?: Array<ModuleItem<any> | IProvider>;
    modules?: Array<TNewable<IServerModule> | any>;
}