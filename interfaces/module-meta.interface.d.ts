import { ModuleItem } from "./module-item.interface";
export interface IModuleMetadata {
    controllers?: ModuleItem<any>[];
    services?: ModuleItem<any>[];
    modules?: any[];
}
