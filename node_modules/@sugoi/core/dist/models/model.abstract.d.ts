import { CONNECTION_STATUS } from "../index";
import { Observable } from "rxjs/Observable";
export declare abstract class ModelAbstract {
    static status: CONNECTION_STATUS;
    id: string;
    protected collectionName: string;
    constructor();
    static find(query?: any, options?: any): Observable<Array<any>>;
    static findOne(query?: any, options?: any): Observable<Array<any>>;
    protected static findEmitter(query: any, options?: any): Observable<object>;
    save(options?: any | string): Observable<any>;
    protected abstract saveEmitter(options: any): Promise<any>;
    protected beforeValidate(): void;
    validate(): any | true;
    protected beforeSave(): void;
    protected afterSave(): void;
    update(options?: any | string): Observable<any>;
    protected abstract updateEmitter(options: any): Promise<any>;
    beforeUpdate(): void;
    afterUpdate(): void;
    protected abstract removeEmitter(): Promise<any>;
    remove(query?: any): Observable<any>;
    protected static clone(classIns: any, data: any): object;
    protected static castStringQuery(query: string | object): object;
}
