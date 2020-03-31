import {ModuleItem} from "./module-item.interface";
import {IServerModule} from "./server-module.interface";
import {TNewable} from "./newable.type";
import { TCRUDController } from "../classes/crud-controller.class";

export interface IProvider {
    provide: any,
    useName: string,
    type?: 'singleton'
        |  'factory'
        |  'constant'
}

export interface IModuleMetadata {
    controllers?: Array<ModuleItem<any> | TCRUDController>;
    services?: Array<ModuleItem<any> | IProvider>;
    modules?: Array<TNewable<IServerModule> | any>;
}