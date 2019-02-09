export interface ModuleItem<T> extends Function {
    new (...args: any[]): T;
}
