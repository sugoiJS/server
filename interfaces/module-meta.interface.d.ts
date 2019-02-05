import { ModuleItem } from "./module-item.interface";
import { IServerModule } from "./server-module.interface";
import { TNewable } from "./newable.type";
export interface IProvider {
    provide: any;
    useName: string;
    type?: 'singleton' | 'factory' | 'constant';
}
export interface IModuleMetadata {
    controllers?: ModuleItem<Object>[];
    services?: Array<ModuleItem<Object> | IProvider>;
    modules?: Array<TNewable<IServerModule> | any>;
    dependencies?: Array<TNewable<IServerModule>>;
}
