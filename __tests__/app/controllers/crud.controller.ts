import {
    CRUDController
} from "../../../index";

export class DummyModel {
    static db: Map<string, DummyModel> = new Map();
    static hookChecker;
    save() {
        (<any>this.constructor).db.set(this['id'].toString(), Object.assign({}, this));
        return this;
    }

    static updateById(id, data: any) {
        data.id = id;
        this.db.set(data.id.toString(), {...data});
        return data;
    }

    static removeById(id) {
        const item = this.db.get(id.toString());
        this.db.delete(id.toString());
        return item;
    }

    static findById(id) {
        return this.db.get(id.toString());
    }

    static find() {
        return Array.from(this.db.values());
    }

}

export class DummyModelExtended extends DummyModel {
    static db: Map<string, DummyModel> = new Map();

    static getModelName() {
        return 'DummyModel2';
    }
}
