import { ModuleItem } from "./module-item.interface";
import { IServerModule } from "./server-module.interface";
import { TNewable } from "./newable.type";
export interface IModuleMetadata {
    controllers?: ModuleItem<any>[];
    services?: ModuleItem<any>[];
    modules?: Array<TNewable<IServerModule> | any>;
    dependencies?: Array<TNewable<IServerModule>>;
}
