export declare class ContainerRepo {
    symbol: symbol;
    dep: any;
    constructor(dep: object, bindName?: string);
    static builder(dep: object, bindName?: string): ContainerRepo;
}
