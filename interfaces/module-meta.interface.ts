import {ModuleItem} from "./module-item.interface";
import {IModuleMetadata} from "./module-meta.interface";

export interface IModuleMetadata {
    controllers?: ModuleItem<any>[]
    services?: ModuleItem<any>[]
    modules?: any[]
}